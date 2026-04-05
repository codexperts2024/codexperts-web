CREATE SCHEMA IF NOT EXISTS app;
SET search_path TO app;

\i ./tables/profiles.sql
\i ./tables/problems.sql
\i ./tables/sessions.sql
\i ./tables/announcements.sql
\i ./tables/submissions.sql
\i ./tables/attendances.sql