
CREATE TABLE problems (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL, -- Title of the problem
  description TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
