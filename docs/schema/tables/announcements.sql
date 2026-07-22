
CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  content TEXT CHECK (content IS NULL OR char_length(content) <= 20000),
  created_at TIMESTAMP DEFAULT NOW()
);
