-- Update the generate_commission_entity_code function to reference the renamed table
CREATE OR REPLACE FUNCTION public.generate_commission_entity_code(prefix TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
      SELECT 1 FROM public.associations WHERE referral_code = final_code
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

-- Fix existing association that has incorrect referral code format
UPDATE public.associations 
SET referral_code = generate_commission_entity_code('A')
WHERE referral_code = '158825A' OR referral_code NOT LIKE 'A%';