-- Problem content modes: markdown (editable text) or document (docx/pdf in Storage)

ALTER TABLE public.problems
  ALTER COLUMN file_url DROP NOT NULL;

ALTER TABLE public.problems
  ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'markdown'
    CHECK (content_type IN ('markdown', 'document'));

ALTER TABLE public.problems
  ADD COLUMN IF NOT EXISTS file_format TEXT
    CHECK (file_format IS NULL OR file_format IN ('docx', 'pdf'));

-- file_url stores Storage object path when content_type = 'document'

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('problem-documents', 'problem-documents', false, 52428800)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY problem_documents_select_member_plus
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'problem-documents'
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY problem_documents_insert_exec_admin
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'problem-documents'
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY problem_documents_update_exec_admin
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'problem-documents'
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY problem_documents_delete_exec_admin
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'problem-documents'
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);
