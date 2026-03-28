-- Add missing property style values that should be available from JotForm
-- This ensures all property styles mentioned by the user are available

INSERT INTO filters (category, value, source_type, is_active, last_sync_at, jotform_field_id)
VALUES 
  ('property_styles', 'Clásico', 'jotform', true, NOW(), '12'),
  ('property_styles', 'Clásico Elegante', 'jotform', true, NOW(), '12'),
  ('property_styles', 'Fusión', 'jotform', true, NOW(), '12')
ON CONFLICT (category, value) DO UPDATE SET
  is_active = true,
  last_sync_at = NOW(),
  source_type = 'jotform',
  jotform_field_id = '12';