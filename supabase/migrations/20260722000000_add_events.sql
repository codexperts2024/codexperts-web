-- Events: public club event archive with executive/admin CRUD

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  body TEXT,
  event_date DATE NOT NULL,
  end_date DATE,
  location TEXT,
  campus TEXT,
  registration_url TEXT,
  cta_label TEXT DEFAULT 'Learn More',
  cover_image_url TEXT,
  gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT events_gallery_urls_is_array CHECK (jsonb_typeof(gallery_urls) = 'array')
);

CREATE INDEX events_event_date_idx ON public.events (event_date DESC);

CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY events_select_public
ON public.events
FOR SELECT
TO anon, authenticated
USING (TRUE);

CREATE POLICY events_insert_exec_admin
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY events_update_exec_admin
ON public.events
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY events_delete_exec_admin
ON public.events
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);
