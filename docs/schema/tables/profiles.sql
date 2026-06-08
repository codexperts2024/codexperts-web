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
  created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
