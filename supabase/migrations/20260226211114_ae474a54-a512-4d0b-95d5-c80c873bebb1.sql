
-- Create public storage bucket for listing images
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);

-- Anyone can view listing images
CREATE POLICY "Public read access for listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Only admins can upload listing images
CREATE POLICY "Admins can upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images'
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can update listing images
CREATE POLICY "Admins can update listing images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'listing-images'
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete listing images
CREATE POLICY "Admins can delete listing images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listing-images'
  AND public.has_role(auth.uid(), 'admin')
);
