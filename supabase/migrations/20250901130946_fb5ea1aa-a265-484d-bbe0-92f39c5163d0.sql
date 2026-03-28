-- Fix the association referral code generation issue
CREATE OR REPLACE FUNCTION public.generate_commission_entity_code(prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate 5 random digits
  base_code := prefix || LPAD(floor(random() * 100000)::text, 5, '0');
  
  -- Add a random letter (A-Z except O)
  final_code := base_code || chr(65 + floor(random() * 25)::integer);
  
  -- If the letter is 'O' (ASCII 79), change it to 'P' (ASCII 80)
  IF ascii(right(final_code, 1)) = 79 THEN
    final_code := left(final_code, length(final_code) - 1) || 'P';
  END IF;
  
  -- Check for uniqueness and increment if needed
  WHILE (
    (prefix = 'A' AND EXISTS (SELECT 1 FROM public.associations WHERE referral_code = final_code)) OR
    (prefix = 'H' AND EXISTS (SELECT 1 FROM public.hotels WHERE referral_code = final_code))
  ) LOOP
    counter := counter + 1;
    base_code := prefix || LPAD(floor(random() * 100000)::text, 5, '0');
    final_code := base_code || chr(65 + floor(random() * 25)::integer);
    
    -- If the letter is 'O', change it to 'P'
    IF ascii(right(final_code, 1)) = 79 THEN
      final_code := left(final_code, length(final_code) - 1) || 'P';
    END IF;
    
    -- Safety break after 100 attempts
    IF counter > 100 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN final_code;
END;
$$;

-- Create validation function
CREATE OR REPLACE FUNCTION public.validate_commission_entity_code(code text, expected_prefix text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
BEGIN
  -- Check format: [prefix][5 digits][letter A-Z except O]
  RETURN code ~ ('^' || expected_prefix || '[0-9]{5}[A-NP-Z]$');
END;
$$;