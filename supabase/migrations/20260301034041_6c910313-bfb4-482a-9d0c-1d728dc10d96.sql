ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS recomendado_bullets text[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT NULL;