-- STANDARDIZE ALL HOTELS: Delete all packages and recreate exactly 2 per hotel with correct Sacred Policy pricing
-- Phase 1: Clean slate - remove all existing packages
DELETE FROM availability_packages;

-- Phase 2: Create exactly 2 standardized packages per hotel based on category
-- 3-star hotels: 8 days (€240), 15 days (€440) 
-- 4-star+ hotels: 8 days (€425), 15 days (€800)
-- All packages: half_board meal plan, double occupancy mode

WITH hotel_package_matrix AS (
  SELECT 
    h.id as hotel_id,
    h.name as hotel_name,
    COALESCE(h.category, 3) as hotel_category,
    COALESCE(h.total_rooms, 1) as total_rooms,
    durations.duration_days,
    CASE 
      WHEN durations.duration_days = 8 AND COALESCE(h.category, 3) >= 4 THEN 425
      WHEN durations.duration_days = 8 THEN 240
      WHEN durations.duration_days = 15 AND COALESCE(h.category, 3) >= 4 THEN 800
      WHEN durations.duration_days = 15 THEN 440
    END as base_price_usd,
    ROW_NUMBER() OVER (PARTITION BY h.id ORDER BY durations.duration_days) as package_order
  FROM hotels h
  CROSS JOIN (VALUES (8), (15)) AS durations(duration_days)
  WHERE h.status = 'approved'
)
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
  hpm.hotel_id,
  -- Start dates: Next Monday + 30 days offset for second package
  (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days')::date + (hpm.package_order - 1) * INTERVAL '30 days' as start_date,
  -- End dates: start_date + duration - 1 day
  (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days')::date + (hpm.package_order - 1) * INTERVAL '30 days' + (hpm.duration_days - 1) * INTERVAL '1 day' as end_date,
  hpm.duration_days,
  hpm.total_rooms,
  hpm.total_rooms as available_rooms,
  'double' as occupancy_mode,
  'half_board' as meal_plan,
  hpm.base_price_usd,
  hpm.base_price_usd as current_price_usd
FROM hotel_package_matrix hpm;

-- Phase 3: Add clarifying comments
COMMENT ON COLUMN availability_packages.base_price_usd IS 'Sacred Policy price per person for double occupancy - single calculated via 1.33x multiplier';
COMMENT ON COLUMN availability_packages.current_price_usd IS 'Current price per person for double occupancy - single calculated via 1.33x multiplier';

-- Phase 4: Verify results with simple counts
DO $$
DECLARE
  total_hotels INTEGER;
  total_packages INTEGER;
  hotels_with_2_packages INTEGER;
BEGIN
  -- Count totals
  SELECT COUNT(*) INTO total_hotels FROM hotels WHERE status = 'approved';
  SELECT COUNT(*) INTO total_packages FROM availability_packages;
  SELECT COUNT(*) INTO hotels_with_2_packages 
  FROM (
    SELECT hotel_id 
    FROM availability_packages 
    GROUP BY hotel_id 
    HAVING COUNT(*) = 2
  ) t;
  
  RAISE LOG 'STANDARDIZATION COMPLETE:';
  RAISE LOG 'Total approved hotels: %', total_hotels;
  RAISE LOG 'Total packages created: %', total_packages;
  RAISE LOG 'Hotels with exactly 2 packages: %', hotels_with_2_packages;
  RAISE LOG 'Expected packages: % (should match total packages)', total_hotels * 2;
  
  -- Log success or warnings
  IF total_packages = total_hotels * 2 AND hotels_with_2_packages = total_hotels THEN
    RAISE LOG 'SUCCESS: All hotels now have exactly 2 standardized packages with consistent Sacred Policy pricing!';
  ELSE
    RAISE WARNING 'Issue detected - please check package distribution';
  END IF;
END $$;