
-- 1. Add admin-only SELECT policy on business_submissions
CREATE POLICY "Admins can read business submissions"
  ON public.business_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix affiliate_clicks: replace permissive anonymous INSERT with authenticated-only
DROP POLICY "Anyone can insert affiliate clicks" ON public.affiliate_clicks;
CREATE POLICY "Authenticated users can insert affiliate clicks"
  ON public.affiliate_clicks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. Fix user_roles: replace broad ALL policy with explicit per-operation admin policies
DROP POLICY "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
