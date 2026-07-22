CREATE TYPE member_role AS ENUM ('pending', 'member', 'executive', 'admin');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name      TEXT,
  last_name       TEXT,
  nickname        TEXT,
  email           TEXT UNIQUE NOT NULL,
  role            member_role NOT NULL DEFAULT 'pending',
  school          TEXT,
  cohort          TEXT,
  status          TEXT,
  occupation      TEXT,
  company         TEXT,
  phone           TEXT,
  linkedin        TEXT,
  github          TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  profile_visibility JSONB NOT NULL DEFAULT '{"bio": true, "linkedin": true, "github": true}',
  application_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (application_status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Blocks non-admins from changing role / application_status, and from
-- changing name / email / cohort / avatar once set. Empty → filled is
-- allowed for JoinModal onboarding. See migration
-- 20260722160000_protect_profiles_admin_columns.sql
CREATE OR REPLACE FUNCTION public.protect_profiles_admin_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
  caller_role public.member_role;
BEGIN
  IF jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  caller_role := public.get_my_role();

  IF caller_role = 'admin'::public.member_role THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Cannot change role' USING ERRCODE = '42501';
  END IF;

  IF NEW.application_status IS DISTINCT FROM OLD.application_status THEN
    RAISE EXCEPTION 'Cannot change application_status' USING ERRCODE = '42501';
  END IF;

  IF NEW.first_name IS DISTINCT FROM OLD.first_name
     AND OLD.first_name IS NOT NULL AND btrim(OLD.first_name) <> '' THEN
    RAISE EXCEPTION 'Cannot change first_name' USING ERRCODE = '42501';
  END IF;

  IF NEW.last_name IS DISTINCT FROM OLD.last_name
     AND OLD.last_name IS NOT NULL AND btrim(OLD.last_name) <> '' THEN
    RAISE EXCEPTION 'Cannot change last_name' USING ERRCODE = '42501';
  END IF;

  IF NEW.email IS DISTINCT FROM OLD.email
     AND OLD.email IS NOT NULL AND btrim(OLD.email) <> '' THEN
    RAISE EXCEPTION 'Cannot change email' USING ERRCODE = '42501';
  END IF;

  IF NEW.cohort IS DISTINCT FROM OLD.cohort
     AND OLD.cohort IS NOT NULL AND btrim(OLD.cohort) <> '' THEN
    RAISE EXCEPTION 'Cannot change cohort' USING ERRCODE = '42501';
  END IF;

  IF NEW.avatar_url IS DISTINCT FROM OLD.avatar_url
     AND OLD.avatar_url IS NOT NULL AND btrim(OLD.avatar_url) <> '' THEN
    RAISE EXCEPTION 'Cannot change avatar_url' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profiles_admin_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profiles_admin_columns();
