-- RLS and trigger fixes addressing Copilot review on PR #74 (Issue #76).
-- Covers P0 fixes (signup trigger, problems anon read, sessions token exposure,
-- search_path hardening) and the P1 profiles directory tightening.

-- 1. Allow signup to succeed: handle_new_user() trigger only inserts
--    (id, email, role), but profiles.name/school were NOT NULL.
ALTER TABLE public.profiles ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN school DROP NOT NULL;

-- 2. Harden handle_new_user(): pin search_path for the SECURITY DEFINER
--    function so object resolution can't be hijacked by a caller's search_path.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'pending'::public.member_role);
  RETURN NEW;
END;
$$;

-- 3. problems: remove anon SELECT, restrict to member+.
DROP POLICY IF EXISTS problems_select_public ON public.problems;

CREATE POLICY problems_select_member_plus
ON public.problems
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

-- 4. sessions: remove anon SELECT of active session tokens. Token validation
--    must happen server-side via the service role; the broad SELECT is only
--    needed by executive/admin dashboards.
DROP POLICY IF EXISTS sessions_select_public_active ON public.sessions;

CREATE POLICY sessions_select_exec_admin
ON public.sessions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

-- 5. profiles: split the blanket SELECT so pending users can read their own
--    row (needed for AuthContext + JoinModal) but cannot browse the member
--    directory.
--
--    A policy ON profiles cannot subquery profiles itself without triggering
--    "infinite recursion detected in policy for relation 'profiles'".
--    The fix is a SECURITY DEFINER helper that reads the caller's role with
--    row security disabled, breaking the cycle.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.member_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

DROP POLICY IF EXISTS profiles_select_all ON public.profiles;

CREATE POLICY profiles_select_self
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY profiles_select_directory_member_plus
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.get_my_role() IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
);
