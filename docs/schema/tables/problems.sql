
CREATE TYPE DIFFICULTY AS ENUM ('1 star', '2 star', '3 star', '4 star', '5 star');

CREATE TABLE problems (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL, -- Title of the problem
  description TEXT NOT NULL,
  difficulty DIFFICULTY NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
