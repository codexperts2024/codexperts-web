-- Store event start/end with time (was date-only)

ALTER TABLE public.events
  ALTER COLUMN event_date TYPE TIMESTAMPTZ
  USING event_date::timestamptz;

ALTER TABLE public.events
  ALTER COLUMN end_date TYPE TIMESTAMPTZ
  USING end_date::timestamptz;
