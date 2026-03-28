-- Create the public hotel view with correct column names (no RLS policy needed for views)
DROP VIEW IF EXISTS public.hotels_public;
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
  -- EXCLUDED SENSITIVE FIELDS: contact_email, contact_name, contact_phone, 
  -- postal_code, banking_info, referred_by, referral_code
FROM public.hotels
WHERE status = 'approved';

-- Grant access to the view
GRANT SELECT ON public.hotels_public TO anon, authenticated;

-- Fix remaining function search paths
CREATE OR REPLACE FUNCTION public.generate_leader_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code in format LL-XXXX (e.g., LL-1234)
    v_code := 'LL-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.leaders WHERE referral_code = v_code) INTO v_exists;
    
    -- Exit loop if code is unique
    IF NOT v_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.hotel_has_valid_images(hotel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN h.main_image_url IS NOT NULL 
           AND h.main_image_url != '' 
           AND h.main_image_url != '/placeholder.svg'
           AND h.main_image_url NOT LIKE '%placeholder%'
      THEN true
      WHEN EXISTS (
        SELECT 1 FROM public.hotel_images hi
        WHERE hi.hotel_id = h.id 
        AND hi.image_url IS NOT NULL 
        AND hi.image_url != '' 
        AND hi.image_url != '/placeholder.svg'
        AND hi.image_url NOT LIKE '%placeholder%'
      )
      THEN true
      ELSE false
    END
  FROM public.hotels h
  WHERE h.id = hotel_has_valid_images.hotel_id;
$$;

-- Complete the security hardening by ensuring all admin functions have proper paths
CREATE OR REPLACE FUNCTION public.get_hotels_without_images()
RETURNS TABLE(hotel_id uuid, hotel_name text, hotel_status text, city text, country text, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    h.id,
    h.name,
    h.status,
    h.city,
    h.country,
    h.created_at
  FROM public.hotels h
  WHERE NOT public.hotel_has_valid_images(h.id)
  ORDER BY 
    CASE WHEN h.status = 'approved' THEN 1 ELSE 2 END,
    h.created_at DESC;
$$;