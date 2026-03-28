-- Create the missing commission entity code generation functions that the trigger depends on
CREATE OR REPLACE FUNCTION public.generate_commission_entity_code(prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 1;
  max_attempts INTEGER := 100;
BEGIN
  -- Generate base code: prefix + 5 digits + letter A-Z (except O)
  LOOP
    base_code := prefix || LPAD(floor(random() * 100000)::text, 5, '0') || 
                chr(65 + floor(random() * 25)::int); -- A-Y (skipping O at position 14)
    
    -- Skip 'O' by adjusting if we hit position 14 (which would be 'O')
    IF substr(base_code, -1, 1) >= 'O' THEN
      base_code := substr(base_code, 1, length(base_code) - 1) || 
                   chr(ascii(substr(base_code, -1, 1)) + 1);
    END IF;
    
    final_code := base_code;
    
    -- Check if code already exists in associations, hotels, or leaders tables
    IF NOT EXISTS (
      SELECT 1 FROM public.associations WHERE referral_code = final_code
      UNION ALL
      SELECT 1 FROM public.hotels WHERE referral_code = final_code  
      UNION ALL
      SELECT 1 FROM public.leaders WHERE referral_code = final_code
    ) THEN
      EXIT; -- Found unique code
    END IF;
    
    counter := counter + 1;
    IF counter > max_attempts THEN
      RAISE EXCEPTION 'Could not generate unique referral code after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  RETURN final_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_commission_entity_code(code text, expected_prefix text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Check format: prefix + 5 digits + letter A-Z (but not O)
  RETURN code ~ ('^' || expected_prefix || '[0-9]{5}[A-NP-Z]$') AND length(code) = 7;
END;
$$;