
-- Remove any existing meal plan entries that might have "Service" in them
DELETE FROM filters 
WHERE category = 'meal_plans' 
AND (value LIKE '%Service%' OR value LIKE '%Servicio%');

-- Add the correct meal plan options to the filters table
INSERT INTO filters (category, value, source_type, is_active, last_sync_at, jotform_field_id)
VALUES 
  ('meal_plans', 'Solo alojamiento', 'jotform', true, NOW(), '12'),
  ('meal_plans', 'Desayuno incluido', 'jotform', true, NOW(), '12'),
  ('meal_plans', 'Media pensión', 'jotform', true, NOW(), '12'),
  ('meal_plans', 'Pensión completa', 'jotform', true, NOW(), '12'),
  ('meal_plans', 'Todo incluido', 'jotform', true, NOW(), '12'),
  ('meal_plans', 'Lavandería incluida', 'jotform', true, NOW(), '19'),
  ('meal_plans', 'Lavandería exterior', 'jotform', true, NOW(), '20')
ON CONFLICT (category, value) DO UPDATE SET
  is_active = true,
  last_sync_at = NOW(),
  source_type = 'jotform';

-- Update filter_value_mappings to remove "Service" from laundry entries
UPDATE filter_value_mappings 
SET english_value = 'Laundry Included'
WHERE category = 'meal_plans' 
AND spanish_value = 'Lavandería incluida';

UPDATE filter_value_mappings 
SET english_value = 'External Laundry'
WHERE category = 'meal_plans' 
AND spanish_value = 'Lavandería exterior';

-- Add mappings if they don't exist
INSERT INTO filter_value_mappings (category, spanish_value, english_value, is_active)
VALUES 
  ('meal_plans', 'Lavandería incluida', 'Laundry Included', true),
  ('meal_plans', 'Lavandería exterior', 'External Laundry', true)
ON CONFLICT (category, spanish_value) DO UPDATE SET
  english_value = EXCLUDED.english_value,
  is_active = true;
