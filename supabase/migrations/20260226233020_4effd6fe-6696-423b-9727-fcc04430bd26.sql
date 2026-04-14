ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS is_sponsored boolean NOT NULL DEFAULT false;