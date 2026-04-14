
CREATE TABLE public.taxonomy_attraction_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.taxonomy_attraction_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read attraction types" ON public.taxonomy_attraction_types FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert attraction types" ON public.taxonomy_attraction_types FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update attraction types" ON public.taxonomy_attraction_types FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete attraction types" ON public.taxonomy_attraction_types FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.taxonomy_attraction_types (name, slug, sort_order) VALUES
  ('Tours', 'tours', 1),
  ('Museos', 'museos', 2),
  ('Miradores', 'miradores', 3);
