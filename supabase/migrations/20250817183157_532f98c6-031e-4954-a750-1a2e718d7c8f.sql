-- Create table for online PDF form submissions
CREATE TABLE public.pdf_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  
  -- Basic Information
  hotel_name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Classification and Property Details
  classification INTEGER CHECK (classification >= 1 AND classification <= 5),
  property_type TEXT,
  property_style TEXT,
  
  -- Descriptions
  hotel_description TEXT,
  room_description TEXT,
  ideal_guests TEXT,
  atmosphere TEXT,
  perfect_location TEXT,
  
  -- Features and Activities
  hotel_features TEXT[], -- Store as array of selected feature names
  room_features TEXT[], -- Store as array of selected feature names
  client_affinities TEXT[], -- Store as array of selected affinity names
  activities TEXT[], -- Store as array of selected activity names
  
  -- Services
  meal_plan TEXT,
  laundry_service TEXT,
  
  -- Availability
  stay_lengths INTEGER[], -- Array of available stay durations
  check_in_day TEXT,
  
  -- Availability packages (stored as JSONB array)
  availability_packages JSONB DEFAULT '[]'::jsonb,
  
  -- Pricing matrix (stored as JSONB)
  pricing_matrix JSONB DEFAULT '{}'::jsonb,
  
  -- Terms and signature
  terms_accepted BOOLEAN DEFAULT false,
  signature_name TEXT,
  signature_position TEXT,
  signature_date DATE,
  
  -- Metadata
  submission_method TEXT DEFAULT 'online_form',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
  language_code TEXT DEFAULT 'en',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Processed hotel ID if converted to full hotel record
  processed_hotel_id UUID REFERENCES public.hotels(id)
);

-- Enable RLS
ALTER TABLE public.pdf_form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can insert their own PDF form submissions"
  ON public.pdf_form_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own PDF form submissions"
  ON public.pdf_form_submissions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own PDF form submissions"
  ON public.pdf_form_submissions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all PDF form submissions"
  ON public.pdf_form_submissions
  FOR ALL
  USING (is_admin(auth.uid()));

-- Add indexes for performance
CREATE INDEX idx_pdf_form_submissions_user_id ON public.pdf_form_submissions(user_id);
CREATE INDEX idx_pdf_form_submissions_status ON public.pdf_form_submissions(status);
CREATE INDEX idx_pdf_form_submissions_created_at ON public.pdf_form_submissions(created_at);

-- Add updated_at trigger
CREATE TRIGGER update_pdf_form_submissions_updated_at
  BEFORE UPDATE ON public.pdf_form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();