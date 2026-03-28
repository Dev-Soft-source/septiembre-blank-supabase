-- Fix duplicate and conflicting hotel fields
-- Remove redundant preferredWeekday column (keeping check_in_weekday as standard)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS "preferredWeekday";

-- Remove redundant enablepriceincrease column (keeping enable_price_increase)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS enablepriceincrease;

-- Remove redundant priceincreasecap column (keeping price_increase_cap)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS priceincreasecap;

-- Ensure contact_website column exists for future use
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS contact_website TEXT;

-- Create index on main fields for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_contact_fields ON public.hotels(contact_name, contact_email);
CREATE INDEX IF NOT EXISTS idx_hotels_checkin_day ON public.hotels(check_in_weekday);

-- Update RPC function to handle proper field mapping and contact data
CREATE OR REPLACE FUNCTION public.submit_hotel_registration(
  hotel_data JSONB,
  availability_packages JSONB DEFAULT '[]'::jsonb,
  hotel_images JSONB DEFAULT '[]'::jsonb,
  hotel_themes JSONB DEFAULT '[]'::jsonb,
  hotel_activities JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_hotel_id UUID;
  result JSONB;
  failed_operations TEXT[] := '{}';
  theme_id UUID;
  activity_id UUID;
  package_record RECORD;
  image_record RECORD;
  current_user_id UUID;
  user_profile RECORD;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Authentication required',
      'error', 'No authenticated user found'
    );
  END IF;

  -- Get user profile data for contact info
  SELECT first_name, last_name, email 
  INTO user_profile 
  FROM auth.users 
  WHERE id = current_user_id;

  -- Build proper contact name if not provided or undefined
  DECLARE
    contact_name_value TEXT;
    contact_email_value TEXT;
  BEGIN
    contact_name_value := NULLIF(TRIM(hotel_data->>'contact_name'), '');
    
    -- Fix "undefined undefined" issue
    IF contact_name_value IS NULL OR contact_name_value = 'undefined undefined' OR contact_name_value = 'undefined' THEN
      -- Build from user profile
      contact_name_value := TRIM(COALESCE(user_profile.first_name, '') || ' ' || COALESCE(user_profile.last_name, ''));
      IF TRIM(contact_name_value) = '' THEN
        contact_name_value := 'Hotel Contact';
      END IF;
    END IF;
    
    -- Fix contact email
    contact_email_value := NULLIF(TRIM(hotel_data->>'contact_email'), '');
    IF contact_email_value IS NULL OR contact_email_value = 'undefined' THEN
      contact_email_value := user_profile.email;
    END IF;

    -- Ensure owner_id is set to current authenticated user
    hotel_data := hotel_data || jsonb_build_object(
      'owner_id', current_user_id,
      'contact_name', contact_name_value,
      'contact_email', contact_email_value
    );
  END;

  -- Extract and insert main hotel record with proper field mapping
  INSERT INTO public.hotels (
    owner_id,
    name,
    description,
    country,
    city,
    address,
    postal_code,
    contact_name,
    contact_email,
    contact_phone,
    contact_website,
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
    status,
    check_in_weekday,
    enable_price_increase,
    price_increase_cap,
    created_at,
    updated_at
  )
  VALUES (
    current_user_id,
    COALESCE(hotel_data->>'name', 'Unnamed Hotel'),
    hotel_data->>'description',
    hotel_data->>'country',
    hotel_data->>'city',
    hotel_data->>'address',
    hotel_data->>'postal_code',
    hotel_data->>'contact_name',
    hotel_data->>'contact_email',
    hotel_data->>'contact_phone',
    hotel_data->>'contact_website',
    hotel_data->>'property_type',
    hotel_data->>'style',
    COALESCE((hotel_data->>'category')::INTEGER, 1),
    hotel_data->>'ideal_guests',
    hotel_data->>'atmosphere',
    hotel_data->>'perfect_location',
    hotel_data->>'room_description',
    COALESCE((hotel_data->>'weekly_laundry_included')::BOOLEAN, false),
    COALESCE((hotel_data->>'external_laundry_available')::BOOLEAN, false),
    CASE 
      WHEN hotel_data->'stay_lengths' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(hotel_data->'stay_lengths'))::INTEGER[]
      ELSE '{}'::INTEGER[]
    END,
    CASE 
      WHEN hotel_data->'meals_offered' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(hotel_data->'meals_offered'))
      ELSE '{}'::TEXT[]
    END,
    COALESCE(hotel_data->'features_hotel', '{}'::jsonb),
    COALESCE(hotel_data->'features_room', '{}'::jsonb),
    CASE 
      WHEN hotel_data->'available_months' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(hotel_data->'available_months'))
      ELSE '{}'::TEXT[]
    END,
    NULLIF(TRIM(hotel_data->>'main_image_url'), ''),
    COALESCE((hotel_data->>'price_per_month')::INTEGER, 0),
    hotel_data->>'terms',
    'pending',
    COALESCE(hotel_data->>'check_in_weekday', 'Monday'),
    COALESCE((hotel_data->>'enable_price_increase')::BOOLEAN, false),
    COALESCE((hotel_data->>'price_increase_cap')::INTEGER, 20),
    now(),
    now()
  )
  RETURNING id INTO new_hotel_id;

  -- Log successful hotel creation
  RAISE LOG 'Hotel registration successful: % for authenticated user: %', new_hotel_id, current_user_id;

  -- Insert hotel themes (handle failures gracefully)
  BEGIN
    FOR theme_id IN SELECT (jsonb_array_elements_text(hotel_themes))::UUID
    LOOP
      IF EXISTS (SELECT 1 FROM themes WHERE id = theme_id) THEN
        INSERT INTO public.hotel_themes (hotel_id, theme_id)
        VALUES (new_hotel_id, theme_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    failed_operations := array_append(failed_operations, 'themes: ' || SQLERRM);
    RAISE LOG 'Non-critical: Failed to insert hotel themes for hotel %: %', new_hotel_id, SQLERRM;
  END;

  -- Insert hotel activities (handle failures gracefully)
  BEGIN
    FOR activity_id IN SELECT (jsonb_array_elements_text(hotel_activities))::UUID
    LOOP
      IF EXISTS (SELECT 1 FROM activities WHERE id = activity_id) THEN
        INSERT INTO public.hotel_activities (hotel_id, activity_id)
        VALUES (new_hotel_id, activity_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    failed_operations := array_append(failed_operations, 'activities: ' || SQLERRM);
    RAISE LOG 'Non-critical: Failed to insert hotel activities for hotel %: %', new_hotel_id, SQLERRM;
  END;

  -- Insert hotel images (handle failures gracefully)
  BEGIN
    FOR image_record IN SELECT * FROM jsonb_to_recordset(hotel_images) AS x(url TEXT, is_main BOOLEAN, name TEXT)
    LOOP
      IF image_record.url IS NOT NULL AND image_record.url != '' THEN
        INSERT INTO public.hotel_images (hotel_id, image_url, is_main)
        VALUES (new_hotel_id, image_record.url, COALESCE(image_record.is_main, false))
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    failed_operations := array_append(failed_operations, 'images: ' || SQLERRM);
    RAISE LOG 'Non-critical: Failed to insert hotel images for hotel %: %', new_hotel_id, SQLERRM;
  END;

  -- Insert availability packages (handle failures gracefully)
  BEGIN
    FOR package_record IN SELECT * FROM jsonb_to_recordset(availability_packages) AS x(
      start_date DATE,
      end_date DATE,
      duration_days INTEGER,
      total_rooms INTEGER,
      available_rooms INTEGER,
      base_price_usd INTEGER,
      occupancy_mode TEXT,
      room_type TEXT
    )
    LOOP
      IF package_record.start_date IS NOT NULL AND package_record.end_date IS NOT NULL 
         AND package_record.total_rooms > 0 THEN
        INSERT INTO public.availability_packages (
          hotel_id,
          start_date,
          end_date,
          duration_days,
          total_rooms,
          available_rooms,
          base_price_usd,
          current_price_usd,
          occupancy_mode,
          room_type
        )
        VALUES (
          new_hotel_id,
          package_record.start_date,
          package_record.end_date,
          package_record.duration_days,
          package_record.total_rooms,
          COALESCE(package_record.available_rooms, package_record.total_rooms),
          COALESCE(package_record.base_price_usd, 0),
          COALESCE(package_record.base_price_usd, 0),
          COALESCE(package_record.occupancy_mode, 'double'),
          package_record.room_type
        );
      END IF;
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    failed_operations := array_append(failed_operations, 'packages: ' || SQLERRM);
    RAISE LOG 'Non-critical: Failed to insert availability packages for hotel %: %', new_hotel_id, SQLERRM;
  END;

  -- Always return success for authenticated users
  result := jsonb_build_object(
    'success', true,
    'hotel_id', new_hotel_id,
    'message', 'Hotel registration submitted successfully and is under review',
    'failed_operations', failed_operations,
    'status', 'pending'
  );

  RAISE LOG 'Hotel registration completed successfully for user % - Hotel ID: %', current_user_id, new_hotel_id;
  RETURN result;

EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Critical failure during hotel registration for user %: %', current_user_id, SQLERRM;
  RETURN jsonb_build_object(
    'success', false,
    'message', 'Hotel registration failed',
    'error', 'Please try again or contact support if this persists'
  );
END;
$function$;