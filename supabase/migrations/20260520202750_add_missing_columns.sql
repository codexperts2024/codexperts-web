-- profiles: signup form fields
ALTER TABLE public.profiles
ADD COLUMN cohort TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN status TEXT, -- 'student' | 'graduated'
ADD COLUMN occupation TEXT;

-- problems: metadata
ALTER TABLE public.problems
ADD COLUMN difficulty TEXT, -- 'easy' | 'medium' | 'hard'
ADD COLUMN category TEXT,
ADD COLUMN created_by UUID REFERENCES public.profiles(id);

-- submissions: track last edit time
ALTER TABLE public.submissions
ADD COLUMN updated_at TIMESTAMP;

-- attach existing updated_at trigger to submissions
CREATE TRIGGER set_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

