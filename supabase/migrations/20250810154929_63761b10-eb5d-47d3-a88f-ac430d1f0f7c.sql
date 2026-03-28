-- Fix hotel registration by creating the submit_hotel_registration function
CREATE OR REPLACE FUNCTION submit_hotel_registration(
  hotel_data jsonb,
  availability_packages jsonb[],
  hotel_images jsonb[],
  hotel_themes text[],
  hotel_activities text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_hotel_id uuid;
  package_data jsonb;
  theme_name text;
  activity_name text;
  theme_id uuid;
  activity_id uuid;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Authentication required');
  END IF;

  -- Insert hotel record
  INSERT INTO public.hotels (
    owner_id,
    name,
    total_rooms,
    description,
    country,
    city,
    address,
    postal_code,
    contact_name,
    contact_email,
    contact_phone,
    property_type,
    style,
    category,
    ideal_guests,
    atmosphere,
    perfect_location,
    room_description,
    weekly_laundry_included,
    external_laundry_available,
    stay_lengths,
    meals_offered,
    features_hotel,
    features_room,
    available_months,
    main_image_url,
    price_per_month,
    terms,
    check_in_weekday,
    status
  ) VALUES (
    auth.uid(),
    hotel_data->>'name',
    COALESCE((hotel_data->>'total_rooms')::integer, 1),
    hotel_data->>'description',
    hotel_data->>'country',
    hotel_data->>'city',
    hotel_data->>'address',
    hotel_data->>'postal_code',
    hotel_data->>'contact_name',
    hotel_data->>'contact_email',
    hotel_data->>'contact_phone',
    hotel_data->>'property_type',
    hotel_data->>'style',
    COALESCE((hotel_data->>'category')::integer, 1),
    hotel_data->>'ideal_guests',
    hotel_data->>'atmosphere',
    hotel_data->>'perfect_location',
    hotel_data->>'room_description',
    COALESCE((hotel_data->>'weekly_laundry_included')::boolean, false),
    COALESCE((hotel_data->>'external_laundry_available')::boolean, false),
    CASE 
      WHEN hotel_data->'stay_lengths' IS NOT NULL THEN
        ARRAY(SELECT jsonb_array_elements_text(hotel_data->'stay_lengths'))::integer[]
      ELSE ARRAY[]::integer[]
    END,
    CASE 
      WHEN hotel_data->'meals_offered' IS NOT NULL THEN
        ARRAY(SELECT jsonb_array_elements_text(hotel_data->'meals_offered'))
      ELSE ARRAY[]::text[]
    END,
    COALESCE(hotel_data->'features_hotel', '{}'::jsonb),
    COALESCE(hotel_data->'features_room', '{}'::jsonb),
    CASE 
      WHEN hotel_data->'available_months' IS NOT NULL THEN
        ARRAY(SELECT jsonb_array_elements_text(hotel_data->'available_months'))
      ELSE ARRAY[]::text[]
    END,
    COALESCE(hotel_data->>'main_image_url', ''),
    COALESCE((hotel_data->>'price_per_month')::integer, 0),
    COALESCE(hotel_data->>'terms', ''),
    COALESCE(hotel_data->>'check_in_weekday', 'Monday'),
    'pending'
  ) RETURNING id INTO new_hotel_id;

  -- Insert availability packages
  IF availability_packages IS NOT NULL THEN
    FOR package_data IN SELECT unnest(availability_packages)
    LOOP
      INSERT INTO public.availability_packages (
        hotel_id,
        start_date,
        end_date,
        duration_days,
        total_rooms,
        available_rooms,
        occupancy_mode,
        base_price_usd,
        current_price_usd
      ) VALUES (
        new_hotel_id,
        (package_data->>'start_date')::date,
        (package_data->>'end_date')::date,
        COALESCE((package_data->>'duration_days')::integer, 8),
        COALESCE((package_data->>'total_rooms')::integer, 1),
        COALESCE((package_data->>'available_rooms')::integer, 1),
        'double',
        COALESCE((package_data->>'base_price_usd')::integer, 1000),
        COALESCE((package_data->>'current_price_usd')::integer, 1000)
      );
    END LOOP;
  END IF;

  -- Insert hotel themes
  IF hotel_themes IS NOT NULL THEN
    FOREACH theme_name IN ARRAY hotel_themes
    LOOP
      -- Find theme by name
      SELECT id INTO theme_id FROM public.themes WHERE name = theme_name LIMIT 1;
      
      IF theme_id IS NOT NULL THEN
        INSERT INTO public.hotel_themes (hotel_id, theme_id) 
        VALUES (new_hotel_id, theme_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Insert hotel activities
  IF hotel_activities IS NOT NULL THEN
    FOREACH activity_name IN ARRAY hotel_activities
    LOOP
      -- Find activity by name
      SELECT id INTO activity_id FROM public.activities WHERE name = activity_name LIMIT 1;
      
      IF activity_id IS NOT NULL THEN
        INSERT INTO public.hotel_activities (hotel_id, activity_id) 
        VALUES (new_hotel_id, activity_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'success', true, 
    'hotel_id', new_hotel_id,
    'message', 'Hotel registration completed successfully'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Hotel registration failed: ' || SQLERRM
    );
END;
$$;

-- Remove invalid filter options (NO and SÍ) from hotel and room features
DELETE FROM public.filters 
WHERE category IN ('hotel_features', 'room_features') 
AND value IN ('NO', 'SÍ', 'no', 'sí', 'Yes', 'No', 'yes', 'no');

-- Ensure room features are mandatory by removing optional indicators
-- This will be handled in the UI components