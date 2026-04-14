
-- Create business submissions table
CREATE TABLE public.business_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (insert) — no auth required for submissions
CREATE POLICY "Anyone can submit a business"
  ON public.business_submissions
  FOR INSERT
  WITH CHECK (true);

-- Only admins would read submissions (no public select)
-- For now, no SELECT policy = submissions are write-only from the frontend

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_business_submissions_updated_at
  BEFORE UPDATE ON public.business_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
