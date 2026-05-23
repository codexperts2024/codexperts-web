ALTER TABLE public.profiles
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN nickname TEXT;

UPDATE public.profiles SET first_name = name WHERE name IS NOT NULL;

ALTER TABLE public.profiles DROP COLUMN name;
