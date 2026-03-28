-- Fix free_nights_rewards table with required changes

-- Add source and source_id fields for idempotency and traceability
ALTER TABLE public.free_nights_rewards 
ADD COLUMN source TEXT CHECK (source IN ('hotel_approved', 'user_referral')),
ADD COLUMN source_id UUID;

-- Create unique index for idempotency
CREATE UNIQUE INDEX idx_free_nights_rewards_idempotency 
ON public.free_nights_rewards(source, source_id, owner_type, owner_id);

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS hotel_approval_free_nights ON public.hotels;
DROP TRIGGER IF EXISTS user_referral_free_nights ON public.hotels;
DROP FUNCTION IF EXISTS public.create_hotel_free_nights_reward();
DROP FUNCTION IF EXISTS public.create_user_referral_reward();

-- Updated function for hotel approval rewards
CREATE OR REPLACE FUNCTION public.create_hotel_free_nights_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire on transition TO 'approved' (not already approved)
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Insert with idempotency protection
    INSERT INTO public.free_nights_rewards (owner_type, owner_id, source, source_id, notes)
    VALUES ('hotel', NEW.owner_id, 'hotel_approved', NEW.id, 'Hotel approval bonus - Three Free Nights')
    ON CONFLICT (source, source_id, owner_type, owner_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Updated function for user referral rewards
CREATE OR REPLACE FUNCTION public.create_user_referral_reward()
RETURNS TRIGGER AS $$
DECLARE
  referral_user_id UUID;
BEGIN
  -- Only fire on transition TO 'approved' (not already approved)
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Use canonical referral linkage via hotel_referrals table
    SELECT user_id INTO referral_user_id 
    FROM public.hotel_referrals 
    WHERE id = NEW.referred_by::UUID
    LIMIT 1;
    
    -- If no direct referral_by UUID, try to find by hotel details as fallback
    IF referral_user_id IS NULL AND NEW.referred_by IS NOT NULL THEN
      SELECT user_id INTO referral_user_id 
      FROM public.hotel_referrals 
      WHERE hotel_name = NEW.name AND contact_email = NEW.contact_email
      LIMIT 1;
    END IF;
    
    IF referral_user_id IS NOT NULL THEN
      -- Insert with idempotency protection
      INSERT INTO public.free_nights_rewards (owner_type, owner_id, source, source_id, notes)
      VALUES ('user', referral_user_id, 'user_referral', NEW.id, 'Hotel referral bonus - Three Free Nights')
      ON CONFLICT (source, source_id, owner_type, owner_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate triggers
CREATE TRIGGER hotel_approval_free_nights
  AFTER UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.create_hotel_free_nights_reward();

CREATE TRIGGER user_referral_free_nights
  AFTER UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.create_user_referral_reward();