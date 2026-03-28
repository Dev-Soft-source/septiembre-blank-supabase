-- Comprehensive pricing correction for ALL demo hotels
-- This migration fixes unrealistic pricing across all hotel ownership categories

-- Function to generate corrected rates structure for any hotel
CREATE OR REPLACE FUNCTION generate_corrected_rates_structure(hotel_category INTEGER)
RETURNS JSONB AS $$
DECLARE
  rates JSONB := '{}';
  duration INTEGER;
  service_factor DECIMAL;
  max_double_price INTEGER;
  max_single_price INTEGER;
  corrected_double_price INTEGER;
  corrected_single_price INTEGER;
BEGIN
  -- Generate random service factor between 0.5-0.9 for variety
  service_factor := 0.5 + (random() * 0.4);
  
  -- Process each duration (8, 15, 22, 29 days)
  FOR duration IN SELECT unnest(ARRAY[8, 15, 22, 29]) LOOP
    -- Set maximum reference prices based on category and duration (USD)
    IF hotel_category = 3 THEN
      CASE duration
        WHEN 8 THEN 
          max_double_price := 1300;
          max_single_price := 1000;
        WHEN 15 THEN 
          max_double_price := 1600;
          max_single_price := 1200;
        WHEN 22 THEN 
          max_double_price := 1800;
          max_single_price := 1400;
        WHEN 29 THEN 
          max_double_price := 2000;
          max_single_price := 1500;
      END CASE;
    ELSE -- 4-star hotel
      CASE duration
        WHEN 8 THEN 
          max_double_price := 1500;
          max_single_price := 1200;
        WHEN 15 THEN 
          max_double_price := 2000;
          max_single_price := 1500;
        WHEN 22 THEN 
          max_double_price := 2500;
          max_single_price := 1900;
        WHEN 29 THEN 
          max_double_price := 3000;
          max_single_price := 2200;
      END CASE;
    END IF;
    
    -- Calculate corrected pricing within 50%-90% of maximum reference tariffs
    corrected_double_price := ROUND(max_double_price * service_factor);
    corrected_single_price := ROUND(max_single_price * service_factor);
    
    -- Store as per-person rates (double room price / 2, single room is full price)
    rates := rates || jsonb_build_object(
      duration || '-double', ROUND(corrected_double_price / 2),
      duration || '-single', corrected_single_price
    );
  END LOOP;
  
  RETURN rates;
END;
$$ LANGUAGE plpgsql;

-- Update ALL approved hotels with corrected pricing structure
-- This includes hotels with null owner_id, admin owners, and other owners
UPDATE public.hotels 
SET 
  rates = generate_corrected_rates_structure(COALESCE(category, 3)),
  price_per_month = (
    SELECT ROUND(((generate_corrected_rates_structure(COALESCE(category, 3))->>'29-double')::INTEGER))
  ),
  updated_at = now()
WHERE status = 'approved'
AND (
  -- Hotels with unrealistic pricing (below minimum thresholds)
  price_per_month < CASE WHEN category = 4 THEN 750 ELSE 500 END
  OR 
  -- Hotels with no rates structure
  rates IS NULL
  OR
  -- Hotels with extremely high pricing (above realistic maximums) 
  price_per_month > CASE WHEN category = 4 THEN 1800 ELSE 1200 END
);

-- Ensure consistent category assignment where missing
UPDATE public.hotels 
SET category = 3
WHERE category IS NULL AND status = 'approved';

-- Clean up the temporary function
DROP FUNCTION generate_corrected_rates_structure(INTEGER);

-- Log the comprehensive update
INSERT INTO public.admin_logs (admin_id, action, details)
VALUES (
  COALESCE((SELECT id FROM public.admin_users LIMIT 1)::TEXT, 'system'),
  'comprehensive_pricing_correction',
  jsonb_build_object(
    'description', 'Applied corrected USD pricing structure to ALL demo hotels',
    'scope', 'All approved hotels with unrealistic or missing pricing',
    'pricing_range', '50%-90% of maximum reference tariffs',
    'currency', 'USD',
    'min_29day_3star', '$500 per person',
    'min_29day_4star', '$750 per person',
    'timestamp', now()
  )
);