
-- Drop all existing restrictive policies on listings
DROP POLICY IF EXISTS "Anyone can read listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can insert listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can update listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can delete listings" ON public.listings;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Anyone can read listings"
ON public.listings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert listings"
ON public.listings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update listings"
ON public.listings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete listings"
ON public.listings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
