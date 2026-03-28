-- Update existing demo hotels with correct pricing structure using availability_packages table
-- This migration fixes all batch-created demo hotels to use the predefined pricing table

-- First, check if we have the availability_packages table
-- Delete any existing packages for batch-created hotels to clean up
DELETE FROM availability_packages 
WHERE hotel_id IN (
  SELECT id FROM hotels 
  WHERE status = 'approved' 
  AND owner_id IN (SELECT id FROM admin_users)
  AND created_at > '2024-01-01'
);

-- Update hotel categories based on state (4-star for premium states, 3-star for others)
UPDATE hotels 
SET category = CASE 
  WHEN country = 'USA' AND state IN ('California', 'New York', 'New Jersey', 'Pennsylvania') THEN 4
  ELSE 3
END
WHERE status = 'approved' 
AND owner_id IN (SELECT id FROM admin_users)
AND created_at > '2024-01-01';

-- Add rates column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hotels' AND column_name='rates') THEN
    ALTER TABLE hotels ADD COLUMN rates JSONB DEFAULT '{}';
  END IF;
END $$;

-- Function to insert pricing data for a hotel using rates field
CREATE OR REPLACE FUNCTION update_hotel_pricing(
  p_hotel_id UUID,
  p_category INTEGER
) RETURNS VOID AS $$
DECLARE
  pricing_3_star JSONB := '{
    "8-double": 247.50,
    "8-single": 385,
    "15-double": 467.50,
    "15-single": 715,
    "22-double": 660,
    "22-single": 1020,
    "29-double": 880,
    "29-single": 1320
  }';
  pricing_4_star JSONB := '{
    "8-double": 385,
    "8-single": 605,
    "15-double": 742.50,
    "15-single": 1155,
    "22-double": 1072.50,
    "22-single": 1650,
    "29-double": 1430,
    "29-single": 2090
  }';
  pricing JSONB;
  monthly_price INTEGER;
BEGIN
  -- Select pricing table based on category
  IF p_category = 4 THEN
    pricing := pricing_4_star;
    monthly_price := 1430; -- 29-day double room per person
  ELSE
    pricing := pricing_3_star;
    monthly_price := 880; -- 29-day double room per person
  END IF;
  
  -- Update hotel with rates and monthly price
  UPDATE hotels 
  SET rates = pricing,
      price_per_month = monthly_price
  WHERE id = p_hotel_id;
  
  RAISE NOTICE 'Updated hotel % with category % and monthly price %', 
    p_hotel_id, p_category, monthly_price;
END;
$$ LANGUAGE plpgsql;

-- Update all demo hotels with correct pricing
DO $$
DECLARE
  hotel_record RECORD;
BEGIN
  FOR hotel_record IN 
    SELECT id, category, name FROM hotels 
    WHERE status = 'approved' 
    AND owner_id IN (SELECT id FROM admin_users)
    AND created_at > '2024-01-01'
  LOOP
    PERFORM update_hotel_pricing(hotel_record.id, hotel_record.category);
    RAISE NOTICE 'Updated hotel: %', hotel_record.name;
  END LOOP;
END;
$$;

-- Clean up the temporary function
DROP FUNCTION update_hotel_pricing;