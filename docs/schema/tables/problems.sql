
CREATE TABLE problems (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL, -- Title of the problem
  description TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  sample_tests JSONB NOT NULL DEFAULT '[]'::jsonb -- [{stdin, expected_stdout}, ...] max 10 in app
);
