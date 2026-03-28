-- First delete any remaining active manual entries to prevent conflicts
DELETE FROM filters WHERE source_type = 'manual' AND is_active = true;

-- Now safely update the remaining categories
UPDATE filters 
SET category = 'hotel_features' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '17';

UPDATE filters 
SET category = 'room_features' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '18';

UPDATE filters 
SET category = 'check_in_days' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '22';