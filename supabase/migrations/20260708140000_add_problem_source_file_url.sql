-- Store original .docx when uploads are converted to PDF for viewing

ALTER TABLE public.problems
  ADD COLUMN IF NOT EXISTS source_file_url TEXT;

COMMENT ON COLUMN public.problems.source_file_url IS
  'Storage path to original .docx when content_type=document and file_format=docx; null for PDF uploads';
