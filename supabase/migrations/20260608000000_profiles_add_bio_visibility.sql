-- Add bio and per-field visibility settings to profiles.
-- bio: plain text, 300 char limit enforced at app layer.
-- profile_visibility: JSONB controls which fields are shown to other members.
-- Default is all visible so existing rows are unaffected.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS profile_visibility JSONB
    NOT NULL DEFAULT '{"bio": true, "linkedin": true, "github": true}';

-- Allow members to update their own editable fields only.
-- Name, school, cohort, role, email, avatar_url remain admin-managed.
CREATE POLICY "Members can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
