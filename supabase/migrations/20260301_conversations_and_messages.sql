-- Phase 3: Listing-Based Messaging Core
-- Tables: conversations, messages
-- Trigger: update_last_message_timestamp
-- RPC functions: get_conversations_for_user, get_messages_for_conversation, send_first_message

-- ============================================================
-- 1. CONVERSATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One conversation per buyer per listing
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_buyer_listing
  ON conversations(buyer_id, listing_id);

-- Performance indexes for inbox queries
CREATE INDEX IF NOT EXISTS idx_conversations_seller_id
  ON conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id
  ON conversations(buyer_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON messages(conversation_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. TRIGGER: auto-update last_message_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_last_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_last_message_at ON messages;
CREATE TRIGGER trg_update_last_message_at
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_message_timestamp();

-- ============================================================
-- 4. RLS POLICIES — conversations
-- ============================================================

-- SELECT: buyer or seller can view their own conversations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversations' AND policyname = 'Participants can select own conversations'
  ) THEN
    CREATE POLICY "Participants can select own conversations"
      ON conversations FOR SELECT
      USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
  END IF;
END
$$;

-- INSERT: only buyer can create a conversation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversations' AND policyname = 'Buyers can insert conversations'
  ) THEN
    CREATE POLICY "Buyers can insert conversations"
      ON conversations FOR INSERT
      WITH CHECK (auth.uid() = buyer_id);
  END IF;
END
$$;

-- UPDATE: participants can update (for future close logic)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversations' AND policyname = 'Participants can update own conversations'
  ) THEN
    CREATE POLICY "Participants can update own conversations"
      ON conversations FOR UPDATE
      USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
  END IF;
END
$$;

-- ============================================================
-- 5. RLS POLICIES — messages
-- ============================================================

-- SELECT: participants of the conversation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'messages' AND policyname = 'Participants can select messages'
  ) THEN
    CREATE POLICY "Participants can select messages"
      ON messages FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM conversations c
          WHERE c.id = messages.conversation_id
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
      );
  END IF;
END
$$;

-- INSERT: participants only, sender_id must match auth.uid()
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'messages' AND policyname = 'Participants can insert messages'
  ) THEN
    CREATE POLICY "Participants can insert messages"
      ON messages FOR INSERT
      WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
          SELECT 1 FROM conversations c
          WHERE c.id = messages.conversation_id
          AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
        )
      );
  END IF;
END
$$;

-- NO UPDATE policy on messages (immutable)
-- NO DELETE policy on messages (immutable)

-- ============================================================
-- 6. RPC: get_conversations_for_user
-- Returns conversation list with listing details, participant
-- names, and last message preview
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_conversations_for_user()
RETURNS TABLE (
  id UUID,
  listing_id UUID,
  buyer_id UUID,
  seller_id UUID,
  status TEXT,
  created_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ,
  listing_title TEXT,
  listing_image TEXT,
  listing_address TEXT,
  other_party_name TEXT,
  other_party_image TEXT,
  last_message_preview TEXT
) AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    c.listing_id,
    c.buyer_id,
    c.seller_id,
    c.status,
    c.created_at,
    c.last_message_at,
    p.title::TEXT AS listing_title,
    (p.images->>0)::TEXT AS listing_image,
    p.address::TEXT AS listing_address,
    CASE
      WHEN v_user_id = c.buyer_id THEN COALESCE(sp.agency_name::TEXT, up_seller.full_name::TEXT, 'Agent')
      ELSE COALESCE(up_buyer.full_name::TEXT, 'Buyer')
    END AS other_party_name,
    CASE
      WHEN v_user_id = c.buyer_id THEN sp.profile_image_url::TEXT
      ELSE NULL::TEXT
    END AS other_party_image,
    (
      SELECT LEFT(m.content, 80)
      FROM messages m
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS last_message_preview
  FROM conversations c
  LEFT JOIN properties p ON p.id = c.listing_id
  LEFT JOIN user_profiles up_buyer ON up_buyer.id = c.buyer_id
  LEFT JOIN user_profiles up_seller ON up_seller.id = c.seller_id
  LEFT JOIN seller_profiles sp ON sp.user_id = c.seller_id
  WHERE c.buyer_id = v_user_id OR c.seller_id = v_user_id
  ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- 7. RPC: get_messages_for_conversation
-- Returns messages for a conversation (with auth check)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_messages_for_conversation(p_conversation_id UUID)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  sender_name TEXT
) AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify caller is a participant
  IF NOT EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = p_conversation_id
    AND (c.buyer_id = v_user_id OR c.seller_id = v_user_id)
  ) THEN
    RAISE EXCEPTION 'Access denied: not a participant';
  END IF;

  RETURN QUERY
  SELECT
    m.id,
    m.conversation_id,
    m.sender_id,
    m.content,
    m.created_at,
    COALESCE(up.full_name::TEXT, sp.agency_name::TEXT, 'User') AS sender_name
  FROM messages m
  LEFT JOIN user_profiles up ON up.id = m.sender_id
  LEFT JOIN seller_profiles sp ON sp.user_id = m.sender_id
  WHERE m.conversation_id = p_conversation_id
  ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- 8. RPC: send_first_message (atomic conversation + message)
-- Creates conversation if not exists, then inserts message.
-- Derives seller_id server-side from properties table.
-- Enforces buyer role and prevents self-messaging.
-- ============================================================
CREATE OR REPLACE FUNCTION public.send_first_message(
  p_listing_id UUID,
  p_content TEXT
)
RETURNS UUID AS $$
DECLARE
  v_buyer_id UUID := auth.uid();
  v_seller_id UUID;
  v_conversation_id UUID;
BEGIN
  IF v_buyer_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Enforce buyer role
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = v_buyer_id AND role = 'buyer'
  ) THEN
    RAISE EXCEPTION 'Only buyers can initiate conversations';
  END IF;

  -- Derive seller from listing (never trust frontend)
  SELECT user_id INTO v_seller_id
  FROM properties
  WHERE id = p_listing_id;

  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  -- Prevent self-messaging
  IF v_seller_id = v_buyer_id THEN
    RAISE EXCEPTION 'Cannot message your own listing';
  END IF;

  IF char_length(TRIM(p_content)) = 0 THEN
    RAISE EXCEPTION 'Message content cannot be empty';
  END IF;

  -- Get or create conversation (unique index handles dedup)
  INSERT INTO conversations (listing_id, buyer_id, seller_id)
  VALUES (p_listing_id, v_buyer_id, v_seller_id)
  ON CONFLICT (buyer_id, listing_id)
  DO UPDATE SET last_message_at = now()
  RETURNING id INTO v_conversation_id;

  -- Insert the message
  INSERT INTO messages (conversation_id, sender_id, content)
  VALUES (v_conversation_id, v_buyer_id, TRIM(p_content));

  -- Track inquiry analytics
  PERFORM increment_property_inquiries(p_listing_id);

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
