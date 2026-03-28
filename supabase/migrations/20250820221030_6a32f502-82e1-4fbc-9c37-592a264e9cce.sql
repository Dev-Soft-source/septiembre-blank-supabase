-- Step 1: Fix incorrect pricing in existing packages only
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

-- Update Big Sky Urban Lodge accommodation-only 15-day from 225 to 220
UPDATE availability_packages 
SET current_price_usd = 220, base_price_usd = 220
WHERE hotel_id = 'a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100'
  AND duration_days = 15 
  AND meal_plan = 'accommodationOnly' 
  AND occupancy_mode = 'double'
  AND current_price_usd = 225;

-- Fix Big Sky Urban Lodge half-board 15-day from 450 to 440
UPDATE availability_packages 
SET current_price_usd = 440, base_price_usd = 440
WHERE hotel_id = 'a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100'
  AND duration_days = 15 
  AND meal_plan = 'halfBoard' 
  AND occupancy_mode = 'double'
  AND current_price_usd = 450;