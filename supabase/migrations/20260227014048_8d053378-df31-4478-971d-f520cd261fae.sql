-- Taxonomy: Zones
CREATE TABLE public.taxonomy_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.taxonomy_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active zones" ON public.taxonomy_zones FOR SELECT USING (true);
CREATE POLICY "Admins can insert zones" ON public.taxonomy_zones FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update zones" ON public.taxonomy_zones FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete zones" ON public.taxonomy_zones FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Taxonomy: Cuisines
CREATE TABLE public.taxonomy_cuisines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.taxonomy_cuisines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cuisines" ON public.taxonomy_cuisines FOR SELECT USING (true);
CREATE POLICY "Admins can insert cuisines" ON public.taxonomy_cuisines FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update cuisines" ON public.taxonomy_cuisines FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete cuisines" ON public.taxonomy_cuisines FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Taxonomy: Venue Types
CREATE TABLE public.taxonomy_venue_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.taxonomy_venue_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read venue types" ON public.taxonomy_venue_types FOR SELECT USING (true);
CREATE POLICY "Admins can insert venue types" ON public.taxonomy_venue_types FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update venue types" ON public.taxonomy_venue_types FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete venue types" ON public.taxonomy_venue_types FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Taxonomy: Music Genres
CREATE TABLE public.taxonomy_music_genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.taxonomy_music_genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read music genres" ON public.taxonomy_music_genres FOR SELECT USING (true);
CREATE POLICY "Admins can insert music genres" ON public.taxonomy_music_genres FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update music genres" ON public.taxonomy_music_genres FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete music genres" ON public.taxonomy_music_genres FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Seed default zones
INSERT INTO public.taxonomy_zones (name, slug, sort_order) VALUES
  ('The Strip', 'the-strip', 1),
  ('Downtown', 'downtown', 2),
  ('West Las Vegas', 'west-las-vegas', 3),
  ('East Las Vegas', 'east-las-vegas', 4),
  ('North Las Vegas', 'north-las-vegas', 5),
  ('South Las Vegas', 'south-las-vegas', 6),
  ('Excursión', 'excursion', 7);

-- Seed default venue types
INSERT INTO public.taxonomy_venue_types (name, slug, sort_order) VALUES
  ('Nightclub', 'nightclub', 1),
  ('Bar', 'bar', 2),
  ('Lounge', 'lounge', 3);