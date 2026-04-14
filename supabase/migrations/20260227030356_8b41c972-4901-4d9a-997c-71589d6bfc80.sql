
-- Add affiliate CTA fields to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS affiliate_cta_label text,
  ADD COLUMN IF NOT EXISTS affiliate_cta_url text,
  ADD COLUMN IF NOT EXISTS affiliate_provider text,
  ADD COLUMN IF NOT EXISTS affiliate_last_updated timestamptz;

-- Create affiliate_clicks tracking table
CREATE TABLE public.affiliate_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  category text NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone can insert clicks (anonymous tracking)
CREATE POLICY "Anyone can insert affiliate clicks" ON public.affiliate_clicks
  FOR INSERT WITH CHECK (true);

-- Only admins can read clicks
CREATE POLICY "Admins can read affiliate clicks" ON public.affiliate_clicks
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
