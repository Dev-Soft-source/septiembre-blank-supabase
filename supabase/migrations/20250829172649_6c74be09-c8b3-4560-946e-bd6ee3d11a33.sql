-- Step 1: Execute End-to-End Test - Create "Prioridad 1" Hotel
-- Call the hotel registration function with complete test data

SELECT public.submit_hotel_registration(
  -- Hotel data (16 sections)
  '{
    "name": "Prioridad 1",
    "total_rooms": 25,
    "address": "Calle de Prueba 123",
    "city": "Madrid",
    "country": "España",
    "postal_code": "28001",
    "contact_name": "Manager Test",
    "contact_email": "prioridad1@test-hotel.com",
    "contact_phone": "+34 123 456 789",
    "category": 4,
    "property_type": "hotel",
    "style": "modern",
    "description": "Hotel de prueba para validación completa del sistema Hotel-Living. Ubicado estratégicamente en el corazón de Madrid, ofrece una experiencia única combinando la elegancia moderna con la calidez del servicio personalizado.",
    "room_description": "Habitaciones modernas y elegantes equipadas con todas las comodidades necesarias para una estancia perfecta. Cada habitación cuenta con baño privado, aire acondicionado, WiFi gratuito y vistas espectaculares de la ciudad.",
    "ideal_guests": "Ideal para viajeros profesionales y turistas que buscan comodidad, ubicación central y un servicio excepcional en el corazón de Madrid",
    "atmosphere": "Ambiente moderno y acogedor que combina la sofisticación urbana con la calidez del hogar, creando un espacio perfecto para el descanso y el trabajo",
    "perfect_location": "Ubicación perfecta para explorar el centro histórico de Madrid, con fácil acceso a museos, restaurantes, centros comerciales y transporte público",
    "features_hotel": {
      "wifi_gratuito": true,
      "aire_acondicionado": true,
      "recepcion_24h": true,
      "servicio_habitaciones": true,
      "gimnasio": true,
      "spa": true,
      "restaurante": true,
      "bar": true,
      "parking": true,
      "piscina": false,
      "centro_negocios": true,
      "sala_conferencias": true
    },
    "features_room": {
      "bano_privado": true,
      "ducha": true,
      "secador_pelo": true,
      "television": true,
      "minibar": true,
      "caja_fuerte": true,
      "telefono": true,
      "escritorio": true,
      "armario": true,
      "plancha": true,
      "balcon": false,
      "vista_ciudad": true
    },
    "meals_offered": ["room_only", "breakfast", "half_board"],
    "stay_lengths": [8, 15, 22, 29],
    "check_in_weekday": "Monday",
    "weekly_laundry_included": true,
    "external_laundry_available": false,
    "main_image_url": "https://example.com/prioridad1-main.jpg",
    "price_per_month": 2500,
    "terms": "Términos de prueba aceptados para validación del sistema",
    "available_months": ["10", "11", "12", "01", "02", "03"]
  }'::jsonb,
  
  -- Availability packages (8, 15, 22, 29 days)
  ARRAY[
    '{"start_date": "2024-10-01", "end_date": "2024-10-08", "duration_days": 8, "total_rooms": 5, "available_rooms": 5, "base_price_usd": 800, "current_price_usd": 800}'::jsonb,
    '{"start_date": "2024-10-15", "end_date": "2024-10-29", "duration_days": 15, "total_rooms": 5, "available_rooms": 5, "base_price_usd": 1400, "current_price_usd": 1400}'::jsonb,
    '{"start_date": "2024-11-01", "end_date": "2024-11-22", "duration_days": 22, "total_rooms": 5, "available_rooms": 5, "base_price_usd": 2000, "current_price_usd": 2000}'::jsonb,
    '{"start_date": "2024-12-01", "end_date": "2024-12-29", "duration_days": 29, "total_rooms": 5, "available_rooms": 5, "base_price_usd": 2600, "current_price_usd": 2600}'::jsonb
  ],
  
  -- Hotel images
  ARRAY[]::jsonb[],
  
  -- Hotel themes (using actual IDs from database)
  ARRAY['13b4974d-f6c5-4faf-a35f-d1ddce748714'],
  
  -- Hotel activities (using actual IDs from database)  
  ARRAY['ac49156f-baa1-403c-a31a-7081d8b6a577', '338dd4c9-7bbd-4e9c-942a-e2c165a56cdf'],
  
  -- Development mode
  true
) AS registration_result;