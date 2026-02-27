-- Phase 1: Role System & Verified Partner Infrastructure
-- Adds admin role support and partner verification flag

-- 1a. Add role column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role TEXT;
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
      CHECK (role IS NULL OR role IN ('buyer', 'agent', 'admin'));
  END IF;
END
$$;

-- 1b. Add partner flag to seller_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'seller_profiles' AND column_name = 'is_ukon_partner'
  ) THEN
    ALTER TABLE seller_profiles ADD COLUMN is_ukon_partner BOOLEAN NOT NULL DEFAULT false;
  END IF;
END
$$;

-- Index on is_ukon_partner for future queries
CREATE INDEX IF NOT EXISTS idx_seller_profiles_is_ukon_partner
  ON seller_profiles(is_ukon_partner);

-- 1c. Admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1d. RLS policies for admin access to seller_profiles
-- Admin can read all seller profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'seller_profiles' AND policyname = 'Admins can select all seller profiles'
  ) THEN
    CREATE POLICY "Admins can select all seller profiles"
      ON seller_profiles FOR SELECT
      USING (public.is_admin());
  END IF;
END
$$;

-- Admin can update any seller profile (for partner toggle)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'seller_profiles' AND policyname = 'Admins can update any seller profile'
  ) THEN
    CREATE POLICY "Admins can update any seller profile"
      ON seller_profiles FOR UPDATE
      USING (public.is_admin());
  END IF;
END
$$;

-- 1e. Public seller data function (SECURITY DEFINER bypasses RLS)
-- Returns only the 3 fields needed for property detail pages
CREATE OR REPLACE FUNCTION public.get_seller_profile_for_property(p_user_id UUID)
RETURNS TABLE (
  agency_name TEXT,
  profile_image_url TEXT,
  is_ukon_partner BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT sp.agency_name, sp.profile_image_url, sp.is_ukon_partner
  FROM seller_profiles sp
  WHERE sp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1f. Role column protection trigger
-- Prevents non-admins from modifying the role column on user_profiles
CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can modify the role column';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_user_role ON user_profiles;
CREATE TRIGGER protect_user_role
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_role_column();
