-- Add missing property style values that should be available from JotForm
-- This ensures all property styles mentioned by the user are available

INSERT INTO filters (category, value, source_type, is_active, last_sync_at)
VALUES 
  ('property_styles', 'Clásico', 'jotform', true, NOW()),
  ('property_styles', 'Clásico Elegante', 'jotform', true, NOW()),
  ('property_styles', 'Fusión', 'jotform', true, NOW())
ON CONFLICT (category, value, jotform_field_id) DO NOTHING;