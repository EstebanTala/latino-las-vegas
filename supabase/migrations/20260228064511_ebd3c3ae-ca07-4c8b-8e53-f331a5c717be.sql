
CREATE OR REPLACE FUNCTION public.validate_business_submission()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate business_name length
  IF char_length(NEW.business_name) > 200 THEN
    RAISE EXCEPTION 'Business name must be 200 characters or less';
  END IF;

  -- Validate contact_name length
  IF char_length(NEW.contact_name) > 100 THEN
    RAISE EXCEPTION 'Contact name must be 100 characters or less';
  END IF;

  -- Validate contact_email format and length
  IF char_length(NEW.contact_email) > 255 THEN
    RAISE EXCEPTION 'Email must be 255 characters or less';
  END IF;
  IF NEW.contact_email !~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Validate category
  IF NEW.category NOT IN ('restaurantes', 'hoteles', 'shows', 'nocturna', 'atracciones', 'otro') THEN
    RAISE EXCEPTION 'Invalid category';
  END IF;

  -- Validate optional field lengths
  IF NEW.address IS NOT NULL AND char_length(NEW.address) > 300 THEN
    RAISE EXCEPTION 'Address must be 300 characters or less';
  END IF;

  IF NEW.phone IS NOT NULL AND char_length(NEW.phone) > 30 THEN
    RAISE EXCEPTION 'Phone must be 30 characters or less';
  END IF;

  IF NEW.website IS NOT NULL AND char_length(NEW.website) > 500 THEN
    RAISE EXCEPTION 'Website must be 500 characters or less';
  END IF;

  IF NEW.instagram IS NOT NULL AND char_length(NEW.instagram) > 100 THEN
    RAISE EXCEPTION 'Instagram must be 100 characters or less';
  END IF;

  IF NEW.notes IS NOT NULL AND char_length(NEW.notes) > 2000 THEN
    RAISE EXCEPTION 'Notes must be 2000 characters or less';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_business_submission_trigger
  BEFORE INSERT OR UPDATE ON public.business_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_business_submission();
