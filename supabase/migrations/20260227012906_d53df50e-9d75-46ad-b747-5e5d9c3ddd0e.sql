ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS start_datetime timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS admission_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS venue_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS music_genres text[] DEFAULT NULL;