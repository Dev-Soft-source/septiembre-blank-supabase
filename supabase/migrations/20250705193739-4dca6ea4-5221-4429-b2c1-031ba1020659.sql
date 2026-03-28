-- PHASE 1: EMERGENCY DATA RECOVERY - Spanish Filter Restoration (Fixed)
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
UPDATE filters 
SET source_type = 'manual' 
WHERE source_type = 'jotform' 
AND (
  value ~ '[áéíóúñü]' OR
  value IN ('Solo alojamiento', 'Desayuno incluido', 'Media pensión', 'Pensión completa',
           'Habitación individual', 'Habitación doble', 'Apartamento', 'Suite', 'Estudio')
);

-- Step 6: Recategorize Spanish room features from other_options (only if target doesn't exist)
UPDATE filters 
SET category = 'room_features' 
WHERE category = 'other_options' 
AND value IN (
  'Balcón', 'Máquina de Café', 'Baño privado', 'Cocina equipada', 'Vista al mar', 'TV', 
  'Minibar', 'Escritorio', 'Caja fuerte', 'Aire acondicionado en habitación',
  'Terraza privada', 'Jacuzzi privado', 'Chimenea', 'Vista a la montaña',
  'Cafetera', 'Nevera', 'Microondas', 'Sofá cama', 'Mesa de trabajo'
)
AND NOT EXISTS (
  SELECT 1 FROM filters f2 
  WHERE f2.category = 'room_features' 
  AND f2.value = filters.value
);

-- Step 7: Recategorize Spanish hotel features from other_options (only if target doesn't exist)
UPDATE filters 
SET category = 'hotel_features' 
WHERE category = 'other_options' 
AND value IN (
  'Acepta Mascotas', 'Acceso a la Playa', 'Piscina', 'WiFi gratuito', 'Gimnasio', 
  'Restaurante', 'Bar', 'Spa', 'Parking', 'Aire acondicionado', 'Recepción 24h', 
  'Servicio de limpieza', 'Jardín', 'Barbacoa', 'Lavandería', 'Biblioteca',
  'Sala de conferencias', 'Servicio de habitaciones', 'Consigna de equipaje',
  'Alquiler de bicicletas', 'Transfer aeropuerto', 'Cambio de moneda'
)
AND NOT EXISTS (
  SELECT 1 FROM filters f2 
  WHERE f2.category = 'hotel_features' 
  AND f2.value = filters.value
);

-- Step 8: Recategorize Spanish room types from other_options (only if target doesn't exist)
UPDATE filters 
SET category = 'room_types' 
WHERE category = 'other_options' 
AND value IN (
  'Habitación Individual', 'Habitación Doble', 'Apartamento', 'Suite', 'Estudio',
  'Habitación Triple', 'Habitación Familiar', 'Ático', 'Loft', 'Cabaña',
  'Villa', 'Bungalow', 'Casa completa', 'Habitación compartida'
)
AND NOT EXISTS (
  SELECT 1 FROM filters f2 
  WHERE f2.category = 'room_types' 
  AND f2.value = filters.value
);

-- Step 9: Delete duplicates from other_options that now exist in proper categories
DELETE FROM filters 
WHERE category = 'other_options' 
AND (
  EXISTS (SELECT 1 FROM filters f2 WHERE f2.category = 'room_features' AND f2.value = filters.value) OR
  EXISTS (SELECT 1 FROM filters f2 WHERE f2.category = 'hotel_features' AND f2.value = filters.value) OR
  EXISTS (SELECT 1 FROM filters f2 WHERE f2.category = 'room_types' AND f2.value = filters.value) OR
  EXISTS (SELECT 1 FROM filters f2 WHERE f2.category = 'activities' AND f2.value = filters.value)
);

-- Step 10: Ensure basic filter entries exist
INSERT INTO filters (category, value, source_type, is_active) 
VALUES 
  ('meal_plans', 'Solo alojamiento', 'manual', true),
  ('meal_plans', 'Desayuno incluido', 'manual', true),
  ('meal_plans', 'Media pensión', 'manual', true),
  ('meal_plans', 'Pensión completa', 'manual', true)
ON CONFLICT (category, value) DO UPDATE SET 
  is_active = true,
  source_type = 'manual';