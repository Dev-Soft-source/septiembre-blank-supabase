-- Remove security definer from view and create it as regular view
DROP VIEW IF EXISTS public.hotels_public;
CREATE VIEW public.hotels_public AS
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
FROM public.hotels
WHERE status = 'approved';

-- Grant access to the view
GRANT SELECT ON public.hotels_public TO anon, authenticated;

-- Fix critical missing RLS policies for tables that don't have any
-- Check which tables have RLS enabled but no policies
DO $$
BEGIN
    -- Add basic policies for commission_audit if it doesn't have proper ones
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'commission_audit' AND policyname = 'Admins can view commission audit'
    ) THEN
        CREATE POLICY "Admins can view commission audit" ON public.commission_audit
        FOR SELECT USING (is_admin(auth.uid()));
    END IF;
    
    -- Add basic policy for hotel_commission_link if it doesn't have proper ones  
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hotel_commission_link' AND policyname = 'Only admins can view hotel commission links'
    ) THEN
        CREATE POLICY "Only admins can view hotel commission links" ON public.hotel_commission_link
        FOR SELECT USING (is_admin(auth.uid()));
    END IF;
END
$$;