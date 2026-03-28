-- Step 1: Create test hotel using edge function call
SELECT
  net.http_post(
    url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/submit-hotel-registration',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := json_build_object(
      'hotel_data', json_build_object(
        'name', 'Prioridad 1',
        'total_rooms', 25,
        'address', 'Calle de Prueba 123',
        'city', 'Madrid',
        'country', 'España',
        'postal_code', '28001',
        'contact_name', 'Manager Test',
        'contact_email', 'prioridad1@test-hotel.com',
        'contact_phone', '+34 123 456 789',
        'category', 4,
        'property_type', 'hotel',
        'style', 'modern',
        'description', 'Hotel de prueba para validación completa del sistema Hotel-Living. Ubicado estratégicamente en el corazón de Madrid, ofrece una experiencia única combinando la elegancia moderna con la calidez del servicio personalizado.',
        'room_description', 'Habitaciones modernas y elegantes equipadas con todas las comodidades necesarias para una estancia perfecta.',
        'ideal_guests', 'Ideal para viajeros profesionales y turistas que buscan comodidad, ubicación central y un servicio excepcional',
        'atmosphere', 'Ambiente moderno y acogedor que combina la sofisticación urbana con la calidez del hogar',
        'perfect_location', 'Ubicación perfecta para explorar el centro histórico de Madrid',
        'features_hotel', json_build_object(
          'wifi_gratuito', true,
          'aire_acondicionado', true,
          'recepcion_24h', true,
          'gimnasio', true,
          'spa', true,
          'restaurante', true,
          'parking', true
        ),
        'features_room', json_build_object(
          'bano_privado', true,
          'television', true,
          'minibar', true,
          'caja_fuerte', true,
          'vista_ciudad', true
        ),
        'meals_offered', json_build_array('room_only', 'breakfast', 'half_board'),
        'stay_lengths', json_build_array(8, 15, 22, 29),
        'check_in_weekday', 'Monday',
        'weekly_laundry_included', true,
        'external_laundry_available', false,
        'price_per_month', 2500,
        'available_months', json_build_array('10', '11', '12', '01', '02', '03')
      ),
      'availability_packages', json_build_array(
        json_build_object('start_date', '2024-10-01', 'end_date', '2024-10-08', 'duration_days', 8, 'total_rooms', 5, 'available_rooms', 5, 'base_price_usd', 800, 'current_price_usd', 800),
        json_build_object('start_date', '2024-10-15', 'end_date', '2024-10-29', 'duration_days', 15, 'total_rooms', 5, 'available_rooms', 5, 'base_price_usd', 1400, 'current_price_usd', 1400),
        json_build_object('start_date', '2024-11-01', 'end_date', '2024-11-22', 'duration_days', 22, 'total_rooms', 5, 'available_rooms', 5, 'base_price_usd', 2000, 'current_price_usd', 2000),
        json_build_object('start_date', '2024-12-01', 'end_date', '2024-12-29', 'duration_days', 29, 'total_rooms', 5, 'available_rooms', 5, 'base_price_usd', 2600, 'current_price_usd', 2600)
      ),
      'hotel_images', json_build_array(),
      'hotel_themes', json_build_array('13b4974d-f6c5-4faf-a35f-d1ddce748714'),
      'hotel_activities', json_build_array('ac49156f-baa1-403c-a31a-7081d8b6a577', '338dd4c9-7bbd-4e9c-942a-e2c165a56cdf'),
      'dev_mode', true
    )::jsonb
  ) AS registration_response;