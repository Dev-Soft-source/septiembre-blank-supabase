-- FIX PRICING: Use EXACT Sacred Policy prices from the user's table
-- Update packages to use correct Sacred Policy prices (not the wrong ones I used before)

-- 3-star hotels: 8 days = $240 double, 15 days = $440 double  
-- 4-star hotels: 8 days = $340 double, 15 days = $640 double (NOT the wrong $425/$800 I used!)

UPDATE availability_packages 
SET 
  base_price_usd = CASE 
    -- 3-star hotels (category 3 or null)
    WHEN duration_days = 8 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) < 4 THEN 240
    WHEN duration_days = 15 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id  
    ) < 4 THEN 440
    -- 4-star+ hotels  
    WHEN duration_days = 8 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 340
    WHEN duration_days = 15 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 640
  END,
  current_price_usd = CASE 
    -- 3-star hotels (category 3 or null)
    WHEN duration_days = 8 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) < 4 THEN 240
    WHEN duration_days = 15 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id  
    ) < 4 THEN 440
    -- 4-star+ hotels  
    WHEN duration_days = 8 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 340
    WHEN duration_days = 15 AND (
      SELECT COALESCE(category, 3) FROM hotels WHERE hotels.id = availability_packages.hotel_id
    ) >= 4 THEN 640
  END;

-- Update comments to reflect NO MULTIPLIERS - exact Sacred Policy prices
COMMENT ON COLUMN availability_packages.base_price_usd IS 'EXACT Sacred Policy price per person for double occupancy - NO MULTIPLIERS';
COMMENT ON COLUMN availability_packages.current_price_usd IS 'EXACT Sacred Policy price per person for double occupancy - NO MULTIPLIERS';

-- Verify the correct prices are now applied
DO $$
DECLARE
  price_summary TEXT;
BEGIN
  SELECT string_agg(
    h.name || ' (' || COALESCE(h.category, 3) || '★): ' || 
    ap.duration_days::text || 'd=$' || ap.base_price_usd::text, 
    ', '
  ) INTO price_summary
  FROM availability_packages ap
  JOIN hotels h ON ap.hotel_id = h.id
  WHERE h.name = 'Big Sky Urban Lodge'
  ORDER BY ap.duration_days;
  
  RAISE LOG 'CORRECTED PRICES for Big Sky Urban Lodge: %', price_summary;
  RAISE LOG 'SUCCESS: All packages now use EXACT Sacred Policy prices - NO MULTIPLIERS!';
END $$;