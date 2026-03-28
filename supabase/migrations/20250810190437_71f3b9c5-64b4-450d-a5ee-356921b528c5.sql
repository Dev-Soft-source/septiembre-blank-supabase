-- Fix foreign key constraint in submit_hotel_registration by properly handling development user creation
CREATE OR REPLACE FUNCTION public.submit_hotel_registration(
  hotel_data jsonb, 
  availability_packages jsonb[] DEFAULT NULL::jsonb[], 
  hotel_images jsonb[] DEFAULT NULL::jsonb[], 
  hotel_themes text[] DEFAULT NULL::text[], 
  hotel_activities text[] DEFAULT NULL::text[], 
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
  mapped_data jsonb := '{}';
  field_key text;
  field_value text;
  is_production boolean;
  current_user_id uuid;
  is_development boolean;
BEGIN
  -- Detect environment - enhanced logic for Lovable environment
  is_development := (
    current_setting('app.environment', true) = 'development' OR 
    dev_mode OR
    current_setting('request.header.host', true) LIKE '%.lovableproject.com' OR
    current_setting('request.header.host', true) LIKE 'localhost:%'
  );
  is_production := NOT is_development;
  
  -- Get current user ID (may be null in development)
  current_user_id := auth.uid();
  
  -- Development mode: Handle missing authentication
  IF current_user_id IS NULL AND is_development THEN
    -- Use the create-dev-user edge function to create a proper user
    RAISE LOG 'Development mode: No authenticated user, using existing profile if available';
    
    -- Check if we have any existing development profile we can use
    SELECT id INTO current_user_id 
    FROM public.profiles 
    WHERE role = 'hotel_owner' 
    AND (first_name = 'Development' OR first_name LIKE 'Dev%')
    LIMIT 1;
    
    -- If no development profile exists, create a minimal one (this should be handled by the create-dev-user function)
    IF current_user_id IS NULL THEN
      RAISE LOG 'No development profile found, please use the create-dev-user function first';
      RETURN jsonb_build_object(
        'success', false,
        'error', jsonb_build_object(
          'code', 'DEV_USER_REQUIRED',
          'message', jsonb_build_object(
            'en', 'Development user required. Please create one using the create-dev-user function.',
            'es', 'Se requiere usuario de desarrollo. Por favor crea uno usando la función create-dev-user.',
            'pt', 'Usuário de desenvolvimento necessário. Por favor crie um usando a função create-dev-user.',
            'ro', 'Utilizator de dezvoltare necesar. Vă rugăm să creați unul folosind funcția create-dev-user.'
          )
        )
      );
    END IF;
    
    RAISE LOG 'Development mode: Using existing profile with user ID: %', current_user_id;
  END IF;

  -- Authentication check with development bypass
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', jsonb_build_object(
        'code', 'AUTH_REQUIRED',
        'message', jsonb_build_object(
          'en', 'Please log in to continue',
          'es', 'Por favor inicia sesión para continuar',
          'pt', 'Por favor faça login para continuar',
          'ro', 'Vă rugăm să vă conectați pentru a continua'
        )
      )
    );
  END IF;

  -- FIELD MAPPING LAYER: Create flexible field mapping from various frontend formats
  mapped_data := jsonb_build_object();
  
  -- Map hotel name (accept: name, hotel_name, hotelName, title)
  IF hotel_data ? 'name' THEN
    mapped_data := mapped_data || jsonb_build_object('name', hotel_data->>'name');
  ELSIF hotel_data ? 'hotel_name' THEN
    mapped_data := mapped_data || jsonb_build_object('name', hotel_data->>'hotel_name');
  ELSIF hotel_data ? 'hotelName' THEN
    mapped_data := mapped_data || jsonb_build_object('name', hotel_data->>'hotelName');
  ELSIF hotel_data ? 'title' THEN
    mapped_data := mapped_data || jsonb_build_object('name', hotel_data->>'title');
  END IF;

  -- Map country (accept: country, hotel_country, hotelCountry, pais, pays, paese)
  FOR field_key IN SELECT unnest(ARRAY['country', 'hotel_country', 'hotelCountry', 'pais', 'pays', 'paese']) LOOP
    IF hotel_data ? field_key THEN
      mapped_data := mapped_data || jsonb_build_object('country', hotel_data->>field_key);
      EXIT;
    END IF;
  END LOOP;

  -- Map city (accept: city, hotel_city, hotelCity, ciudad, ville, città)
  FOR field_key IN SELECT unnest(ARRAY['city', 'hotel_city', 'hotelCity', 'ciudad', 'ville', 'città']) LOOP
    IF hotel_data ? field_key THEN
      mapped_data := mapped_data || jsonb_build_object('city', hotel_data->>field_key);
      EXIT;
    END IF;
  END LOOP;

  -- Map contact email (accept: contact_email, contactEmail, email, hotel_email)
  FOR field_key IN SELECT unnest(ARRAY['contact_email', 'contactEmail', 'email', 'hotel_email']) LOOP
    IF hotel_data ? field_key THEN
      mapped_data := mapped_data || jsonb_build_object('contact_email', hotel_data->>field_key);
      EXIT;
    END IF;
  END LOOP;

  -- Map description (accept: description, hotel_description, hotelDescription, desc)
  FOR field_key IN SELECT unnest(ARRAY['description', 'hotel_description', 'hotelDescription', 'desc']) LOOP
    IF hotel_data ? field_key THEN
      mapped_data := mapped_data || jsonb_build_object('description', hotel_data->>field_key);
      EXIT;
    END IF;
  END LOOP;

  -- Map total_rooms (accept: total_rooms, totalRooms, rooms, room_count)
  FOR field_key IN SELECT unnest(ARRAY['total_rooms', 'totalRooms', 'rooms', 'room_count']) LOOP
    IF hotel_data ? field_key THEN
      mapped_data := mapped_data || jsonb_build_object('total_rooms', hotel_data->>field_key);
      EXIT;
    END IF;
  END LOOP;

  -- Map remaining fields with flexible patterns
  FOREACH field_key IN ARRAY ARRAY['address', 'postal_code', 'contact_name', 'contact_phone', 'property_type', 'style', 'category', 'ideal_guests', 'atmosphere', 'perfect_location', 'room_description', 'weekly_laundry_included', 'external_laundry_available', 'main_image_url', 'price_per_month', 'terms', 'check_in_weekday'] LOOP
    IF hotel_data ? field_key THEN
      mapped_data := mapped_data || jsonb_build_object(field_key, hotel_data->field_key);
    ELSIF hotel_data ? replace(field_key, '_', '') THEN
      mapped_data := mapped_data || jsonb_build_object(field_key, hotel_data->replace(field_key, '_', ''));
    END IF;
  END LOOP;

  -- Map array fields with flexible naming
  IF hotel_data ? 'stay_lengths' OR hotel_data ? 'stayLengths' THEN
    mapped_data := mapped_data || jsonb_build_object('stay_lengths', COALESCE(hotel_data->'stay_lengths', hotel_data->'stayLengths'));
  END IF;
  
  IF hotel_data ? 'meals_offered' OR hotel_data ? 'mealsOffered' OR hotel_data ? 'meal_plans' THEN
    mapped_data := mapped_data || jsonb_build_object('meals_offered', COALESCE(hotel_data->'meals_offered', hotel_data->'mealsOffered', hotel_data->'meal_plans'));
  END IF;
  
  IF hotel_data ? 'available_months' OR hotel_data ? 'availableMonths' THEN
    mapped_data := mapped_data || jsonb_build_object('available_months', COALESCE(hotel_data->'available_months', hotel_data->'availableMonths'));
  END IF;

  IF hotel_data ? 'features_hotel' OR hotel_data ? 'featuresHotel' OR hotel_data ? 'hotel_features' THEN
    mapped_data := mapped_data || jsonb_build_object('features_hotel', COALESCE(hotel_data->'features_hotel', hotel_data->'featuresHotel', hotel_data->'hotel_features'));
  END IF;

  IF hotel_data ? 'features_room' OR hotel_data ? 'featuresRoom' OR hotel_data ? 'room_features' THEN
    mapped_data := mapped_data || jsonb_build_object('features_room', COALESCE(hotel_data->'features_room', hotel_data->'featuresRoom', hotel_data->'room_features'));
  END IF;

  -- Log unmapped fields for debugging (but don't break submission)
  FOR field_key IN SELECT jsonb_object_keys(hotel_data) LOOP
    IF NOT (mapped_data ? field_key OR 
            mapped_data ? replace(field_key, '_', '') OR
            field_key IN ('name', 'hotel_name', 'hotelName', 'title', 'country', 'hotel_country', 'hotelCountry', 'pais', 'pays', 'paese', 'city', 'hotel_city', 'hotelCity', 'ciudad', 'ville', 'città', 'contact_email', 'contactEmail', 'email', 'hotel_email', 'description', 'hotel_description', 'hotelDescription', 'desc', 'total_rooms', 'totalRooms', 'rooms', 'room_count', 'stay_lengths', 'stayLengths', 'meals_offered', 'mealsOffered', 'meal_plans', 'available_months', 'availableMonths', 'features_hotel', 'featuresHotel', 'hotel_features', 'features_room', 'featuresRoom', 'room_features')) THEN
      RAISE LOG 'Unmapped field received: % = %', field_key, hotel_data->>field_key;
    END IF;
  END LOOP;

  -- VALIDATION LAYER: Check required fields (relaxed in dev mode)
  IF NOT is_development THEN
    IF mapped_data->>'name' IS NULL OR trim(mapped_data->>'name') = '' THEN
      validation_errors := array_append(validation_errors, 'Hotel name is required');
    END IF;
    
    IF mapped_data->>'country' IS NULL OR trim(mapped_data->>'country') = '' THEN
      validation_errors := array_append(validation_errors, 'Country is required');
    END IF;
    
    IF mapped_data->>'city' IS NULL OR trim(mapped_data->>'city') = '' THEN
      validation_errors := array_append(validation_errors, 'City is required');
    END IF;
    
    IF mapped_data->>'contact_email' IS NULL OR trim(mapped_data->>'contact_email') = '' THEN
      validation_errors := array_append(validation_errors, 'Contact email is required');
    END IF;
  END IF;

  -- VALIDATION: Numeric fields
  IF mapped_data->>'total_rooms' IS NOT NULL AND 
     NOT (mapped_data->>'total_rooms' ~ '^[0-9]+$' AND (mapped_data->>'total_rooms')::integer > 0) THEN
    validation_errors := array_append(validation_errors, 'Total rooms must be a positive integer');
  END IF;

  -- MAPPING LAYER: Process hotel themes with flexible input handling
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
        -- Map name to UUID with flexible matching
        SELECT id INTO theme_id FROM public.themes 
        WHERE lower(name) = lower(theme_item) 
        OR lower(replace(name, ' ', '')) = lower(replace(theme_item, ' ', ''))
        OR lower(replace(name, '-', '')) = lower(replace(theme_item, '-', ''))
        LIMIT 1;
        
        IF theme_id IS NULL THEN
          missing_themes := array_append(missing_themes, theme_item);
        END IF;
      END IF;
    END LOOP;
  END IF;

  -- MAPPING LAYER: Process hotel activities with flexible input handling
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
        -- Map name to UUID with flexible matching
        SELECT id INTO activity_id FROM public.activities 
        WHERE lower(name) = lower(activity_item)
        OR lower(replace(name, ' ', '')) = lower(replace(activity_item, ' ', ''))
        OR lower(replace(name, '-', '')) = lower(replace(activity_item, '-', ''))
        LIMIT 1;
        
        IF activity_id IS NULL THEN
          missing_activities := array_append(missing_activities, activity_item);
        END IF;
      END IF;
    END LOOP;
  END IF;

  -- VALIDATION: Check for missing themes/activities (only in production)
  IF NOT is_development THEN
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
  END IF;

  -- Return validation errors with production-safe messaging
  IF array_length(validation_errors, 1) > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'VALIDATION_FAILED',
        'message', CASE WHEN is_production THEN jsonb_build_object(
          'en', 'Some information could not be processed. Please check your data and try again.',
          'es', 'Algunos datos no pudieron procesarse. Por favor verifica tu información e inténtalo de nuevo.',
          'pt', 'Algumas informações não puderam ser processadas. Por favor verifique seus dados e tente novamente.',
          'ro', 'Unele informații nu au putut fi procesate. Vă rugăm să verificați datele și să încercați din nou.'
        ) ELSE jsonb_build_object(
          'en', 'Validation failed: ' || array_to_string(validation_errors, '; '),
          'es', 'Validación fallida: ' || array_to_string(validation_errors, '; '),
          'pt', 'Validação falhada: ' || array_to_string(validation_errors, '; '),
          'ro', 'Validarea a eșuat: ' || array_to_string(validation_errors, '; ')
        ) END,
        'details', CASE WHEN is_production THEN null ELSE validation_errors END
      )
    );
  END IF;

  -- Insert hotel record using mapped data and current_user_id
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
    current_user_id,
    COALESCE(mapped_data->>'name', 'Development Hotel'),
    COALESCE((mapped_data->>'total_rooms')::integer, 1),
    COALESCE(mapped_data->>'description', 'Development hotel description'),
    COALESCE(mapped_data->>'country', 'Development Country'),
    COALESCE(mapped_data->>'city', 'Development City'),
    mapped_data->>'address',
    mapped_data->>'postal_code',
    mapped_data->>'contact_name',
    COALESCE(mapped_data->>'contact_email', 'dev@example.com'),
    mapped_data->>'contact_phone',
    mapped_data->>'property_type',
    mapped_data->>'style',
    COALESCE((mapped_data->>'category')::integer, 1),
    mapped_data->>'ideal_guests',
    mapped_data->>'atmosphere',
    mapped_data->>'perfect_location',
    mapped_data->>'room_description',
    COALESCE((mapped_data->>'weekly_laundry_included')::boolean, false),
    COALESCE((mapped_data->>'external_laundry_available')::boolean, false),
    CASE 
      WHEN mapped_data->'stay_lengths' IS NOT NULL THEN
        ARRAY(SELECT jsonb_array_elements_text(mapped_data->'stay_lengths'))::integer[]
      ELSE ARRAY[]::integer[]
    END,
    CASE 
      WHEN mapped_data->'meals_offered' IS NOT NULL THEN
        ARRAY(SELECT jsonb_array_elements_text(mapped_data->'meals_offered'))
      ELSE ARRAY[]::text[]
    END,
    COALESCE(mapped_data->'features_hotel', '{}'::jsonb),
    COALESCE(mapped_data->'features_room', '{}'::jsonb),
    CASE 
      WHEN mapped_data->'available_months' IS NOT NULL THEN
        ARRAY(SELECT jsonb_array_elements_text(mapped_data->'available_months'))
      ELSE ARRAY[]::text[]
    END,
    COALESCE(mapped_data->>'main_image_url', ''),
    COALESCE((mapped_data->>'price_per_month')::integer, 0),
    COALESCE(mapped_data->>'terms', ''),
    COALESCE(mapped_data->>'check_in_weekday', 'Monday'),
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
        SELECT id INTO theme_id FROM public.themes 
        WHERE lower(name) = lower(theme_item) 
        OR lower(replace(name, ' ', '')) = lower(replace(theme_item, ' ', ''))
        OR lower(replace(name, '-', '')) = lower(replace(theme_item, '-', ''))
        LIMIT 1;
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
        SELECT id INTO activity_id FROM public.activities 
        WHERE lower(name) = lower(activity_item)
        OR lower(replace(name, ' ', '')) = lower(replace(activity_item, ' ', ''))
        OR lower(replace(name, '-', '')) = lower(replace(activity_item, '-', ''))
        LIMIT 1;
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
    'dev_mode', is_development,
    'environment', CASE WHEN is_development THEN 'development' ELSE 'production' END
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', jsonb_build_object(
        'code', 'SERVER_ERROR',
        'message', CASE WHEN is_production THEN jsonb_build_object(
          'en', 'A technical error occurred. Please try again later.',
          'es', 'Ocurrió un error técnico. Por favor inténtalo más tarde.',
          'pt', 'Ocorreu um erro técnico. Por favor tente novamente mais tarde.',
          'ro', 'A apărut o eroare tehnică. Vă rugăm să încercați din nou mai târziu.'
        ) ELSE jsonb_build_object(
          'en', 'Hotel registration failed: ' || SQLERRM,
          'es', 'Registro de hotel falló: ' || SQLERRM,
          'pt', 'Registo do hotel falhado: ' || SQLERRM,
          'ro', 'Înregistrarea hotelului a eșuat: ' || SQLERRM
        ) END,
        'details', CASE WHEN is_production THEN null ELSE SQLERRM END
      )
    );
END;
$function$;