ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS google_place_id text,
  ADD COLUMN IF NOT EXISTS google_maps_url text,
  ADD COLUMN IF NOT EXISTS google_rating numeric,
  ADD COLUMN IF NOT EXISTS google_user_ratings_total integer,
  ADD COLUMN IF NOT EXISTS google_last_synced_at timestamp with time zone;