-- Convert executive_roles.title from text+CHECK to a proper ENUM type
-- so Supabase Table Editor shows a dropdown for the title field.
-- The unique index must be dropped and recreated around the type change.

DROP INDEX IF EXISTS executive_roles_active_title_school_idx;

CREATE TYPE executive_title AS ENUM ('President', 'Vice President', 'Treasurer');

ALTER TABLE executive_roles
  DROP CONSTRAINT IF EXISTS executive_roles_title_check,
  ALTER COLUMN title TYPE executive_title
    USING title::executive_title,
  ALTER COLUMN title SET NOT NULL;

CREATE UNIQUE INDEX executive_roles_active_title_school_idx
  ON executive_roles (title, school)
  WHERE end_date IS NULL;
