-- Fix Security Definer Views by adding security_invoker = true
-- This ensures views respect Row Level Security policies instead of bypassing them

-- Drop and recreate hotels_public view with security_invoker
DROP VIEW IF EXISTS public.hotels_public;
CREATE VIEW public.hotels_public
WITH (security_invoker = true) AS
SELECT hotels.id,
    hotels.name,
    hotels.description,
    hotels.country,
    hotels.city,
    hotels.address,
    hotels.location_address,
    hotels.price_per_month,
    hotels.main_image_url,
    hotels.category,
    hotels.property_type,
    hotels.style,
    hotels.property_style,
    hotels.ideal_guests,
    hotels.atmosphere,
    hotels.perfect_location,
    hotels.is_featured,
    hotels.created_at,
    hotels.updated_at,
    hotels.status,
    hotels.available_months,
    hotels.features_hotel,
    hotels.features_room,
    hotels.meal_plans,
    hotels.room_types,
    hotels.stay_lengths,
    hotels.terms,
    hotels.enable_price_increase,
    hotels.price_increase_cap,
    hotels.check_in_weekday,
    hotels.meals_offered,
    hotels.photos,
    hotels.faqs,
    hotels.location_description,
    hotels.pricingmatrix,
    hotels.allow_stay_extensions
FROM hotels
WHERE (hotels.status = 'approved'::text);

-- Drop and recreate hotels_public_view with security_invoker
DROP VIEW IF EXISTS public.hotels_public_view;
CREATE VIEW public.hotels_public_view
WITH (security_invoker = true) AS
SELECT hotels.id,
    hotels.name,
    hotels.description,
    hotels.country,
    hotels.city,
    hotels.address,
    hotels.postal_code,
    hotels.price_per_month,
    hotels.main_image_url,
    hotels.category,
    hotels.property_type,
    hotels.style,
    hotels.ideal_guests,
    hotels.atmosphere,
    hotels.perfect_location,
    hotels.is_featured,
    hotels.status,
    hotels.available_months,
    hotels.features_hotel,
    hotels.features_room,
    hotels.meal_plans,
    hotels.stay_lengths,
    hotels.faqs,
    hotels.check_in_weekday,
    hotels.room_description,
    hotels.weekly_laundry_included,
    hotels.external_laundry_available,
    hotels.allow_stay_extensions,
    hotels.total_rooms,
    hotels.terms,
    hotels.enable_price_increase,
    hotels.price_increase_cap,
    hotels.rates,
    hotels.pricingmatrix,
    hotels.created_at,
    hotels.updated_at
FROM hotels
WHERE (hotels.status = 'approved'::text);

-- Drop and recreate availability_packages_public_view with security_invoker
DROP VIEW IF EXISTS public.availability_packages_public_view;
CREATE VIEW public.availability_packages_public_view
WITH (security_invoker = true) AS
SELECT 
    id,
    hotel_id,
    start_date,
    end_date,
    duration_days,
    total_rooms,
    available_rooms,
    occupancy_mode,
    base_price_usd,
    current_price_usd,
    meal_plan,
    room_type,
    created_at,
    updated_at
FROM availability_packages;

-- Drop and recreate hotels_with_filters_view with security_invoker
DROP VIEW IF EXISTS public.hotels_with_filters_view;
CREATE VIEW public.hotels_with_filters_view
WITH (security_invoker = true) AS
SELECT h.id,
    h.owner_id,
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
    h.is_featured,
    h.created_at,
    h.updated_at,
    h.available_months,
    h.status,
    h.rejection_reason,
    h.atmosphere,
    h.ideal_guests,
    h.perfect_location,
    h.contact_email,
    h.contact_name,
    h.contact_phone,
    h.postal_code,
    h.property_style,
    h.location_address,
    h.check_in_weekday,
    h.stay_lengths,
    h.meals_offered,
    h.features_hotel,
    h.features_room,
    h.ideal_guests_description,
    h.atmosphere_description,
    h.location_highlight_description,
    h.meal_plans,
    h.room_types,
    h.photos,
    h.faqs,
    h.location_description,
    h.preferred,
    h.terms,
    h.rates,
    h.pending_changes,
    h.enable_price_increase,
    h.price_increase_cap,
    h.pricingmatrix,
    h.allow_stay_extensions,
    h.banking_info,
    h.laundry_service,
    h.additional_data,
    h.room_description,
    h.weekly_laundry_included,
    h.external_laundry_available,
    h.version,
    h.last_modified_by,
    h.is_locked,
    h.locked_by,
    h.locked_at,
    h.referred_by,
    h.price_increase_pct,
    h.round_step,
    h.contact_website,
    h.total_rooms,
    h.referral_code,
    h.source_origin,
    h.rating,
    h.state,
    COALESCE(array_agg(DISTINCT t.name) FILTER (WHERE (t.name IS NOT NULL)), '{}'::text[]) AS theme_names,
    COALESCE(array_agg(DISTINCT a.name) FILTER (WHERE (a.name IS NOT NULL)), '{}'::text[]) AS activity_names,
    COALESCE(array_agg(DISTINCT ht.theme_id) FILTER (WHERE (ht.theme_id IS NOT NULL)), '{}'::uuid[]) AS theme_ids,
    COALESCE(array_agg(DISTINCT ha.activity_id) FILTER (WHERE (ha.activity_id IS NOT NULL)), '{}'::uuid[]) AS activity_ids
FROM ((((hotels h
     LEFT JOIN hotel_themes ht ON ((h.id = ht.hotel_id)))
     LEFT JOIN themes t ON ((ht.theme_id = t.id)))
     LEFT JOIN hotel_activities ha ON ((h.id = ha.hotel_id)))
     LEFT JOIN activities a ON ((ha.activity_id = a.id)))
WHERE (h.status = 'approved'::text)
GROUP BY h.id;

-- Drop and recreate hotels_detailed_view with security_invoker (if it exists)
DROP VIEW IF EXISTS public.hotels_detailed_view;
CREATE VIEW public.hotels_detailed_view
WITH (security_invoker = true) AS
SELECT hotels.id,
    hotels.name,
    hotels.description,
    hotels.country,
    hotels.city,
    hotels.address,
    hotels.postal_code,
    hotels.price_per_month,
    hotels.main_image_url,
    hotels.category,
    hotels.property_type,
    hotels.style,
    hotels.ideal_guests,
    hotels.atmosphere,
    hotels.perfect_location,
    hotels.is_featured,
    hotels.status,
    hotels.available_months,
    hotels.features_hotel,
    hotels.features_room,
    hotels.meal_plans,
    hotels.stay_lengths,
    hotels.faqs,
    hotels.check_in_weekday,
    hotels.room_description,
    hotels.weekly_laundry_included,
    hotels.external_laundry_available,
    hotels.allow_stay_extensions,
    hotels.total_rooms,
    hotels.terms,
    hotels.enable_price_increase,
    hotels.price_increase_cap,
    hotels.rates,
    hotels.pricingmatrix,
    hotels.created_at,
    hotels.updated_at
FROM hotels
WHERE (hotels.status = 'approved'::text);