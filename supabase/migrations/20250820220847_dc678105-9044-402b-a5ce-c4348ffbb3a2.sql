-- Fix all hotel pricing issues for 3-star hotels
-- Update incorrect 15-day breakfast pricing from 338 to 330
UPDATE availability_packages 
SET current_price_usd = 330, base_price_usd = 330
WHERE duration_days = 15 
  AND meal_plan = 'breakfastIncluded' 
  AND occupancy_mode = 'double'
  AND current_price_usd = 338;

-- Update accommodation-only 15-day pricing from 225 to 220
UPDATE availability_packages 
SET current_price_usd = 220, base_price_usd = 220
WHERE duration_days = 15 
  AND meal_plan = 'accommodationOnly' 
  AND occupancy_mode = 'double'
  AND current_price_usd = 225;

-- Insert missing single room packages for all 3-star hotels
-- This will create single room equivalents for all existing double room packages
INSERT INTO availability_packages (
  hotel_id, 
  start_date, 
  end_date, 
  duration_days, 
  total_rooms, 
  available_rooms, 
  occupancy_mode, 
  meal_plan, 
  base_price_usd, 
  current_price_usd
)
SELECT 
  hotel_id,
  start_date,
  end_date,
  duration_days,
  total_rooms,
  available_rooms,
  'single' as occupancy_mode,
  meal_plan,
  CASE 
    WHEN duration_days = 8 AND meal_plan = 'accommodationOnly' THEN 160
    WHEN duration_days = 8 AND meal_plan = 'breakfastIncluded' THEN 240
    WHEN duration_days = 8 AND meal_plan = 'halfBoard' THEN 320
    WHEN duration_days = 15 AND meal_plan = 'accommodationOnly' THEN 300
    WHEN duration_days = 15 AND meal_plan = 'breakfastIncluded' THEN 450
    WHEN duration_days = 15 AND meal_plan = 'halfBoard' THEN 600
  END as base_price_usd,
  CASE 
    WHEN duration_days = 8 AND meal_plan = 'accommodationOnly' THEN 160
    WHEN duration_days = 8 AND meal_plan = 'breakfastIncluded' THEN 240
    WHEN duration_days = 8 AND meal_plan = 'halfBoard' THEN 320
    WHEN duration_days = 15 AND meal_plan = 'accommodationOnly' THEN 300
    WHEN duration_days = 15 AND meal_plan = 'breakfastIncluded' THEN 450
    WHEN duration_days = 15 AND meal_plan = 'halfBoard' THEN 600
  END as current_price_usd
FROM availability_packages ap
JOIN hotels h ON ap.hotel_id = h.id
WHERE h.status = 'approved' 
  AND h.category = 3
  AND ap.occupancy_mode = 'double'
  AND NOT EXISTS (
    SELECT 1 FROM availability_packages ap2 
    WHERE ap2.hotel_id = ap.hotel_id 
      AND ap2.duration_days = ap.duration_days
      AND ap2.meal_plan = ap.meal_plan
      AND ap2.occupancy_mode = 'single'
      AND ap2.start_date = ap.start_date
  );

-- Create missing meal plan packages for hotels that don't have complete coverage
-- Add missing accommodation-only packages for hotels that only have breakfast
INSERT INTO availability_packages (
  hotel_id, 
  start_date, 
  end_date, 
  duration_days, 
  total_rooms, 
  available_rooms, 
  occupancy_mode, 
  meal_plan, 
  base_price_usd, 
  current_price_usd
)
SELECT 
  ap_base.hotel_id,
  ap_base.start_date,
  ap_base.end_date,
  ap_base.duration_days,
  ap_base.total_rooms,
  ap_base.available_rooms,
  ap_base.occupancy_mode,
  'accommodationOnly' as meal_plan,
  CASE 
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'double' THEN 120
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'single' THEN 160
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'double' THEN 220
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'single' THEN 300
  END as base_price_usd,
  CASE 
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'double' THEN 120
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'single' THEN 160
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'double' THEN 220
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'single' THEN 300
  END as current_price_usd
FROM availability_packages ap_base
JOIN hotels h ON ap_base.hotel_id = h.id
WHERE h.status = 'approved' 
  AND h.category = 3
  AND ap_base.meal_plan = 'breakfastIncluded'
  AND NOT EXISTS (
    SELECT 1 FROM availability_packages ap2 
    WHERE ap2.hotel_id = ap_base.hotel_id 
      AND ap2.duration_days = ap_base.duration_days
      AND ap2.occupancy_mode = ap_base.occupancy_mode
      AND ap2.meal_plan = 'accommodationOnly'
      AND ap2.start_date = ap_base.start_date
  );

-- Add missing half-board packages for hotels that have breakfast packages
INSERT INTO availability_packages (
  hotel_id, 
  start_date, 
  end_date, 
  duration_days, 
  total_rooms, 
  available_rooms, 
  occupancy_mode, 
  meal_plan, 
  base_price_usd, 
  current_price_usd
)
SELECT 
  ap_base.hotel_id,
  ap_base.start_date,
  ap_base.end_date,
  ap_base.duration_days,
  ap_base.total_rooms,
  ap_base.available_rooms,
  ap_base.occupancy_mode,
  'halfBoard' as meal_plan,
  CASE 
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'double' THEN 240
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'single' THEN 320
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'double' THEN 440
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'single' THEN 600
  END as base_price_usd,
  CASE 
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'double' THEN 240
    WHEN ap_base.duration_days = 8 AND ap_base.occupancy_mode = 'single' THEN 320
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'double' THEN 440
    WHEN ap_base.duration_days = 15 AND ap_base.occupancy_mode = 'single' THEN 600
  END as current_price_usd
FROM availability_packages ap_base
JOIN hotels h ON ap_base.hotel_id = h.id
WHERE h.status = 'approved' 
  AND h.category = 3
  AND ap_base.meal_plan = 'breakfastIncluded'
  AND NOT EXISTS (
    SELECT 1 FROM availability_packages ap2 
    WHERE ap2.hotel_id = ap_base.hotel_id 
      AND ap2.duration_days = ap_base.duration_days
      AND ap2.occupancy_mode = ap_base.occupancy_mode
      AND ap2.meal_plan = 'halfBoard'
      AND ap2.start_date = ap_base.start_date
  );