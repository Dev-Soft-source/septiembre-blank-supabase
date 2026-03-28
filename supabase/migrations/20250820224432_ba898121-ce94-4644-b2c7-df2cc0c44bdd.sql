-- SIMPLE FIX: Update 4-star hotel packages to use EXACT Sacred Policy prices
-- 4-star hotels currently have WRONG prices ($425/$800) - must be $340/$640!

UPDATE availability_packages 
SET 
  base_price_usd = 340,
  current_price_usd = 340
WHERE 
  duration_days = 8 
  AND (SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id) >= 4;

UPDATE availability_packages 
SET 
  base_price_usd = 640,
  current_price_usd = 640
WHERE 
  duration_days = 15 
  AND (SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id) >= 4;