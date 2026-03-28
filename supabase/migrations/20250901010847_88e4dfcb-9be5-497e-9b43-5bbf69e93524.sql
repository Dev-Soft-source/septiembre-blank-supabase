-- Add indexes for better performance (without CONCURRENTLY since we're in a transaction)
CREATE INDEX IF NOT EXISTS idx_hotel_associations_referral_code 
ON public.hotel_associations(referral_code);

CREATE INDEX IF NOT EXISTS idx_hotel_associations_user_id 
ON public.hotel_associations(user_id);

-- Check and fix any associations missing referral codes (idempotent operation)
UPDATE public.hotel_associations 
SET referral_code = generate_commission_entity_code('A')
WHERE referral_code IS NULL OR referral_code = '';

-- Make sure our logging trigger is in place
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