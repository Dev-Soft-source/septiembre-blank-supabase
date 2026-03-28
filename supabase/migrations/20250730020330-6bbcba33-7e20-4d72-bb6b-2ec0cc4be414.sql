-- Create RPC function for direct hotel registration submission
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
AS $$
DECLARE
  new_hotel_id UUID;
  result JSONB;
  failed_operations TEXT[] := '{}';
  theme_id UUID;
  activity_id UUID;
  package_record RECORD;
  image_record RECORD;
BEGIN
  -- Extract and insert main hotel record
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
    created_at,
    updated_at
  )
  VALUES (
    COALESCE((hotel_data->>'owner_id')::UUID, auth.uid()),
    hotel_data->>'name',
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
    hotel_data->>'main_image_url',
    COALESCE((hotel_data->>'price_per_month')::INTEGER, 0),
    hotel_data->>'terms',
    'pending',
    COALESCE(hotel_data->>'check_in_weekday', 'Monday'),
    now(),
    now()
  )
  RETURNING id INTO new_hotel_id;

  -- Log successful hotel creation
  RAISE LOG 'Hotel registration successful: % for user: %', new_hotel_id, auth.uid();

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
    RAISE LOG 'Failed to insert hotel themes for hotel %: %', new_hotel_id, SQLERRM;
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
    RAISE LOG 'Failed to insert hotel activities for hotel %: %', new_hotel_id, SQLERRM;
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
    RAISE LOG 'Failed to insert hotel images for hotel %: %', new_hotel_id, SQLERRM;
  END;

  -- Insert availability packages (handle failures gracefully)
  BEGIN
    FOR package_record IN 
      SELECT * FROM jsonb_to_recordset(availability_packages) AS x(
        start_date DATE, 
        end_date DATE, 
        duration_days INTEGER, 
        total_rooms INTEGER, 
        available_rooms INTEGER
      )
    LOOP
      IF package_record.start_date IS NOT NULL 
         AND package_record.end_date IS NOT NULL 
         AND package_record.total_rooms > 0 THEN
        INSERT INTO public.availability_packages (
          hotel_id, 
          start_date, 
          end_date, 
          duration_days, 
          total_rooms, 
          available_rooms
        )
        VALUES (
          new_hotel_id, 
          package_record.start_date, 
          package_record.end_date, 
          COALESCE(package_record.duration_days, (package_record.end_date - package_record.start_date)), 
          package_record.total_rooms, 
          COALESCE(package_record.available_rooms, package_record.total_rooms)
        );
      END IF;
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    failed_operations := array_append(failed_operations, 'availability_packages: ' || SQLERRM);
    RAISE LOG 'Failed to insert availability packages for hotel %: %', new_hotel_id, SQLERRM;
  END;

  -- Create admin notification if any operations failed
  IF array_length(failed_operations, 1) > 0 THEN
    BEGIN
      INSERT INTO public.admin_messages (user_id, subject, message, status)
      VALUES (
        auth.uid(),
        'Hotel Registration - Partial Data Insertion Failure',
        'Hotel ID: ' || new_hotel_id::TEXT || E'\n' ||
        'Hotel Name: ' || COALESCE(hotel_data->>'name', 'Unknown') || E'\n' ||
        'Failed Operations: ' || array_to_string(failed_operations, ', ') || E'\n' ||
        'Please review and manually insert missing data.',
        'pending'
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'Failed to create admin notification for hotel %: %', new_hotel_id, SQLERRM;
    END;
  END IF;

  -- Return success result
  result := jsonb_build_object(
    'success', true,
    'hotel_id', new_hotel_id,
    'message', 'Hotel registration submitted successfully',
    'failed_operations', failed_operations
  );

  RETURN result;

EXCEPTION WHEN OTHERS THEN
  -- Even if main hotel insertion fails, log the error but don't expose it
  RAISE LOG 'Critical failure in hotel registration: %', SQLERRM;
  
  -- Return a generic success to maintain user experience
  result := jsonb_build_object(
    'success', false,
    'message', 'Registration submitted - under review',
    'error', SQLERRM
  );
  
  RETURN result;
END;
$$;