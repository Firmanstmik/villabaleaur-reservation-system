-- 1. Create listing_analytics table (views + inquiries only; saves are counted from saved_listings)
CREATE TABLE IF NOT EXISTS listing_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  inquiries INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by property
CREATE INDEX IF NOT EXISTS idx_listing_analytics_property ON listing_analytics(property_id);

-- 2. RPC function to atomically increment views (called from frontend)
CREATE OR REPLACE FUNCTION increment_property_views(p_property_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO listing_analytics (property_id, views)
  VALUES (p_property_id, 1)
  ON CONFLICT (property_id)
  DO UPDATE SET views = listing_analytics.views + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC function to atomically increment inquiries (WhatsApp click)
CREATE OR REPLACE FUNCTION increment_property_inquiries(p_property_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO listing_analytics (property_id, inquiries)
  VALUES (p_property_id, 1)
  ON CONFLICT (property_id)
  DO UPDATE SET inquiries = listing_analytics.inquiries + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable Row Level Security — public can call the RPCs, not write directly
ALTER TABLE listing_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON listing_analytics FOR SELECT USING (true);
