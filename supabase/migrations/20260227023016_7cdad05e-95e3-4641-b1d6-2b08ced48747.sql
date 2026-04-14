ALTER TABLE public.listings 
ADD COLUMN located_in_listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL;

-- Prevent self-reference via trigger
CREATE OR REPLACE FUNCTION public.prevent_self_reference_listing()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.located_in_listing_id IS NOT NULL AND NEW.located_in_listing_id = NEW.id THEN
    RAISE EXCEPTION 'A listing cannot reference itself as its parent resort.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_self_reference_listing
BEFORE INSERT OR UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.prevent_self_reference_listing();