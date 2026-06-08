CREATE TABLE executive_roles (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      text        NOT NULL CHECK (title IN ('President', 'Vice President', 'Treasurer')),
  school     text        NOT NULL DEFAULT 'Seneca College',
  start_date date        NOT NULL,
  end_date   date,
  term       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- At most one active holder per title per school
CREATE UNIQUE INDEX executive_roles_active_title_school_idx
  ON executive_roles (title, school)
  WHERE end_date IS NULL;
