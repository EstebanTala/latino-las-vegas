
-- Create taxonomy_amenities table
CREATE TABLE public.taxonomy_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_group text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.taxonomy_amenities ENABLE ROW LEVEL SECURITY;

-- Policies (same pattern as other taxonomies)
CREATE POLICY "Anyone can read amenities" ON public.taxonomy_amenities FOR SELECT USING (true);
CREATE POLICY "Admins can insert amenities" ON public.taxonomy_amenities FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update amenities" ON public.taxonomy_amenities FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete amenities" ON public.taxonomy_amenities FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
