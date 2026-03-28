-- Delete inactive manual entries that might cause conflicts
DELETE FROM filters WHERE source_type = 'manual' AND is_active = false;

-- Update hotel features without conflicts
UPDATE filters 
SET category = 'hotel_features' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '17'
AND value NOT IN (
  SELECT value FROM filters 
  WHERE category = 'hotel_features' 
  AND source_type != 'jotform'
);