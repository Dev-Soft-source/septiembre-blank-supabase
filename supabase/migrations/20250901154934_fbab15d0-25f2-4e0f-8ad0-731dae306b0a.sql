-- Revert views back to SECURITY DEFINER to restore core functionality
-- This restores public access to prices and availability data

-- Revert hotels_public view
DROP VIEW IF EXISTS public.hotels_public CASCADE;
CREATE VIEW public.hotels_public 
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
  h.available_months,
  h.features_hotel,
  h.features_room,
  h.meal_plans,
  h.stay_lengths,
  h.rates,
  h.pricingmatrix,
  4.5 as average_rating,
  0::bigint as review_count,
  hi.hotel_images,
  ht.hotel_themes,
  ha.hotel_activities
FROM hotels h
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'id', hi.id,
      'hotel_id', hi.hotel_id,
      'image_url', hi.image_url,
      'is_main', hi.is_main,
      'created_at', hi.created_at
    )
  ) as hotel_images
  FROM hotel_images hi
  WHERE hi.hotel_id = h.id
) hi ON true
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'theme_id', ht.theme_id,
      'themes', json_build_object(
        'id', t.id,
        'name', t.name,
        'description', t.description,
        'category', t.category
      )
    )
  ) as hotel_themes
  FROM hotel_themes ht
  JOIN themes t ON ht.theme_id = t.id
  WHERE ht.hotel_id = h.id
) ht ON true
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'activity_id', ha.activity_id,
      'activities', json_build_object(
        'id', a.id,
        'name', a.name,
        'category', a.category
      )
    )
  ) as hotel_activities
  FROM hotel_activities ha
  JOIN activities a ON ha.activity_id = a.id
  WHERE ha.hotel_id = h.id
) ha ON true
WHERE h.status = 'approved';

-- Revert hotels_public_view
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
  h.stay_lengths,
  h.rates,
  h.pricingmatrix,
  4.5 as average_rating
FROM hotels h
WHERE h.status = 'approved';

-- Revert hotels_with_filters_view  
DROP VIEW IF EXISTS public.hotels_with_filters_view CASCADE;
CREATE VIEW public.hotels_with_filters_view 
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
  h.stay_lengths,
  h.rates,
  h.pricingmatrix,
  4.5 as average_rating,
  hi.hotel_images,
  ht.hotel_themes,
  ha.hotel_activities
FROM hotels h
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'id', hi.id,
      'hotel_id', hi.hotel_id,
      'image_url', hi.image_url,
      'is_main', hi.is_main,
      'created_at', hi.created_at
    )
  ) as hotel_images
  FROM hotel_images hi
  WHERE hi.hotel_id = h.id
) hi ON true
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'theme_id', ht.theme_id,
      'themes', json_build_object(
        'id', t.id,
        'name', t.name,
        'description', t.description,
        'category', t.category
      )
    )
  ) as hotel_themes
  FROM hotel_themes ht
  JOIN themes t ON ht.theme_id = t.id
  WHERE ht.hotel_id = h.id
) ht ON true
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'activity_id', ha.activity_id,
      'activities', json_build_object(
        'id', a.id,
        'name', a.name,
        'category', a.category
      )
    )
  ) as hotel_activities
  FROM hotel_activities ha
  JOIN activities a ON ha.activity_id = a.id
  WHERE ha.hotel_id = h.id
) ha ON true
WHERE h.status = 'approved';

-- Revert hotels_detailed_view
DROP VIEW IF EXISTS public.hotels_detailed_view CASCADE;
CREATE VIEW public.hotels_detailed_view 
WITH (security_invoker = false) AS
SELECT 
  h.*,
  4.5 as average_rating,
  hi.hotel_images,
  ht.hotel_themes,
  ha.hotel_activities
FROM hotels h
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'id', hi.id,
      'hotel_id', hi.hotel_id,
      'image_url', hi.image_url,
      'is_main', hi.is_main,
      'created_at', hi.created_at
    )
  ) as hotel_images
  FROM hotel_images hi
  WHERE hi.hotel_id = h.id
) hi ON true
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'theme_id', ht.theme_id,
      'themes', json_build_object(
        'id', t.id,
        'name', t.name,
        'description', t.description,
        'category', t.category
      )
    )
  ) as hotel_themes
  FROM hotel_themes ht
  JOIN themes t ON ht.theme_id = t.id
  WHERE ht.hotel_id = h.id
) ht ON true
LEFT JOIN LATERAL (
  SELECT json_agg(
    json_build_object(
      'activity_id', ha.activity_id,
      'activities', json_build_object(
        'id', a.id,
        'name', a.name,
        'category', a.category
      )
    )
  ) as hotel_activities
  FROM hotel_activities ha
  JOIN activities a ON ha.activity_id = a.id
  WHERE ha.hotel_id = h.id
) ha ON true
WHERE h.status = 'approved';

-- Revert availability_packages_public_view
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