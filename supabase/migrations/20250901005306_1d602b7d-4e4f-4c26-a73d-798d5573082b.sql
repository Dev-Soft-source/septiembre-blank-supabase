-- Fix association referral code generation trigger
-- Update the trigger to ensure association referral code is generated automatically

CREATE OR REPLACE FUNCTION public.set_association_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- A prefix for Associations - commission entity  
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_commission_entity_code('A');
  ELSE
    -- Validate manually entered code
    IF NOT validate_commission_entity_code(NEW.referral_code, 'A') THEN
      RAISE EXCEPTION 'Invalid association code format. Expected: A[5 digits][letter A-Z except O]';
    END IF;
    NEW.referral_code := UPPER(NEW.referral_code);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_association_referral_code_trigger ON public.hotel_associations;

-- Create trigger for automatic referral code generation
CREATE TRIGGER set_association_referral_code_trigger
  BEFORE INSERT OR UPDATE ON public.hotel_associations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_association_referral_code();

-- Create the missing code generation functions if they don't exist
CREATE OR REPLACE FUNCTION public.generate_commission_entity_code(prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  final_code TEXT;
  counter INTEGER := 0;
  random_digits TEXT;
  random_letter CHAR(1);
  letters TEXT := 'ABCDEFGHIJKLMNPQRSTUVWXYZ'; -- Excluding O
BEGIN
  LOOP
    -- Generate 5 random digits
    random_digits := LPAD(floor(random() * 100000)::text, 5, '0');
    
    -- Generate random letter (A-Z except O)
    random_letter := SUBSTRING(letters FROM floor(random() * LENGTH(letters) + 1)::int FOR 1);
    
    -- Construct the code
    final_code := prefix || random_digits || random_letter;
    
    -- Check if this code already exists in any relevant table
    IF NOT EXISTS (
      SELECT 1 FROM public.hotel_associations WHERE referral_code = final_code
      UNION ALL
      SELECT 1 FROM public.hotels WHERE referral_code = final_code
      UNION ALL
      SELECT 1 FROM public.agents WHERE referral_code = final_code
      UNION ALL  
      SELECT 1 FROM public.profiles WHERE referral_code = final_code
    ) THEN
      EXIT; -- Unique code found
    END IF;
    
    counter := counter + 1;
    
    -- Safety exit after 100 attempts
    IF counter > 100 THEN
      RAISE EXCEPTION 'Unable to generate unique referral code after 100 attempts';
    END IF;
  END LOOP;
  
  RETURN final_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_commission_entity_code(code text, expected_prefix text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $function$
BEGIN
  -- Check length (7 characters for commission entities)
  IF LENGTH(code) != 7 THEN
    RETURN FALSE;
  END IF;
  
  -- Check prefix
  IF LEFT(code, 1) != expected_prefix THEN
    RETURN FALSE;
  END IF;
  
  -- Check that positions 2-6 are digits
  IF NOT (SUBSTRING(code FROM 2 FOR 5) ~ '^[0-9]{5}$') THEN
    RETURN FALSE;
  END IF;
  
  -- Check that last character is a letter A-Z (except O)
  IF NOT (RIGHT(code, 1) ~ '^[ABCDEFGHIJKLMNPQRSTUVWXYZ]$') THEN
    RETURN FALSE;
  END IF;
  
  -- Check that there's no letter O anywhere
  IF code ~ 'O' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$;

-- Update existing associations without referral codes
UPDATE public.hotel_associations 
SET referral_code = generate_commission_entity_code('A')
WHERE referral_code IS NULL OR referral_code = '';