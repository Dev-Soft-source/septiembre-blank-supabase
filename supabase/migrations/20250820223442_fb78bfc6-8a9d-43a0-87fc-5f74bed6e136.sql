-- STANDARDIZE ALL HOTELS: Delete all packages and recreate exactly 2 per hotel with correct Sacred Policy pricing
-- Phase 1: Clean slate - remove all existing packages
DELETE FROM availability_packages;

-- Phase 2: Create exactly 2 standardized packages per hotel based on category
-- 3-star hotels: 8 days (€240), 15 days (€440) 
-- 4-star+ hotels: 8 days (€425), 15 days (€800)
-- All packages: half_board meal plan, double occupancy mode

WITH hotel_categories AS (
  SELECT 
    id,
    name,
    COALESCE(category, 3) as hotel_category,
    COALESCE(total_rooms, 1) as total_rooms
  FROM hotels 
  WHERE status = 'approved'
),
package_definitions AS (
  SELECT 
    h.id as hotel_id,
    h.name as hotel_name,
    h.hotel_category,
    h.total_rooms,
    pkg.duration_days,
    pkg.base_price_usd,
    -- Generate date ranges starting from next Monday
    (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days')::date + (ROW_NUMBER() OVER (PARTITION BY h.id ORDER BY pkg.duration_days) - 1) * INTERVAL '30 days' as start_date
  FROM hotel_categories h
  CROSS JOIN (
    VALUES 
      (8, CASE WHEN h.hotel_category >= 4 THEN 425 ELSE 240 END),
      (15, CASE WHEN h.hotel_category >= 4 THEN 800 ELSE 440 END)
  ) AS pkg(duration_days, base_price_usd)
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
  pd.hotel_id,
  pd.start_date,
  pd.start_date + (pd.duration_days - 1) * INTERVAL '1 day' as end_date,
  pd.duration_days,
  pd.total_rooms,
  pd.total_rooms as available_rooms,
  'double' as occupancy_mode,
  'half_board' as meal_plan,
  pd.base_price_usd,
  pd.base_price_usd as current_price_usd
FROM package_definitions pd;

-- Phase 3: Add clarifying comments
COMMENT ON COLUMN availability_packages.base_price_usd IS 'Sacred Policy price per person for double occupancy - single calculated via 1.33x multiplier';
COMMENT ON COLUMN availability_packages.current_price_usd IS 'Current price per person for double occupancy - single calculated via 1.33x multiplier';

-- Phase 4: Verify results with a summary query
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
  
  IF total_packages != total_hotels * 2 THEN
    RAISE WARNING 'Mismatch detected! Expected % packages but created %', total_hotels * 2, total_packages;
  END IF;
  
  IF hotels_with_2_packages != total_hotels THEN
    RAISE WARNING 'Not all hotels have exactly 2 packages! % hotels have 2 packages out of %', hotels_with_2_packages, total_hotels;
  END IF;
END $$;