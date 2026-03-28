-- Phase 1: Create hotels_detailed_view
-- This view provides a unified interface for frontend consumption
CREATE OR REPLACE VIEW hotels_detailed_view AS
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
  -- Aggregated hotel images
  COALESCE(
    JSON_AGG(
      DISTINCT CASE 
        WHEN hi.id IS NOT NULL THEN 
          JSON_BUILD_OBJECT(
            'id', hi.id,
            'hotel_id', hi.hotel_id,
            'image_url', hi.image_url,
            'is_main', hi.is_main,
            'created_at', hi.created_at
          )
        ELSE NULL
      END
    ) FILTER (WHERE hi.id IS NOT NULL), 
    '[]'::json
  ) as hotel_images,
  -- Aggregated hotel themes with theme details
  COALESCE(
    JSON_AGG(
      DISTINCT CASE 
        WHEN ht.theme_id IS NOT NULL THEN 
          JSON_BUILD_OBJECT(
            'theme_id', ht.theme_id,
            'themes', JSON_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'description', t.description,
              'category', t.category
            )
          )
        ELSE NULL
      END
    ) FILTER (WHERE ht.theme_id IS NOT NULL), 
    '[]'::json
  ) as hotel_themes,
  -- Aggregated hotel activities with activity details
  COALESCE(
    JSON_AGG(
      DISTINCT CASE 
        WHEN ha.activity_id IS NOT NULL THEN 
          JSON_BUILD_OBJECT(
            'activity_id', ha.activity_id,
            'activities', JSON_BUILD_OBJECT(
              'id', a.id,
              'name', a.name,
              'category', a.category
            )
          )
        ELSE NULL
      END
    ) FILTER (WHERE ha.activity_id IS NOT NULL), 
    '[]'::json
  ) as hotel_activities
FROM hotels h
LEFT JOIN hotel_images hi ON h.id = hi.hotel_id
LEFT JOIN hotel_themes ht ON h.id = ht.hotel_id
LEFT JOIN themes t ON ht.theme_id = t.id
LEFT JOIN hotel_activities ha ON h.id = ha.hotel_id
LEFT JOIN activities a ON ha.activity_id = a.id
GROUP BY 
  h.id, h.owner_id, h.name, h.description, h.country, h.city, h.address, 
  h.postal_code, h.price_per_month, h.main_image_url, h.category, h.property_type, 
  h.property_style, h.is_featured, h.created_at, h.updated_at, h.available_months, 
  h.status, h.atmosphere_description, h.ideal_guests_description, h.perfect_location, 
  h.contact_email, h.contact_name, h.contact_phone, h.check_in_weekday, h.stay_lengths, 
  h.meals_offered, h.features_hotel, h.features_room, h.meal_plans, h.faqs, h.terms, 
  h.rates, h.pending_changes, h.enable_price_increase, h.price_increase_cap, 
  h.pricingmatrix, h.allow_stay_extensions, h.banking_info, h.laundry_service, 
  h.room_description, h.weekly_laundry_included, h.external_laundry_available, 
  h.last_modified_by, h.referred_by, h.price_increase_pct, h.round_step, 
  h.contact_website, h.total_rooms, h.referral_code, h.source_origin, h.rating, h.state;

-- Grant appropriate permissions
GRANT SELECT ON hotels_detailed_view TO authenticated;
GRANT SELECT ON hotels_detailed_view TO anon;