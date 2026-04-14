
-- Drop the restrictive SELECT policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can read listings" ON public.listings;

CREATE POLICY "Anyone can read listings"
  ON public.listings
  FOR SELECT
  TO public
  USING (true);
