-- Enhanced hotel registration function with mapping, validation, and dev mode
CREATE OR REPLACE FUNCTION public.submit_hotel_registration(
  hotel_data jsonb, 
  availability_packages jsonb[] DEFAULT NULL, 
  hotel_images jsonb[] DEFAULT NULL, 
  hotel_themes text[] DEFAULT NULL, 
  hotel_activities text[] DEFAULT NULL,
  dev_mode boolean DEFAULT false
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_hotel_id uuid;
  package_data jsonb;
  theme_item text;
  activity_item text;
  theme_id uuid;
  activity_id uuid;
  validation_errors text[] := ARRAY[]::text[];
  missing_themes text[] := ARRAY[]::text[];
  missing_activities text[] := ARRAY[]::text[];
  is_uuid_pattern boolean;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', jsonb_build_object(
        'code', 'AUTH_REQUIRED',
        'message', jsonb_build_object(
          'en', 'Authentication required',
          'es', 'Autenticación requerida', 
          'pt', 'Autenticação obrigatória',
          'ro', 'Autentificare necesară'
        )
      )
    );
  END IF;

  -- VALIDATION LAYER: Check required fields (skip in dev mode)
  IF NOT dev_mode THEN
    IF hotel_data->>'name' IS NULL OR trim(hotel_data->>'name') = '' THEN
      validation_errors := array_append(validation_errors, 'Hotel name is required');
    END IF;
    
    IF hotel_data->>'country' IS NULL OR trim(hotel_data->>'country') = '' THEN
      validation_errors := array_append(validation_errors, 'Country is required');
    END IF;
    
    IF hotel_data->>'city' IS NULL OR trim(hotel_data->>'city') = '' THEN
      validation_errors := array_append(validation_errors, 'City is required');
    END IF;
    
    IF hotel_data->>'contact_email' IS NULL OR trim(hotel_data->>'contact_email') = '' THEN
      validation_errors := array_append(validation_errors, 'Contact email is required');
    END IF;
  END IF;

  -- VALIDATION: Numeric fields
  IF hotel_data->>'total_rooms' IS NOT NULL AND 
     NOT (hotel_data->>'total_rooms' ~ '^[0-9]+$' AND (hotel_data->>'total_rooms')::integer > 0) THEN
    validation_errors := array_append(validation_errors, 'Total rooms must be a positive integer');
  END IF;

  -- MAPPING LAYER: Process hotel themes
  IF hotel_themes IS NOT NULL AND array_length(hotel_themes, 1) > 0 THEN
    FOREACH theme_item IN ARRAY hotel_themes
    LOOP
      -- Check if item is already a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      is_uuid_pattern := theme_item ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
      
      IF is_uuid_pattern THEN
        -- Validate UUID exists in themes table
        SELECT id INTO theme_id FROM public.themes WHERE id = theme_item::uuid LIMIT 1;
        IF theme_id IS NULL THEN
          missing_themes := array_append(missing_themes, theme_item);
        END IF;
      ELSE
        -- Map name to UUID
        SELECT id INTO theme_id FROM public.themes WHERE name = theme_item LIMIT 1;
        IF theme_id IS NULL THEN
          missing_themes := array_append(missing_themes, theme_item);
        END IF;
      END IF;
    END LOOP;
  END IF;

  -- MAPPING LAYER: Process hotel activities
  IF hotel_activities IS NOT NULL AND array_length(hotel_activities, 1) > 0 THEN
    FOREACH activity_item IN ARRAY hotel_activities
    LOOP
      -- Check if item is already a UUID
      is_uuid_pattern := activity_item ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
      
      IF is_uuid_pattern THEN
        -- Validate UUID exists in activities table
        SELECT id INTO activity_id FROM public.activities WHERE id = activity_item::uuid LIMIT 1;
        IF activity_id IS NULL THEN
          missing_activities := array_append(missing_activities, activity_item);
        END IF;
      ELSE
        -- Map name to UUID
        SELECT id INTO activity_id FROM public.activities WHERE name = activity_item LIMIT 1;
        IF activity_id IS NULL THEN
          missing_activities := array_append(missing_activities, activity_item);
        END IF;
      END IF;
    END LOOP;
  END IF;

  -- VALIDATION: Check for missing themes/activities
  IF array_length(missing_themes, 1) > 0 THEN
    validation_errors := array_append(validation_errors, 
      'Themes not found: ' || array_to_string(missing_themes, ', ')
    );
  END IF;

  IF array_length(missing_activities, 1) > 0 THEN
    validation_errors := array_append(validation_errors, 
      'Activities not found: ' || array_to_string(missing_activities, ', ')
    );
  END IF;

  -- Return validation errors if any
  IF array_length(validation_errors, 1) > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'VALIDATION_FAILED',
        'message', jsonb_build_object(
          'en', 'Validation failed: ' || array_to_string(validation_errors, '; '),
          'es', 'Validación fallida: ' || array_to_string(validation_errors, '; '),
          'pt', 'Validação falhada: ' || array_to_string(validation_errors, '; '),
          'ro', 'Validarea a eșuat: ' || array_to_string(validation_errors, '; ')
        ),
        'details', validation_errors
      )
    );
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

  -- Insert hotel themes with proper mapping
  IF hotel_themes IS NOT NULL THEN
    FOREACH theme_item IN ARRAY hotel_themes
    LOOP
      -- Check if item is UUID or name and get the UUID
      is_uuid_pattern := theme_item ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
      
      IF is_uuid_pattern THEN
        theme_id := theme_item::uuid;
      ELSE
        SELECT id INTO theme_id FROM public.themes WHERE name = theme_item LIMIT 1;
      END IF;
      
      IF theme_id IS NOT NULL THEN
        INSERT INTO public.hotel_themes (hotel_id, theme_id) 
        VALUES (new_hotel_id, theme_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Insert hotel activities with proper mapping
  IF hotel_activities IS NOT NULL THEN
    FOREACH activity_item IN ARRAY hotel_activities
    LOOP
      -- Check if item is UUID or name and get the UUID
      is_uuid_pattern := activity_item ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
      
      IF is_uuid_pattern THEN
        activity_id := activity_item::uuid;
      ELSE
        SELECT id INTO activity_id FROM public.activities WHERE name = activity_item LIMIT 1;
      END IF;
      
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
    'message', jsonb_build_object(
      'en', 'Hotel registration completed successfully',
      'es', 'Registro de hotel completado exitosamente',
      'pt', 'Registo do hotel concluído com sucesso', 
      'ro', 'Înregistrarea hotelului finalizată cu succes'
    ),
    'dev_mode', dev_mode
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', jsonb_build_object(
        'code', 'SERVER_ERROR',
        'message', jsonb_build_object(
          'en', 'Hotel registration failed: ' || SQLERRM,
          'es', 'Registro de hotel falló: ' || SQLERRM,
          'pt', 'Registo do hotel falhado: ' || SQLERRM,
          'ro', 'Înregistrarea hotelului a eșuat: ' || SQLERRM
        ),
        'details', SQLERRM
      )
    );
END;
$function$