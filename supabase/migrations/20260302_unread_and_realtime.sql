-- Phase 4: Unread Counts + Realtime Support
-- Adds unread tracking to conversations
-- Replaces message trigger with unread-aware version
-- Adds mark_conversation_as_read RPC
-- Hardens all SECURITY DEFINER functions with SET search_path = public

-- ============================================================
-- 1. ADD UNREAD COLUMNS
-- ============================================================
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS buyer_unread_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS seller_unread_count INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- 2. REPLACE TRIGGER FUNCTION (unread-aware)
-- ============================================================
CREATE OR REPLACE FUNCTION update_last_message_timestamp()
RETURNS TRIGGER AS $$
DECLARE
  v_buyer_id UUID;
  v_seller_id UUID;
BEGIN
  -- Lock row to prevent race conditions under concurrent inserts
  SELECT buyer_id, seller_id
  INTO v_buyer_id, v_seller_id
  FROM conversations
  WHERE id = NEW.conversation_id
  FOR UPDATE;

  UPDATE conversations
  SET last_message_at = now(),
      buyer_unread_count = CASE
        WHEN NEW.sender_id = v_seller_id THEN buyer_unread_count + 1
        ELSE buyer_unread_count
      END,
      seller_unread_count = CASE
        WHEN NEW.sender_id = v_buyer_id THEN seller_unread_count + 1
        ELSE seller_unread_count
      END
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger
DROP TRIGGER IF EXISTS trg_update_last_message_at ON messages;
CREATE TRIGGER trg_update_last_message_at
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_message_timestamp();

-- ============================================================
-- 3. MARK CONVERSATION AS READ RPC
-- ============================================================
CREATE OR REPLACE FUNCTION mark_conversation_as_read(p_conversation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_buyer_id UUID;
  v_seller_id UUID;
BEGIN
  SELECT buyer_id, seller_id
  INTO v_buyer_id, v_seller_id
  FROM conversations
  WHERE id = p_conversation_id;

  IF v_buyer_id IS NULL THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  IF auth.uid() = v_buyer_id THEN
    UPDATE conversations
    SET buyer_unread_count = 0
    WHERE id = p_conversation_id;
  ELSIF auth.uid() = v_seller_id THEN
    UPDATE conversations
    SET seller_unread_count = 0
    WHERE id = p_conversation_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 4. UPDATE get_conversations_for_user — add unread_count
-- Must DROP first because return type changed (added unread_count)
-- ============================================================
DROP FUNCTION IF EXISTS public.get_conversations_for_user();
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
  last_message_preview TEXT,
  unread_count INTEGER
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
    p.images[1]::TEXT AS listing_image,
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
    ) AS last_message_preview,
    CASE
      WHEN v_user_id = c.buyer_id THEN c.buyer_unread_count
      ELSE c.seller_unread_count
    END AS unread_count
  FROM conversations c
  LEFT JOIN properties p ON p.id = c.listing_id
  LEFT JOIN user_profiles up_buyer ON up_buyer.id = c.buyer_id
  LEFT JOIN user_profiles up_seller ON up_seller.id = c.seller_id
  LEFT JOIN seller_profiles sp ON sp.user_id = c.seller_id
  WHERE c.buyer_id = v_user_id OR c.seller_id = v_user_id
  ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- ============================================================
-- 5. HARDEN EXISTING SECURITY DEFINER FUNCTIONS
-- Add SET search_path = public to Phase 3 functions
-- ============================================================

-- get_messages_for_conversation
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- send_first_message
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

  -- Enforce buyer role: block agents/admins (users without a profile row default to buyer)
  IF EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = v_buyer_id AND role IN ('agent', 'admin')
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
