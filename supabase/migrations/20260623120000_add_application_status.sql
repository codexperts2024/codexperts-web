-- Application review state is separate from member role.
-- pending + application_status=pending: awaiting approval
-- pending + application_status=rejected: rejected applicant (no member access)
-- member+ roles: application_status=approved

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS application_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (application_status IN ('pending', 'approved', 'rejected'));

UPDATE public.profiles
SET application_status = 'approved'
WHERE role IN ('member', 'executive', 'admin');

UPDATE public.profiles
SET application_status = 'pending'
WHERE role = 'pending' AND application_status IS DISTINCT FROM 'rejected';
