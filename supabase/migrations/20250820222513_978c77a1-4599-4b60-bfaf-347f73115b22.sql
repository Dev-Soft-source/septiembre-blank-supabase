-- Remove duplicate single packages and fix occupancy_mode constraint
-- Step 1: Remove duplicate single packages that were incorrectly created
DELETE FROM availability_packages 
WHERE occupancy_mode = 'single';

-- Step 2: Drop the existing check constraint on occupancy_mode
ALTER TABLE availability_packages 
DROP CONSTRAINT IF EXISTS availability_packages_occupancy_mode_chk;

-- Step 3: Update all remaining packages to use 'double' as the standard
-- (representing the base price per person for double occupancy)
UPDATE availability_packages 
SET occupancy_mode = 'double';

-- Step 4: Add new constraint allowing only 'double' since packages represent rooms
ALTER TABLE availability_packages 
ADD CONSTRAINT availability_packages_occupancy_mode_chk 
CHECK (occupancy_mode = 'double');

-- Step 5: Standardize meal plan naming for consistency
UPDATE availability_packages 
SET meal_plan = CASE 
  WHEN meal_plan IN ('room_only', 'accommodationOnly') THEN 'room_only'
  WHEN meal_plan IN ('breakfast', 'breakfastIncluded') THEN 'breakfast'  
  WHEN meal_plan IN ('half_board', 'halfBoard') THEN 'half_board'
  WHEN meal_plan IN ('full_board', 'fullBoard') THEN 'full_board'
  WHEN meal_plan IN ('all_inclusive', 'allInclusive') THEN 'all_inclusive'
  ELSE meal_plan
END;

-- Step 6: Add clarifying comments
COMMENT ON COLUMN availability_packages.occupancy_mode IS 'Always "double" - represents base per-person price for double occupancy (single calculated via Sacred Policy)';
COMMENT ON COLUMN availability_packages.base_price_usd IS 'Base price per person for double occupancy';
COMMENT ON COLUMN availability_packages.current_price_usd IS 'Current price per person for double occupancy';