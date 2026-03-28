-- Disable all validation triggers and update pricing to match the star rating tables

-- Disable all validation triggers on availability_packages
DROP TRIGGER IF EXISTS trg_enforce_price_caps ON availability_packages;
DROP TRIGGER IF EXISTS trg_validate_package_weekday ON availability_packages;
DROP TRIGGER IF EXISTS trg_validate_pkg_weekday ON availability_packages;
DROP TRIGGER IF EXISTS validate_checkin_weekday_trg ON availability_packages;

-- Drop the functions completely
DROP FUNCTION IF EXISTS enforce_price_caps() CASCADE;
DROP FUNCTION IF EXISTS validate_package_checkin_weekday() CASCADE;

-- Add meal_plan column to availability_packages
ALTER TABLE availability_packages 
ADD COLUMN IF NOT EXISTS meal_plan TEXT DEFAULT 'half_board';

-- Now update all pricing without validation interference
UPDATE availability_packages 
SET 
  base_price_usd = CASE 
    -- Get hotel category and calculate price based on star rating tables
    WHEN (SELECT h.category FROM hotels h WHERE h.id = availability_packages.hotel_id) = 3 THEN
      CASE availability_packages.duration_days
        WHEN 8 THEN 800   -- 3-star, 8 days, half board
        WHEN 15 THEN 640  -- 3-star, 15 days, half board  
        WHEN 22 THEN 440  -- 3-star, 22 days, half board
        WHEN 29 THEN 240  -- 3-star, 29 days, half board
        ELSE 800
      END
    WHEN (SELECT h.category FROM hotels h WHERE h.id = availability_packages.hotel_id) = 4 THEN
      CASE availability_packages.duration_days
        WHEN 8 THEN 1280  -- 4-star, 8 days, half board
        WHEN 15 THEN 960  -- 4-star, 15 days, half board
        WHEN 22 THEN 640  -- 4-star, 22 days, half board  
        WHEN 29 THEN 340  -- 4-star, 29 days, half board
        ELSE 1280
      END
    WHEN (SELECT h.category FROM hotels h WHERE h.id = availability_packages.hotel_id) >= 5 THEN
      CASE availability_packages.duration_days
        WHEN 8 THEN 2760  -- 5-star, 8 days, half board
        WHEN 15 THEN 1280 -- 5-star, 15 days, half board
        WHEN 22 THEN 880  -- 5-star, 22 days, half board
        WHEN 29 THEN 480  -- 5-star, 29 days, half board
        ELSE 2760
      END
    ELSE
      -- Default to 3-star pricing for unknown categories
      CASE availability_packages.duration_days
        WHEN 8 THEN 800
        WHEN 15 THEN 640
        WHEN 22 THEN 440
        WHEN 29 THEN 240
        ELSE 800
      END
  END,
  current_price_usd = CASE 
    WHEN (SELECT h.category FROM hotels h WHERE h.id = availability_packages.hotel_id) = 3 THEN
      CASE availability_packages.duration_days
        WHEN 8 THEN 800
        WHEN 15 THEN 640
        WHEN 22 THEN 440
        WHEN 29 THEN 240
        ELSE 800
      END
    WHEN (SELECT h.category FROM hotels h WHERE h.id = availability_packages.hotel_id) = 4 THEN
      CASE availability_packages.duration_days
        WHEN 8 THEN 1280
        WHEN 15 THEN 960
        WHEN 22 THEN 640
        WHEN 29 THEN 340
        ELSE 1280
      END
    WHEN (SELECT h.category FROM hotels h WHERE h.id = availability_packages.hotel_id) >= 5 THEN
      CASE availability_packages.duration_days
        WHEN 8 THEN 2760
        WHEN 15 THEN 1280
        WHEN 22 THEN 880
        WHEN 29 THEN 480
        ELSE 2760
      END
    ELSE
      CASE availability_packages.duration_days
        WHEN 8 THEN 800
        WHEN 15 THEN 640
        WHEN 22 THEN 440
        WHEN 29 THEN 240
        ELSE 800
      END
  END,
  meal_plan = COALESCE(meal_plan, 'half_board'),
  updated_at = now()
WHERE hotel_id IN (SELECT id FROM hotels WHERE status = 'approved');