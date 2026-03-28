-- Create table for hotel referrals
CREATE TABLE public.hotel_referrals_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  bank_name text NOT NULL,
  bank_country text NOT NULL,
  iban_account text NOT NULL,
  swift_bic text,
  hotels jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hotel_referrals_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for referral submissions
CREATE POLICY "Users can insert their own referral submissions" 
ON public.hotel_referrals_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own referral submissions" 
ON public.hotel_referrals_submissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral submissions" 
ON public.hotel_referrals_submissions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all referral submissions" 
ON public.hotel_referrals_submissions 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hotel_referrals_submissions_updated_at
BEFORE UPDATE ON public.hotel_referrals_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();