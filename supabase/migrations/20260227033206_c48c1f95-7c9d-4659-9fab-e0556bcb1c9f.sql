
-- Add gallery_images array column
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}';

-- Migrate existing image2-6 data into gallery_images
UPDATE public.listings
SET gallery_images = array_remove(ARRAY[image2, image3, image4, image5, image6], NULL)
WHERE image2 IS NOT NULL OR image3 IS NOT NULL OR image4 IS NOT NULL OR image5 IS NOT NULL OR image6 IS NOT NULL;
