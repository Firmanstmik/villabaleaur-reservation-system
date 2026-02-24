-- Settings tables for buyer and seller settings pages
-- Creates: seller_profiles, buyer_profiles, seller_settings, buyer_settings,
--          seller_lead_settings, user_notification_preferences

-- ============================================================
-- 1. SELLER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_name TEXT,
  license_number TEXT,
  bio TEXT,
  office_address TEXT,
  website TEXT,
  profile_image_url TEXT,
  public_profile_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own seller profile"
  ON seller_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own seller profile"
  ON seller_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own seller profile"
  ON seller_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own seller profile"
  ON seller_profiles FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 2. BUYER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS buyer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_type TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  preferred_locations TEXT[] DEFAULT '{}',
  property_type TEXT,
  timeline TEXT,
  financing_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own buyer profile"
  ON buyer_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own buyer profile"
  ON buyer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own buyer profile"
  ON buyer_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own buyer profile"
  ON buyer_profiles FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 3. SELLER SETTINGS (listing defaults)
-- ============================================================
CREATE TABLE IF NOT EXISTS seller_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  default_country TEXT,
  default_currency TEXT,
  default_ownership_type TEXT,
  default_commission_percentage NUMERIC,
  show_price_publicly BOOLEAN DEFAULT true,
  show_contact_form BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE seller_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own seller settings"
  ON seller_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own seller settings"
  ON seller_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own seller settings"
  ON seller_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own seller settings"
  ON seller_settings FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 4. BUYER SETTINGS (search & alerts)
-- ============================================================
CREATE TABLE IF NOT EXISTS buyer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enable_listing_alerts BOOLEAN DEFAULT true,
  alert_frequency TEXT DEFAULT 'daily',
  preferred_property_types TEXT[] DEFAULT '{}',
  preferred_regions TEXT[] DEFAULT '{}',
  minimum_roi NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE buyer_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own buyer settings"
  ON buyer_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own buyer settings"
  ON buyer_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own buyer settings"
  ON buyer_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own buyer settings"
  ON buyer_settings FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 5. SELLER LEAD SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS seller_lead_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications_enabled BOOLEAN DEFAULT true,
  auto_response_message TEXT,
  webhook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE seller_lead_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own lead settings"
  ON seller_lead_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lead settings"
  ON seller_lead_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lead settings"
  ON seller_lead_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own lead settings"
  ON seller_lead_settings FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 6. USER NOTIFICATION PREFERENCES (shared by buyer & seller)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Seller notifications
  inquiry_received BOOLEAN DEFAULT true,
  -- Buyer notifications
  listing_alerts BOOLEAN DEFAULT true,
  price_changes BOOLEAN DEFAULT true,
  -- Shared notifications
  system_announcements BOOLEAN DEFAULT true,
  marketing_updates BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own notification prefs"
  ON user_notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notification prefs"
  ON user_notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notification prefs"
  ON user_notification_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notification prefs"
  ON user_notification_preferences FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 7. Add first_name, last_name, country, preferred_language to user_profiles
--    (existing table — add columns if missing)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'first_name') THEN
    ALTER TABLE user_profiles ADD COLUMN first_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'last_name') THEN
    ALTER TABLE user_profiles ADD COLUMN last_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'country') THEN
    ALTER TABLE user_profiles ADD COLUMN country TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'preferred_language') THEN
    ALTER TABLE user_profiles ADD COLUMN preferred_language TEXT DEFAULT 'en';
  END IF;
END
$$;

-- ============================================================
-- 8. Storage bucket for seller profile images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller-profile-images', 'seller-profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, owner-only upload/update/delete
CREATE POLICY "Public read seller profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'seller-profile-images');

CREATE POLICY "Owner upload seller profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'seller-profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owner update seller profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'seller-profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Owner delete seller profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'seller-profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
