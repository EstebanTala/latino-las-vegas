
-- 1. Create taxonomy_show_types table
CREATE TABLE public.taxonomy_show_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.taxonomy_show_types ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies (same pattern as other taxonomy tables)
CREATE POLICY "Anyone can read show types" ON public.taxonomy_show_types FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert show types" ON public.taxonomy_show_types FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update show types" ON public.taxonomy_show_types FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete show types" ON public.taxonomy_show_types FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Seed show-specific types
INSERT INTO public.taxonomy_show_types (name, slug, sort_order) VALUES
  ('Circo', 'circo', 1),
  ('Magia', 'magia', 2),
  ('Concierto', 'concierto', 3),
  ('Teatro', 'teatro', 4),
  ('Comedia', 'comedia', 5),
  ('Espectáculo visual', 'espectaculo-visual', 6),
  ('Residencia musical', 'residencia-musical', 7),
  ('Familiar', 'familiar', 8);

-- 5. Add show_experience_type column to listings
ALTER TABLE public.listings ADD COLUMN show_experience_type text[] DEFAULT NULL;

-- 6. Migrate existing shows experience_type to show_experience_type
UPDATE public.listings
SET show_experience_type = experience_type,
    experience_type = NULL
WHERE cat = 'shows' AND experience_type IS NOT NULL;

-- 7. Remove show-specific values from taxonomy_attraction_types
DELETE FROM public.taxonomy_attraction_types
WHERE slug IN ('circo', 'magia', 'concierto', 'comedia', 'teatro', 'espectaculo-visual', 'residencia-musical', 'familiar');
