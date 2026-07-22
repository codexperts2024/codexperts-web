-- Bound announcement payload size at the database layer.
ALTER TABLE public.announcements
  ADD CONSTRAINT announcements_title_length_check
    CHECK (char_length(title) <= 200),
  ADD CONSTRAINT announcements_content_length_check
    CHECK (content IS NULL OR char_length(content) <= 20000);
