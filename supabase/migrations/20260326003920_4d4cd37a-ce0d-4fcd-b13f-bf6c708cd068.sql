ALTER TABLE public.listings
  ADD COLUMN duration text,
  ADD COLUMN ideal_for text[],
  ADD COLUMN experience_type text[],
  ADD COLUMN experience_location text,
  ADD COLUMN food_available text,
  ADD COLUMN best_visit_time text;