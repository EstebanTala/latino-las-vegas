
-- Convert venue_type from text to text[] array
ALTER TABLE public.listings
  ALTER COLUMN venue_type TYPE text[]
  USING CASE
    WHEN venue_type IS NOT NULL THEN ARRAY[venue_type]
    ELSE NULL
  END;
