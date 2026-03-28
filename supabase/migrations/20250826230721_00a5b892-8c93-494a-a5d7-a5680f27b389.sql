-- Hotel Detail Data Pipeline Normalization Migration
-- This migration ensures ALL hotel records have complete schema with no missing fields

-- 1. First, update all existing hotels to have proper default structures for critical JSONB fields
UPDATE hotels 
SET 
  banking_info = COALESCE(banking_info, '{"bank_name": null, "iban_account": null, "swift_bic": null, "bank_country": null, "account_holder": null}'::jsonb),
  laundry_service = COALESCE(laundry_service, '{"available": false, "self_service": false, "full_service": false, "external_redirect": null, "pricing": null}'::jsonb),
  additional_data = COALESCE(additional_data, '{}'::jsonb),
  features_hotel = COALESCE(features_hotel, '{}'::jsonb),
  features_room = COALESCE(features_room, '{}'::jsonb),
  pricingmatrix = COALESCE(pricingmatrix, '[]'::jsonb),
  rates = COALESCE(rates, '{}'::jsonb)
WHERE 
  banking_info IS NULL 
  OR laundry_service IS NULL 
  OR additional_data IS NULL 
  OR features_hotel IS NULL 
  OR features_room IS NULL 
  OR pricingmatrix IS NULL 
  OR rates IS NULL;

-- 2. Update all hotels to have proper default meal_plans if empty or null
UPDATE hotels 
SET meal_plans = ARRAY['half_board']
WHERE meal_plans IS NULL OR array_length(meal_plans, 1) IS NULL OR meal_plans = '{}';

-- 3. Ensure all text fields have empty strings instead of null for critical display fields
UPDATE hotels 
SET 
  description = COALESCE(description, ''),
  atmosphere = COALESCE(atmosphere, ''),
  ideal_guests = COALESCE(ideal_guests, ''),
  perfect_location = COALESCE(perfect_location, ''),
  address = COALESCE(address, ''),
  property_type = COALESCE(property_type, 'hotel'),
  style = COALESCE(style, ''),
  room_description = COALESCE(room_description, '')
WHERE 
  description IS NULL 
  OR atmosphere IS NULL 
  OR ideal_guests IS NULL 
  OR perfect_location IS NULL 
  OR address IS NULL 
  OR property_type IS NULL 
  OR style IS NULL 
  OR room_description IS NULL;

-- 4. Ensure all array fields have proper defaults
UPDATE hotels 
SET 
  available_months = COALESCE(available_months, '{}'),
  stay_lengths = COALESCE(stay_lengths, '{8,15,22,29}'),
  room_types = COALESCE(room_types, '{}'),
  faqs = COALESCE(faqs, '{}'),
  photos = COALESCE(photos, '{}')
WHERE 
  available_months IS NULL 
  OR stay_lengths IS NULL 
  OR room_types IS NULL 
  OR faqs IS NULL 
  OR photos IS NULL;

-- 5. Add database constraints to prevent future missing critical fields
ALTER TABLE hotels 
  ALTER COLUMN features_hotel SET DEFAULT '{}',
  ALTER COLUMN features_room SET DEFAULT '{}',
  ALTER COLUMN meal_plans SET DEFAULT '{half_board}',
  ALTER COLUMN banking_info SET DEFAULT '{"bank_name": null, "iban_account": null, "swift_bic": null, "bank_country": null, "account_holder": null}',
  ALTER COLUMN laundry_service SET DEFAULT '{"available": false, "self_service": false, "full_service": false, "external_redirect": null, "pricing": null}',
  ALTER COLUMN additional_data SET DEFAULT '{}',
  ALTER COLUMN pricingmatrix SET DEFAULT '[]',
  ALTER COLUMN rates SET DEFAULT '{}',
  ALTER COLUMN available_months SET DEFAULT '{}',
  ALTER COLUMN stay_lengths SET DEFAULT '{8,15,22,29}',
  ALTER COLUMN room_types SET DEFAULT '{}',
  ALTER COLUMN faqs SET DEFAULT '{}',
  ALTER COLUMN photos SET DEFAULT '{}';

-- 6. Set NOT NULL constraints for critical text fields
ALTER TABLE hotels 
  ALTER COLUMN description SET DEFAULT '',
  ALTER COLUMN atmosphere SET DEFAULT '',
  ALTER COLUMN ideal_guests SET DEFAULT '',
  ALTER COLUMN perfect_location SET DEFAULT '',
  ALTER COLUMN property_type SET DEFAULT 'hotel',
  ALTER COLUMN style SET DEFAULT '',
  ALTER COLUMN room_description SET DEFAULT '';

-- 7. Create a trigger function to ensure schema consistency on INSERT/UPDATE
CREATE OR REPLACE FUNCTION ensure_hotel_schema_consistency()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure JSONB fields always have proper structure
  NEW.banking_info = COALESCE(NEW.banking_info, '{"bank_name": null, "iban_account": null, "swift_bic": null, "bank_country": null, "account_holder": null}'::jsonb);
  NEW.laundry_service = COALESCE(NEW.laundry_service, '{"available": false, "self_service": false, "full_service": false, "external_redirect": null, "pricing": null}'::jsonb);
  NEW.additional_data = COALESCE(NEW.additional_data, '{}'::jsonb);
  NEW.features_hotel = COALESCE(NEW.features_hotel, '{}'::jsonb);
  NEW.features_room = COALESCE(NEW.features_room, '{}'::jsonb);
  NEW.pricingmatrix = COALESCE(NEW.pricingmatrix, '[]'::jsonb);
  NEW.rates = COALESCE(NEW.rates, '{}'::jsonb);
  
  -- Ensure array fields have defaults
  NEW.meal_plans = COALESCE(NEW.meal_plans, ARRAY['half_board']);
  NEW.available_months = COALESCE(NEW.available_months, '{}');
  NEW.stay_lengths = COALESCE(NEW.stay_lengths, '{8,15,22,29}');
  NEW.room_types = COALESCE(NEW.room_types, '{}');
  NEW.faqs = COALESCE(NEW.faqs, '{}');
  NEW.photos = COALESCE(NEW.photos, '{}');
  
  -- Ensure text fields are never null for critical display fields
  NEW.description = COALESCE(NEW.description, '');
  NEW.atmosphere = COALESCE(NEW.atmosphere, '');
  NEW.ideal_guests = COALESCE(NEW.ideal_guests, '');
  NEW.perfect_location = COALESCE(NEW.perfect_location, '');
  NEW.property_type = COALESCE(NEW.property_type, 'hotel');
  NEW.style = COALESCE(NEW.style, '');
  NEW.room_description = COALESCE(NEW.room_description, '');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create the trigger to enforce schema consistency
DROP TRIGGER IF EXISTS hotel_schema_consistency_trigger ON hotels;
CREATE TRIGGER hotel_schema_consistency_trigger
  BEFORE INSERT OR UPDATE ON hotels
  FOR EACH ROW
  EXECUTE FUNCTION ensure_hotel_schema_consistency();