-- Fix remaining categorization issues
-- Field 17: Hotel features 
UPDATE filters 
SET category = 'hotel_features' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '17';

-- Field 18: Room features
UPDATE filters 
SET category = 'room_features' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '18';

-- Field 22: Check-in days (should be a separate category)
UPDATE filters 
SET category = 'check_in_days' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '22';