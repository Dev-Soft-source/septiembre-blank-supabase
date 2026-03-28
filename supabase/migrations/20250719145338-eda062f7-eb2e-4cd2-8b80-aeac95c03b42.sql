
-- Clean up the filters table - remove duplicate "Todo Incluido" (capitalized)
DELETE FROM filters 
WHERE category = 'meal_plans' 
AND value = 'Todo Incluido';

-- Clean up filter_value_mappings - remove old "Service" entries
DELETE FROM filter_value_mappings 
WHERE category = 'meal_plans' 
AND (english_value LIKE '%Service%' OR spanish_value LIKE '%Servicio%');

-- Add complete translation mappings for all meal plan options
INSERT INTO filter_value_mappings (category, spanish_value, english_value, is_active)
VALUES 
  ('meal_plans', 'Solo alojamiento', 'Room Only', true),
  ('meal_plans', 'Desayuno incluido', 'Breakfast Included', true),
  ('meal_plans', 'Media pensión', 'Half Board', true),
  ('meal_plans', 'Pensión completa', 'Full Board', true),
  ('meal_plans', 'Todo incluido', 'All Inclusive', true),
  ('meal_plans', 'Lavandería incluida', 'Laundry Included', true),
  ('meal_plans', 'Lavandería exterior', 'External Laundry', true)
ON CONFLICT (category, spanish_value) DO UPDATE SET
  english_value = EXCLUDED.english_value,
  is_active = true;

-- Add Portuguese translations to filter_value_mappings
-- First, add portuguese_value column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'filter_value_mappings' 
                   AND column_name = 'portuguese_value') THEN
        ALTER TABLE filter_value_mappings ADD COLUMN portuguese_value text;
    END IF;
END $$;

-- Add Romanian translations to filter_value_mappings
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'filter_value_mappings' 
                   AND column_name = 'romanian_value') THEN
        ALTER TABLE filter_value_mappings ADD COLUMN romanian_value text;
    END IF;
END $$;

-- Update with Portuguese and Romanian translations
UPDATE filter_value_mappings 
SET portuguese_value = CASE spanish_value
    WHEN 'Solo alojamiento' THEN 'Apenas alojamento'
    WHEN 'Desayuno incluido' THEN 'Café da manhã incluído'
    WHEN 'Media pensión' THEN 'Meia pensão'
    WHEN 'Pensión completa' THEN 'Pensão completa'
    WHEN 'Todo incluido' THEN 'Tudo incluído'
    WHEN 'Lavandería incluida' THEN 'Lavanderia incluída'
    WHEN 'Lavandería exterior' THEN 'Lavanderia externa'
END,
romanian_value = CASE spanish_value
    WHEN 'Solo alojamiento' THEN 'Doar cazare'
    WHEN 'Desayuno incluido' THEN 'Mic dejun inclus'
    WHEN 'Media pensión' THEN 'Demipensiune'
    WHEN 'Pensión completa' THEN 'Pensiune completă'
    WHEN 'Todo incluido' THEN 'Totul inclus'
    WHEN 'Lavandería incluida' THEN 'Spălătorie inclusă'
    WHEN 'Lavandería exterior' THEN 'Spălătorie externă'
END
WHERE category = 'meal_plans';
