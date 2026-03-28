-- Fix the demo hotel data to align with correct system values
UPDATE public.hotels 
SET 
  -- Fix stay lengths to correct system values [8, 15, 22, 29]
  stay_lengths = ARRAY[8, 15, 22, 29],
  
  -- Fix meal plans to match filter system values (Spanish values for consistency)
  meal_plans = ARRAY[
    'Solo alojamiento',
    'Desayuno incluido', 
    'Media pensión',
    'Pensión completa',
    'Servicio de lavandería incluido'
  ],
  
  -- Fix hotel features to match filter system (Spanish values)
  features_hotel = '[
    "WiFi",
    "Aparcamiento",
    "Piscina",
    "Gimnasio", 
    "Restaurante",
    "Bar",
    "Spa",
    "Pet friendly",
    "Recepción 24h",
    "Servicio de habitaciones",
    "Conserjería",
    "Servicio de lavandería",
    "Centro de negocios",
    "Salas de conferencias",
    "Traslado al aeropuerto",
    "Alquiler de bicicletas",
    "Alquiler de coches",
    "Organización de tours",
    "Cambio de divisas",
    "Cajero automático",
    "Caja fuerte",
    "Consigna de equipajes",
    "Tintorería"
  ]'::jsonb,
  
  -- Fix room features to match filter system (Spanish values)
  features_room = '[
    "Aire acondicionado",
    "Baño privado",
    "Balcón",
    "Vista al mar",
    "Vista a la ciudad",
    "Vista a la montaña",
    "Vista al jardín",
    "Cocina",
    "Cocina americana",
    "Nevera",
    "Microondas",
    "Cafetera",
    "Lavavajillas",
    "Lavadora",
    "Secadora",
    "Plancha",
    "Secador de pelo",
    "Caja fuerte",
    "Escritorio",
    "Sofá",
    "Mesa de comedor",
    "Armario"
  ]'::jsonb,
  
  -- Add proper At A Glance content
  ideal_guests = 'profesionales remotos y nómadas digitales que buscan un entorno moderno y bien conectado para trabajar y relajarse',
  atmosphere = 'cosmopolita y energética, perfecta para quienes buscan la vibrante vida urbana de Barcelona',
  perfect_location = 'en el corazón de Barcelona, con fácil acceso a las mejores atracciones, restaurantes y transporte público de la ciudad',
  
  updated_at = NOW()
WHERE name = 'Demo Filter Test Hotel';