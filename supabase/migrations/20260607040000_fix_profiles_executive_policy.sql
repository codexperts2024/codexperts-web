-- Fix infinite recursion: the previous policy caused profiles → executive_roles → profiles loop.
-- Instead, allow public SELECT for users with executive or admin role directly.

DROP POLICY IF EXISTS "Public can read executive profiles" ON profiles;

CREATE POLICY "Public can read executive profiles"
  ON profiles
  FOR SELECT
  USING (role IN ('executive', 'admin'));
