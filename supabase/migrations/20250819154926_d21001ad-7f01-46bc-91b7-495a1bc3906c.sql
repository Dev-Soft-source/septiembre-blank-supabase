-- Fix the public hotel view with correct column names
CREATE OR REPLACE VIEW public.hotels_public AS
SELECT 
  id,
  name,
  description,
  country,
  city,
  address,
  location_address,
  price_per_month,
  main_image_url,
  category,
  property_type,
  style,
  property_style,
  ideal_guests,
  atmosphere,
  perfect_location,
  is_featured,
  created_at,
  updated_at,
  status,
  available_months,
  features_hotel,
  features_room,
  meal_plans,
  room_types,
  stay_lengths,
  terms,
  enable_price_increase,
  price_increase_cap,
  check_in_weekday,
  meals_offered,
  photos,
  faqs,
  location_description,
  pricingmatrix,
  allow_stay_extensions
  -- EXCLUDED SENSITIVE FIELDS:
  -- contact_email, contact_name, contact_phone, postal_code
  -- banking_info, referred_by, referral_code
FROM public.hotels
WHERE status = 'approved';

-- Grant public access to the view
GRANT SELECT ON public.hotels_public TO anon, authenticated;

-- Add RLS policy for the view
CREATE POLICY "Public can view hotels_public view" ON public.hotels_public
FOR SELECT USING (true);

-- Now fix the remaining function search paths that were identified by the linter
CREATE OR REPLACE FUNCTION public.generate_commission_entity_code(prefix_letter text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INTEGER := 100;
  attempts INTEGER := 0;
BEGIN
  LOOP
    -- Generate code: PREFIX + 5 digits + suffix letter
    new_code := UPPER(prefix_letter) || generate_code_digits() || generate_code_suffix();
    
    -- Check uniqueness across all tables
    SELECT EXISTS (
      SELECT 1 FROM agents WHERE agent_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotel_associations WHERE association_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotels WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM leaders WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM profiles WHERE referral_code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Unable to generate unique code after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_non_commission_entity_code(prefix_letter text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INTEGER := 100;
  attempts INTEGER := 0;
BEGIN
  LOOP
    -- Generate code: PREFIX + 5 digits (no suffix)
    new_code := UPPER(prefix_letter) || generate_code_digits();
    
    -- Check uniqueness across all tables
    SELECT EXISTS (
      SELECT 1 FROM agents WHERE agent_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotel_associations WHERE association_code = new_code OR referral_code = new_code
      UNION ALL
      SELECT 1 FROM hotels WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM leaders WHERE referral_code = new_code
      UNION ALL
      SELECT 1 FROM profiles WHERE referral_code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Unable to generate unique code after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_code_digits()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  digits TEXT := '';
  i INTEGER;
  random_digit INTEGER;
BEGIN
  FOR i IN 1..5 LOOP
    -- Generate random digit 0-9 
    random_digit := FLOOR(RANDOM() * 10);
    digits := digits || random_digit::TEXT;
  END LOOP;
  RETURN digits;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_code_suffix()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- All letters except O
  suffix_letters TEXT := 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  random_index INTEGER;
BEGIN
  random_index := FLOOR(RANDOM() * LENGTH(suffix_letters)) + 1;
  RETURN SUBSTRING(suffix_letters FROM random_index FOR 1);
END;
$$;