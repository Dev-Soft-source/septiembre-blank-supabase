-- Revert views back to SECURITY DEFINER to restore core functionality
-- Using only basic existing columns to ensure compatibility

-- Revert availability_packages_public_view first (this is the most critical)
DROP VIEW IF EXISTS public.availability_packages_public_view CASCADE;
CREATE VIEW public.availability_packages_public_view 
WITH (security_invoker = false) AS
SELECT 
  id,
  hotel_id,
  start_date,
  end_date,
  duration_days,
  total_rooms,
  available_rooms,
  base_price_usd,
  current_price_usd,
  created_at,
  updated_at,
  room_type,
  meal_plan,
  occupancy_mode
FROM availability_packages
WHERE available_rooms > 0;

-- Revert hotels_public_view with basic columns
DROP VIEW IF EXISTS public.hotels_public_view CASCADE;
CREATE VIEW public.hotels_public_view 
WITH (security_invoker = false) AS
SELECT 
  h.id,
  h.name,
  h.description,
  h.country,
  h.city,
  h.address,
  h.price_per_month,
  h.main_image_url,
  h.category,
  h.property_type,
  h.style,
  h.ideal_guests,
  h.atmosphere,
  h.perfect_location,
  h.is_featured,
  h.created_at,
  h.updated_at,
  h.available_months,
  h.features_hotel,
  h.features_room,
  h.meal_plans,
  h.stay_lengths
FROM hotels h
WHERE h.status = 'approved';

-- Revert hotels_detailed_view with all columns
DROP VIEW IF EXISTS public.hotels_detailed_view CASCADE;
CREATE VIEW public.hotels_detailed_view 
WITH (security_invoker = false) AS
SELECT h.*
FROM hotels h
WHERE h.status = 'approved';