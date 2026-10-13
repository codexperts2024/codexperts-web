-- Rejection reasons are private to the applicant and reviewers, not the member directory.
CREATE TABLE public.application_rejections (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (length(btrim(reason)) BETWEEN 1 AND 1000),
  rejected_at timestamptz NOT NULL DEFAULT now(),
  rejected_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);
CREATE INDEX application_rejections_profile_date_idx
  ON public.application_rejections(profile_id, rejected_at DESC, id DESC);
ALTER TABLE public.application_rejections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.application_rejections FROM anon, authenticated;
GRANT SELECT ON public.application_rejections TO authenticated;
GRANT ALL ON public.application_rejections TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.application_rejections_id_seq TO service_role;
CREATE POLICY application_rejections_read_self_or_reviewer
  ON public.application_rejections FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR public.get_my_role() IN ('admin', 'executive'));

-- State change and its reason must either both commit or both fail.
-- Only the verified server-side Admin API may call this function.
CREATE OR REPLACE FUNCTION public.reject_application(applicant_id uuid, reviewer_id uuid, rejection_reason text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  applicant public.profiles;
  decision public.application_rejections;
BEGIN
  IF coalesce(auth.jwt()->>'role', '') <> 'service_role' THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;
  IF nullif(btrim(rejection_reason), '') IS NULL OR length(btrim(rejection_reason)) > 1000 THEN
    RAISE EXCEPTION 'A rejection reason of 1 to 1000 characters is required' USING ERRCODE = '22023';
  END IF;
  PERFORM 1 FROM public.profiles WHERE id = reviewer_id AND role IN ('admin', 'executive') FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
  SELECT * INTO applicant FROM public.profiles WHERE id = applicant_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Applicant not found' USING ERRCODE = 'P0002'; END IF;
  IF applicant.role <> 'pending' OR applicant.application_status <> 'pending' THEN
    RAISE EXCEPTION 'Application is no longer pending review' USING ERRCODE = '22023';
  END IF;
  UPDATE public.profiles SET application_status = 'rejected' WHERE id = applicant_id RETURNING * INTO applicant;
  INSERT INTO public.application_rejections(profile_id, reason, rejected_by)
    VALUES (applicant_id, btrim(rejection_reason), reviewer_id) RETURNING * INTO decision;
  RETURN to_jsonb(applicant) || jsonb_build_object('rejection_reason', decision.reason, 'rejected_at', decision.rejected_at);
END;
$$;
REVOKE ALL ON FUNCTION public.reject_application(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reject_application(uuid, uuid, text) TO service_role;

-- Earlier decisions have no recorded reason/date. Do not invent historical data.
