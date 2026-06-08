-- Add school column to executive_roles so each school can have its own
-- President / Vice President / Treasurer independently.
-- Also fixes the unique index to scope uniqueness per (title, school).

ALTER TABLE executive_roles
  ADD COLUMN school text NOT NULL DEFAULT 'Seneca College';

-- Drop the old index that only constrained by title
DROP INDEX IF EXISTS executive_roles_active_title_idx;

-- New index: at most one active holder per title per school
CREATE UNIQUE INDEX executive_roles_active_title_school_idx
  ON executive_roles (title, school)
  WHERE end_date IS NULL;
