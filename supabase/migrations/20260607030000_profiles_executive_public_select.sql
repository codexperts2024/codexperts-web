-- Allow anonymous users to read profiles of currently active executives only.
-- This is required for the public About page to display executive info.
-- All other member profiles remain protected by existing RLS policies.

CREATE POLICY "Public can read executive profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM executive_roles
      WHERE executive_roles.user_id = profiles.id
      AND executive_roles.end_date IS NULL
    )
  );
