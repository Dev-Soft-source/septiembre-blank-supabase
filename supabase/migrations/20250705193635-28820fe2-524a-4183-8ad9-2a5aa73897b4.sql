-- PHASE 1: EMERGENCY DATA RECOVERY - Spanish Filter Restoration
-- Reactivate all deactivated Spanish filters and correct categorization

-- Step 1: Reactivate all deactivated filters in other_options category
UPDATE filters 
SET is_active = true 
WHERE category = 'other_options' AND is_active = false;

-- Step 2: Reactivate all deactivated activities
UPDATE filters 
SET is_active = true 
WHERE category = 'activities' AND is_active = false;

-- Step 3: Reactivate all deactivated meal_plans
UPDATE filters 
SET is_active = true 
WHERE category = 'meal_plans' AND is_active = false;

-- Step 4: Reactivate all deactivated stay_lengths
UPDATE filters 
SET is_active = true 
WHERE category = 'stay_lengths' AND is_active = false;

-- Step 5: Correct source_type for manually added Spanish entries
-- Set source_type to 'manual' for Spanish terms that were incorrectly marked as 'jotform'
UPDATE filters 
SET source_type = 'manual' 
WHERE source_type = 'jotform' 
AND (
  value LIKE '%ó%' OR value LIKE '%á%' OR value LIKE '%é%' OR value LIKE '%í%' OR value LIKE '%ú%' OR 
  value LIKE '%ñ%' OR value LIKE '%ü%' OR
  value ~ '[áéíóúñü]' OR
  value IN ('Solo alojamiento', 'Desayuno incluido', 'Media pensión', 'Pensión completa',
           'Habitación individual', 'Habitación doble', 'Apartamento', 'Suite', 'Estudio')
);

-- Step 6: Recategorize Spanish room features from other_options
UPDATE filters 
SET category = 'room_features' 
WHERE category = 'other_options' 
AND value IN (
  'Balcón', 'Máquina de Café', 'Baño privado', 'Cocina equipada', 'Vista al mar', 'TV', 
  'Minibar', 'Escritorio', 'Caja fuerte', 'Aire acondicionado en habitación',
  'Terraza privada', 'Jacuzzi privado', 'Chimenea', 'Vista a la montaña',
  'Cafetera', 'Nevera', 'Microondas', 'Sofá cama', 'Mesa de trabajo'
);

-- Step 7: Recategorize Spanish hotel features from other_options  
UPDATE filters 
SET category = 'hotel_features' 
WHERE category = 'other_options' 
AND value IN (
  'Acepta Mascotas', 'Acceso a la Playa', 'Piscina', 'WiFi gratuito', 'Gimnasio', 
  'Restaurante', 'Bar', 'Spa', 'Parking', 'Aire acondicionado', 'Recepción 24h', 
  'Servicio de limpieza', 'Jardín', 'Barbacoa', 'Lavandería', 'Biblioteca',
  'Sala de conferencias', 'Servicio de habitaciones', 'Consigna de equipaje',
  'Alquiler de bicicletas', 'Transfer aeropuerto', 'Cambio de moneda'
);

-- Step 8: Recategorize Spanish room types from other_options
UPDATE filters 
SET category = 'room_types' 
WHERE category = 'other_options' 
AND value IN (
  'Habitación Individual', 'Habitación Doble', 'Apartamento', 'Suite', 'Estudio',
  'Habitación Triple', 'Habitación Familiar', 'Ático', 'Loft', 'Cabaña',
  'Villa', 'Bungalow', 'Casa completa', 'Habitación compartida'
);

-- Step 9: Recategorize cooking and activity-related terms to activities
UPDATE filters 
SET category = 'activities' 
WHERE category = 'other_options' 
AND (
  value LIKE '%Cocina%' OR value LIKE '%Clases%' OR value LIKE '%Taller%' OR
  value LIKE '%Degustación%' OR value LIKE '%Cata%' OR value LIKE '%Curso%' OR
  value IN ('Clases de Cocina Asiática', 'Degustación de Vinos', 'Taller de Repostería',
           'Cata de Aceites', 'Curso de Paella', 'Clases de Cocina Local')
);

-- Step 10: Create missing basic filter entries if they don't exist
INSERT INTO filters (category, value, source_type, is_active) 
VALUES 
  ('meal_plans', 'Solo alojamiento', 'manual', true),
  ('meal_plans', 'Desayuno incluido', 'manual', true),
  ('meal_plans', 'Media pensión', 'manual', true),
  ('meal_plans', 'Pensión completa', 'manual', true),
  ('room_types', 'Habitación individual', 'manual', true),
  ('room_types', 'Habitación doble', 'manual', true),
  ('room_types', 'Apartamento', 'manual', true),
  ('room_types', 'Suite', 'manual', true),
  ('room_types', 'Estudio', 'manual', true)
ON CONFLICT (category, value) DO UPDATE SET 
  is_active = true,
  source_type = 'manual';