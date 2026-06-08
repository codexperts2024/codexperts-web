-- executive_roles: tracks which executive holds which title, with full tenure history.
-- Querying end_date IS NULL returns currently active role holders.

CREATE TABLE executive_roles (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      text        NOT NULL CHECK (title IN ('President', 'Vice President', 'Treasurer')),
  start_date date        NOT NULL,
  end_date   date,
  term       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enforce at most one active holder per title at any point in time.
CREATE UNIQUE INDEX executive_roles_active_title_idx
  ON executive_roles (title)
  WHERE end_date IS NULL;

-- RLS
ALTER TABLE executive_roles ENABLE ROW LEVEL SECURITY;

-- Anyone can read executive info (needed for public About page)
CREATE POLICY "Public can read executive roles"
  ON executive_roles
  FOR SELECT
  USING (true);

-- Only admins can insert, update, or delete
CREATE POLICY "Admins can manage executive roles"
  ON executive_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
