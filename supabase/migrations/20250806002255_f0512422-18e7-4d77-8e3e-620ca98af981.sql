-- Update existing demo hotels with correct pricing structure
-- This migration fixes all batch-created demo hotels to use the predefined pricing table

-- First, delete any existing packages for batch-created hotels to clean up
DELETE FROM hotel_packages 
WHERE hotel_id IN (
  SELECT id FROM hotels 
  WHERE status = 'approved' 
  AND owner_id IN (SELECT id FROM admin_users)
  AND created_at > '2024-01-01'
);

-- Update hotel categories based on state (4-star for premium states, 3-star for others)
UPDATE hotels 
SET category = CASE 
  WHEN state IN ('California', 'New York', 'New Jersey', 'Pennsylvania') THEN 4
  ELSE 3
END
WHERE status = 'approved' 
AND owner_id IN (SELECT id FROM admin_users)
AND created_at > '2024-01-01';

-- Function to insert packages with correct pricing for a hotel
CREATE OR REPLACE FUNCTION insert_packages_for_hotel(
  p_hotel_id UUID,
  p_category INTEGER
) RETURNS VOID AS $$
DECLARE
  pricing_3_star JSONB := '{
    "8": {"double": 495, "single": 385},
    "15": {"double": 935, "single": 715},
    "22": {"double": 1320, "single": 1020},
    "29": {"double": 1760, "single": 1320}
  }';
  pricing_4_star JSONB := '{
    "8": {"double": 770, "single": 605},
    "15": {"double": 1485, "single": 1155},
    "22": {"double": 2145, "single": 1650},
    "29": {"double": 2860, "single": 2090}
  }';
  pricing JSONB;
  duration INTEGER;
  double_price INTEGER;
  single_price INTEGER;
BEGIN
  -- Select pricing table based on category
  IF p_category = 4 THEN
    pricing := pricing_4_star;
  ELSE
    pricing := pricing_3_star;
  END IF;
  
  -- Insert packages for each duration
  FOR duration IN SELECT unnest(ARRAY[8, 15, 22, 29]) LOOP
    double_price := (pricing->duration::text->>'double')::INTEGER;
    single_price := (pricing->duration::text->>'single')::INTEGER;
    
    -- Double room package (price per person = room price / 2)
    INSERT INTO hotel_packages (
      hotel_id, name, duration_days, price_per_person, max_guests,
      available_rooms, start_date, end_date, includes_meals, includes_laundry
    ) VALUES (
      p_hotel_id,
      duration || '-Day Double Room Package',
      duration,
      double_price / 2, -- Per person for double room
      2,
      3 + floor(random() * 7)::INTEGER, -- 3-9 rooms
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '1 year',
      duration >= 22, -- Meals for longer stays
      duration >= 29  -- Laundry for longest stays
    );
    
    -- Single room package
    INSERT INTO hotel_packages (
      hotel_id, name, duration_days, price_per_person, max_guests,
      available_rooms, start_date, end_date, includes_meals, includes_laundry
    ) VALUES (
      p_hotel_id,
      duration || '-Day Single Room Package',
      duration,
      single_price, -- Per person for single room
      1,
      2 + floor(random() * 5)::INTEGER, -- 2-6 rooms
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '1 year',
      duration >= 22,
      duration >= 29
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Insert packages for all demo hotels
DO $$
DECLARE
  hotel_record RECORD;
  monthly_price INTEGER;
BEGIN
  FOR hotel_record IN 
    SELECT id, category FROM hotels 
    WHERE status = 'approved' 
    AND owner_id IN (SELECT id FROM admin_users)
    AND created_at > '2024-01-01'
  LOOP
    -- Insert packages
    PERFORM insert_packages_for_hotel(hotel_record.id, hotel_record.category);
    
    -- Calculate monthly price (29-day double room per person)
    IF hotel_record.category = 4 THEN
      monthly_price := 2860 / 2; -- $1430 per person
    ELSE
      monthly_price := 1760 / 2; -- $880 per person
    END IF;
    
    -- Update hotel with correct monthly price
    UPDATE hotels 
    SET price_per_month = monthly_price
    WHERE id = hotel_record.id;
    
    RAISE NOTICE 'Updated hotel % with category % and monthly price %', 
      hotel_record.id, hotel_record.category, monthly_price;
  END LOOP;
END;
$$;

-- Clean up the temporary function
DROP FUNCTION insert_packages_for_hotel;