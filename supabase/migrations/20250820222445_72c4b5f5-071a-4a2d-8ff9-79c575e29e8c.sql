-- ROLLBACK: Remove the duplicate single packages that were incorrectly created
-- and clean up the occupancy_mode concept since packages represent rooms, not occupancy types

-- First, remove any duplicate single packages (keep only one package per room/meal/duration)
DELETE FROM availability_packages 
WHERE occupancy_mode = 'single';

-- Update the schema to remove occupancy_mode distinction 
-- Packages now represent rooms that can be booked as either single or double
-- Store the base price as the double occupancy rate (per person)
UPDATE availability_packages 
SET occupancy_mode = 'room';

-- Ensure all packages use standardized meal plan naming
UPDATE availability_packages 
SET meal_plan = CASE 
  WHEN meal_plan IN ('room_only', 'accommodationOnly') THEN 'room_only'
  WHEN meal_plan IN ('breakfast', 'breakfastIncluded') THEN 'breakfast'  
  WHEN meal_plan IN ('half_board', 'halfBoard') THEN 'half_board'
  WHEN meal_plan IN ('full_board', 'fullBoard') THEN 'full_board'
  WHEN meal_plan IN ('all_inclusive', 'allInclusive') THEN 'all_inclusive'
  ELSE meal_plan
END;

-- Add comment to clarify the new structure
COMMENT ON COLUMN availability_packages.occupancy_mode IS 'Always "room" - each package represents a room that can be booked as single or double occupancy';
COMMENT ON COLUMN availability_packages.base_price_usd IS 'Base price per person for double occupancy - single occupancy calculated using Sacred Policy';
COMMENT ON COLUMN availability_packages.current_price_usd IS 'Current price per person for double occupancy - single occupancy calculated using Sacred Policy';