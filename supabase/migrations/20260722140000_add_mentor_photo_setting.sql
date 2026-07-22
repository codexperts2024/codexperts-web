-- Mentor page photo URL (editable by executive/admin via site_settings)

INSERT INTO public.site_settings (key, value)
VALUES ('mentor_photo_url', NULL)
ON CONFLICT (key) DO NOTHING;
