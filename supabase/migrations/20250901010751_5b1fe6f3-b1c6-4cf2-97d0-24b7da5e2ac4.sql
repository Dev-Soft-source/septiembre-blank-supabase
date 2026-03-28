-- Ensure all existing associations have referral codes
-- This is an idempotent operation - safe to run multiple times

UPDATE public.hotel_associations 
SET referral_code = generate_commission_entity_code('A')
WHERE referral_code IS NULL OR referral_code = '';

-- Add index for better performance when looking up by referral code
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_associations_referral_code 
ON public.hotel_associations(referral_code);

-- Add index for better performance when looking up by user_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_associations_user_id 
ON public.hotel_associations(user_id);

-- Add logging trigger to help debug association creation issues
CREATE OR REPLACE FUNCTION public.log_association_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Log association creation for debugging
  RAISE LOG 'Association created - ID: %, User ID: %, Name: %, Email: %, Referral Code: %',
    NEW.id, NEW.user_id, NEW.association_name, NEW.email, NEW.referral_code;
  RETURN NEW;
END;
$function$;

-- Create trigger to log association creation
DROP TRIGGER IF EXISTS log_association_creation_trigger ON public.hotel_associations;
CREATE TRIGGER log_association_creation_trigger
  AFTER INSERT ON public.hotel_associations
  FOR EACH ROW
  EXECUTE FUNCTION public.log_association_creation();