-- Phase 2: Partnership Application System
-- Adds partnership_applications table, RLS policies, and admin RPC functions

-- 2a. Create partnership_applications table
CREATE TABLE IF NOT EXISTS partnership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_website TEXT NOT NULL,
  number_of_agents INTEGER NOT NULL,
  areas_active TEXT NOT NULL,
  strategic_motivation TEXT NOT NULL,
  linkedin TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE partnership_applications ENABLE ROW LEVEL SECURITY;

-- 2b. RLS Policies

-- Agents can insert their own application (one per user via UNIQUE constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'partnership_applications' AND policyname = 'Agents can insert own application'
  ) THEN
    CREATE POLICY "Agents can insert own application"
      ON partnership_applications FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Agents can select their own application (to show status)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'partnership_applications' AND policyname = 'Agents can select own application'
  ) THEN
    CREATE POLICY "Agents can select own application"
      ON partnership_applications FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Admins can select all applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'partnership_applications' AND policyname = 'Admins can select all applications'
  ) THEN
    CREATE POLICY "Admins can select all applications"
      ON partnership_applications FOR SELECT
      USING (public.is_admin());
  END IF;
END
$$;

-- Admins can update any application (approve/reject)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'partnership_applications' AND policyname = 'Admins can update any application'
  ) THEN
    CREATE POLICY "Admins can update any application"
      ON partnership_applications FOR UPDATE
      USING (public.is_admin());
  END IF;
END
$$;

-- 2c. Index for admin queries filtering by status
CREATE INDEX IF NOT EXISTS idx_partnership_applications_status
  ON partnership_applications(status);

-- 2d. Atomic approve/reject RPC function
-- Approving: sets application status AND grants is_ukon_partner
-- Rejecting: only sets application status
CREATE OR REPLACE FUNCTION public.review_partnership_application(
  p_application_id UUID,
  p_decision TEXT
)
RETURNS VOID AS $$
DECLARE
  v_applicant_user_id UUID;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid decision: must be approved or rejected';
  END IF;

  SELECT user_id INTO v_applicant_user_id
  FROM partnership_applications
  WHERE id = p_application_id AND status = 'pending';

  IF v_applicant_user_id IS NULL THEN
    RAISE EXCEPTION 'Application not found or already reviewed';
  END IF;

  UPDATE partnership_applications
  SET status = p_decision,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  WHERE id = p_application_id;

  IF p_decision = 'approved' THEN
    UPDATE seller_profiles
    SET is_ukon_partner = true
    WHERE user_id = v_applicant_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2e. Admin function to get all applications with applicant details
CREATE OR REPLACE FUNCTION public.get_partnership_applications_admin()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  agency_website TEXT,
  number_of_agents INTEGER,
  areas_active TEXT,
  strategic_motivation TEXT,
  linkedin TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  applicant_email TEXT,
  applicant_agency_name TEXT
) AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  RETURN QUERY
  SELECT
    pa.id,
    pa.user_id,
    pa.agency_website,
    pa.number_of_agents,
    pa.areas_active,
    pa.strategic_motivation,
    pa.linkedin,
    pa.contact_email,
    pa.contact_phone,
    pa.status,
    pa.reviewed_by,
    pa.reviewed_at,
    pa.created_at,
    au.email::TEXT AS applicant_email,
    sp.agency_name AS applicant_agency_name
  FROM partnership_applications pa
  LEFT JOIN auth.users au ON au.id = pa.user_id
  LEFT JOIN seller_profiles sp ON sp.user_id = pa.user_id
  ORDER BY
    CASE pa.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
    pa.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
