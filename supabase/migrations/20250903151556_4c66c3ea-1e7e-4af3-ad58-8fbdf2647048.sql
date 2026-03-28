-- Phase 1: Drop existing view and recreate hotels_detailed_view
-- First drop the existing view if it exists
DROP VIEW IF EXISTS hotels_detailed_view;

-- Create hotels_detailed_view with proper data types
CREATE VIEW hotels_detailed_view AS
SELECT 
  h.id,
  h.owner_id,
  h.name,
  h.description,
  h.country,
  h.city,
  h.address,
  h.postal_code,
  h.price_per_month,
  h.main_image_url,
  h.category,
  h.property_type,
  h.property_style,
  h.is_featured,
  h.created_at,
  h.updated_at,
  h.available_months,
  h.status,
  h.atmosphere_description,
  h.ideal_guests_description,
  h.perfect_location,
  h.contact_email,
  h.contact_name,
  h.contact_phone,
  h.check_in_weekday,
  h.stay_lengths,
  h.meals_offered,
  h.features_hotel,
  h.features_room,
  h.meal_plans,
  h.faqs,
  h.terms,
  h.rates,
  h.pending_changes,
  h.enable_price_increase,
  h.price_increase_cap,
  h.pricingmatrix,
  h.allow_stay_extensions,
  h.banking_info,
  h.laundry_service,
  h.room_description,
  h.weekly_laundry_included,
  h.external_laundry_available,
  h.last_modified_by,
  h.referred_by,
  h.price_increase_pct,
  h.round_step,
  h.contact_website,
  h.total_rooms,
  h.referral_code,
  h.source_origin,
  h.rating,
  h.state,
  -- Aggregated hotel images using subquery
  COALESCE(
    (SELECT JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', hi.id,
        'hotel_id', hi.hotel_id,
        'image_url', hi.image_url,
        'is_main', hi.is_main,
        'created_at', hi.created_at
      )
    ) FROM hotel_images hi WHERE hi.hotel_id = h.id), '[]'::jsonb
  ) as hotel_images,
  -- Aggregated hotel themes with theme details using subquery
  COALESCE(
    (SELECT JSON_AGG(
      JSON_BUILD_OBJECT(
        'theme_id', ht.theme_id,
        'themes', JSON_BUILD_OBJECT(
          'id', t.id,
          'name', t.name,
          'description', t.description,
          'category', t.category
        )
      )
    ) FROM hotel_themes ht 
    JOIN themes t ON ht.theme_id = t.id 
    WHERE ht.hotel_id = h.id), '[]'::jsonb
  ) as hotel_themes,
  -- Aggregated hotel activities with activity details using subquery
  COALESCE(
    (SELECT JSON_AGG(
      JSON_BUILD_OBJECT(
        'activity_id', ha.activity_id,
        'activities', JSON_BUILD_OBJECT(
          'id', a.id,
          'name', a.name,
          'category', a.category
        )
      )
    ) FROM hotel_activities ha 
    JOIN activities a ON ha.activity_id = a.id 
    WHERE ha.hotel_id = h.id), '[]'::jsonb
  ) as hotel_activities
FROM hotels h;

-- Grant appropriate permissions
GRANT SELECT ON hotels_detailed_view TO authenticated;
GRANT SELECT ON hotels_detailed_view TO anon;