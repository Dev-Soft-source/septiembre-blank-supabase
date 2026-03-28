-- Fix the set_association_referral_code trigger to handle NULL referral codes properly
CREATE OR REPLACE FUNCTION public.set_association_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- A prefix for Associations - commission entity  
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_commission_entity_code('A');
  ELSE
    -- Only validate manually entered codes, not auto-generated ones
    IF NOT (NEW.referral_code ~ '^A[0-9]{5}[A-Z]$' AND NEW.referral_code !~ 'O') THEN
      RAISE EXCEPTION 'Invalid association code format. Expected: A[5 digits][letter A-Z except O]';
    END IF;
    NEW.referral_code := UPPER(NEW.referral_code);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Now create the association record for the user who failed earlier
INSERT INTO public.associations (
  user_id,
  association_name,
  email,
  responsible_person,
  country,
  status
) 
SELECT 
  '778f1eb7-f9ca-45b6-84e5-bf9feda3d0b5'::uuid,
  'DOMINGO NOCHE',
  'a7c4t3v7n8@mkzaso.com', 
  'DOMINGO NOCHE',
  'USA',
  'pending'
WHERE NOT EXISTS (
  SELECT 1 FROM public.associations WHERE user_id = '778f1eb7-f9ca-45b6-84e5-bf9feda3d0b5'::uuid
);