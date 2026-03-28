-- Hotel Schema Normalization Migration
-- Ensure all hotels have consistent data structure for reliable frontend rendering

-- 1. Normalize meal_plan fields - ensure all hotels have meal plan structure
UPDATE hotels 
SET meal_plans = COALESCE(meal_plans, ARRAY['half_board'])
WHERE meal_plans IS NULL OR array_length(meal_plans, 1) IS NULL;

-- 2. Normalize features_hotel - ensure it's always a JSONB object
UPDATE hotels 
SET features_hotel = COALESCE(features_hotel, '{}'::jsonb)
WHERE features_hotel IS NULL;

-- 3. Normalize features_room - ensure it's always a JSONB object
UPDATE hotels 
SET features_room = COALESCE(features_room, '{}'::jsonb)
WHERE features_room IS NULL;

-- 4. Normalize banking_info - ensure it's always a JSONB object with required structure
UPDATE hotels 
SET banking_info = jsonb_build_object(
  'bank_name', null,
  'iban_account', null,
  'swift_bic', null,
  'bank_country', null,
  'account_holder', null
)
WHERE banking_info IS NULL;

-- 5. Normalize additional_data - ensure it's always a JSONB object
UPDATE hotels 
SET additional_data = COALESCE(additional_data, '{}'::jsonb)
WHERE additional_data IS NULL;

-- 6. Normalize pricingmatrix - ensure it's always a JSONB array
UPDATE hotels 
SET pricingmatrix = COALESCE(pricingmatrix, '[]'::jsonb)
WHERE pricingmatrix IS NULL;

-- 7. Normalize rates - ensure it's always a JSONB object
UPDATE hotels 
SET rates = COALESCE(rates, '{}'::jsonb)
WHERE rates IS NULL;

-- 8. Normalize available_months - ensure it's always an array
UPDATE hotels 
SET available_months = COALESCE(available_months, '{}')
WHERE available_months IS NULL;

-- 9. Normalize stay_lengths - ensure it has standard durations
UPDATE hotels 
SET stay_lengths = COALESCE(stay_lengths, ARRAY[8, 15, 22, 29])
WHERE stay_lengths IS NULL OR array_length(stay_lengths, 1) IS NULL;

-- 10. Normalize text fields to prevent null errors
UPDATE hotels 
SET 
  description = COALESCE(description, ''),
  ideal_guests = COALESCE(ideal_guests, ''),
  atmosphere = COALESCE(atmosphere, ''),
  perfect_location = COALESCE(perfect_location, ''),
  property_type = COALESCE(property_type, 'hotel'),
  style = COALESCE(style, ''),
  room_description = COALESCE(room_description, ''),
  terms = COALESCE(terms, ''),
  address = COALESCE(address, ''),
  contact_name = COALESCE(contact_name, ''),
  contact_phone = COALESCE(contact_phone, ''),
  main_image_url = COALESCE(main_image_url, '')
WHERE 
  description IS NULL OR 
  ideal_guests IS NULL OR 
  atmosphere IS NULL OR 
  perfect_location IS NULL OR 
  property_type IS NULL OR 
  style IS NULL OR 
  room_description IS NULL OR 
  terms IS NULL OR 
  address IS NULL OR 
  contact_name IS NULL OR 
  contact_phone IS NULL OR 
  main_image_url IS NULL;

-- 11. Ensure hotels have activities (minimum 2 or empty array)
-- For hotels without activities, we'll leave them empty rather than adding fake ones
-- This allows the frontend to show proper fallbacks

-- 12. Ensure hotels have themes/affinities (minimum 2 or empty array)  
-- For hotels without themes, we'll leave them empty rather than adding fake ones
-- This allows the frontend to show proper fallbacks

-- 13. Add database constraints to prevent future null issues
-- Set default values for critical fields
ALTER TABLE hotels 
ALTER COLUMN meal_plans SET DEFAULT ARRAY['half_board'],
ALTER COLUMN features_hotel SET DEFAULT '{}'::jsonb,
ALTER COLUMN features_room SET DEFAULT '{}'::jsonb,
ALTER COLUMN additional_data SET DEFAULT '{}'::jsonb,
ALTER COLUMN pricingmatrix SET DEFAULT '[]'::jsonb,
ALTER COLUMN rates SET DEFAULT '{}'::jsonb,
ALTER COLUMN available_months SET DEFAULT '{}',
ALTER COLUMN stay_lengths SET DEFAULT ARRAY[8, 15, 22, 29],
ALTER COLUMN description SET DEFAULT '',
ALTER COLUMN ideal_guests SET DEFAULT '',
ALTER COLUMN atmosphere SET DEFAULT '',
ALTER COLUMN perfect_location SET DEFAULT '',
ALTER COLUMN property_type SET DEFAULT 'hotel',
ALTER COLUMN style SET DEFAULT '',
ALTER COLUMN room_description SET DEFAULT '',
ALTER COLUMN terms SET DEFAULT '',
ALTER COLUMN address SET DEFAULT '',
ALTER COLUMN contact_name SET DEFAULT '',
ALTER COLUMN contact_phone SET DEFAULT '',
ALTER COLUMN main_image_url SET DEFAULT '';

-- Log the normalization results
DO $$
DECLARE
  hotel_count integer;
  activities_count integer;
  themes_count integer;
BEGIN
  -- Count total hotels
  SELECT COUNT(*) INTO hotel_count FROM hotels;
  
  -- Count hotels with activities
  SELECT COUNT(DISTINCT ha.hotel_id) INTO activities_count 
  FROM hotel_activities ha 
  JOIN hotels h ON h.id = ha.hotel_id 
  WHERE h.status = 'approved';
  
  -- Count hotels with themes  
  SELECT COUNT(DISTINCT ht.hotel_id) INTO themes_count
  FROM hotel_themes ht
  JOIN hotels h ON h.id = ht.hotel_id 
  WHERE h.status = 'approved';
  
  RAISE LOG 'Hotel schema normalization completed:';
  RAISE LOG 'Total hotels: %', hotel_count;
  RAISE LOG 'Hotels with activities: %', activities_count;
  RAISE LOG 'Hotels with themes: %', themes_count;
END $$;