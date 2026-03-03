-- Phase C1: Store last_message_preview directly in conversations table
-- Eliminates client-side N+1 fetch in realtime handler

-- ============================================================
-- 1. ADD last_message_preview COLUMN
-- ============================================================
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS last_message_preview TEXT;

-- Backfill existing conversations with latest message preview
UPDATE conversations c
SET last_message_preview = sub.preview
FROM (
  SELECT DISTINCT ON (m.conversation_id)
    m.conversation_id,
    LEFT(m.content, 80) AS preview
  FROM messages m
  ORDER BY m.conversation_id, m.created_at DESC
) sub
WHERE c.id = sub.conversation_id;

-- ============================================================
-- 2. UPDATE TRIGGER to also write last_message_preview
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
      last_message_preview = LEFT(NEW.content, 80),
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

-- Trigger already exists, no need to recreate — CREATE OR REPLACE handles it
