-- Create free_nights_rewards table for Three Free Nights promotion
CREATE TABLE public.free_nights_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('hotel', 'user')),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'redeemed', 'expired')),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX idx_free_nights_rewards_owner_status ON public.free_nights_rewards(owner_type, owner_id, status);

-- Enable RLS
ALTER TABLE public.free_nights_rewards ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own rewards" 
ON public.free_nights_rewards 
FOR SELECT 
USING (owner_id = auth.uid());

CREATE POLICY "System can insert rewards" 
ON public.free_nights_rewards 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own rewards" 
ON public.free_nights_rewards 
FOR UPDATE 
USING (owner_id = auth.uid());

-- Trigger for hotel approval to create free nights reward
CREATE OR REPLACE FUNCTION public.create_hotel_free_nights_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- When hotel status changes to 'approved', create free nights reward for hotel owner
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    INSERT INTO public.free_nights_rewards (owner_type, owner_id, notes)
    VALUES ('hotel', NEW.owner_id, 'Hotel approval bonus - Three Free Nights');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER hotel_approval_free_nights
  AFTER UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.create_hotel_free_nights_reward();

-- Trigger for user referral to create free nights reward
CREATE OR REPLACE FUNCTION public.create_user_referral_reward()
RETURNS TRIGGER AS $$
DECLARE
  referral_user_id UUID;
BEGIN
  -- When hotel is approved and has a referral, create reward for referring user
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') AND NEW.referred_by IS NOT NULL THEN
    -- Find the user who made the referral
    SELECT user_id INTO referral_user_id 
    FROM public.hotel_referrals 
    WHERE hotel_name = NEW.name AND contact_email = NEW.contact_email
    LIMIT 1;
    
    IF referral_user_id IS NOT NULL THEN
      INSERT INTO public.free_nights_rewards (owner_type, owner_id, notes)
      VALUES ('user', referral_user_id, 'Hotel referral bonus - Three Free Nights');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER user_referral_free_nights
  AFTER UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.create_user_referral_reward();