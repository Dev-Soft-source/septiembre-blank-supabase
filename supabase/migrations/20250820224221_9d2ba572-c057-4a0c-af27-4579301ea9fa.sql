-- FIX PRICING: Use EXACT Sacred Policy prices from the user's table
-- Current 4-star hotels have WRONG prices ($425/$800) - must be $340/$640!

UPDATE availability_packages 
SET 
  base_price_usd = CASE 
    WHEN duration_days = 8 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 340  -- NOT 425!
    WHEN duration_days = 15 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 640  -- NOT 800!
    ELSE base_price_usd  -- Keep 3-star prices unchanged
  END,
  current_price_usd = CASE 
    WHEN duration_days = 8 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 340
    WHEN duration_days = 15 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 640
    ELSE current_price_usd
  END;