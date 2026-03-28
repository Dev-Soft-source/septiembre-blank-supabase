-- Create missing single room packages for all hotels with correct pricing
-- Only insert where single packages don't already exist for the same dates/meal plans
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
  ap.hotel_id,
  ap.start_date,
  ap.end_date,
  ap.duration_days,
  ap.total_rooms,
  ap.available_rooms,
  'single' as occupancy_mode,
  ap.meal_plan,
  CASE 
    WHEN ap.duration_days = 8 AND ap.meal_plan = 'accommodationOnly' THEN 160
    WHEN ap.duration_days = 8 AND ap.meal_plan = 'breakfastIncluded' THEN 240
    WHEN ap.duration_days = 8 AND ap.meal_plan = 'halfBoard' THEN 320
    WHEN ap.duration_days = 15 AND ap.meal_plan = 'accommodationOnly' THEN 300
    WHEN ap.duration_days = 15 AND ap.meal_plan = 'breakfastIncluded' THEN 450
    WHEN ap.duration_days = 15 AND ap.meal_plan = 'halfBoard' THEN 600
  END as base_price_usd,
  CASE 
    WHEN ap.duration_days = 8 AND ap.meal_plan = 'accommodationOnly' THEN 160
    WHEN ap.duration_days = 8 AND ap.meal_plan = 'breakfastIncluded' THEN 240
    WHEN ap.duration_days = 8 AND ap.meal_plan = 'halfBoard' THEN 320
    WHEN ap.duration_days = 15 AND ap.meal_plan = 'accommodationOnly' THEN 300
    WHEN ap.duration_days = 15 AND ap.meal_plan = 'breakfastIncluded' THEN 450
    WHEN ap.duration_days = 15 AND ap.meal_plan = 'halfBoard' THEN 600
  END as current_price_usd
FROM availability_packages ap
JOIN hotels h ON ap.hotel_id = h.id
WHERE h.status = 'approved' 
  AND h.category = 3
  AND ap.occupancy_mode = 'double'
  AND ap.start_date >= '2030-01-01'  -- Only create for recent/future packages to avoid overlap issues
  AND NOT EXISTS (
    SELECT 1 FROM availability_packages ap2 
    WHERE ap2.hotel_id = ap.hotel_id 
      AND ap2.duration_days = ap.duration_days
      AND ap2.meal_plan = ap.meal_plan
      AND ap2.occupancy_mode = 'single'
      AND ap2.start_date = ap.start_date
  );