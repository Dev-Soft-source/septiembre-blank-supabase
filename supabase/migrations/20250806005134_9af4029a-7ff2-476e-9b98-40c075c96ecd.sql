-- Update existing demo hotels with corrected USD pricing structure
-- This migration fixes unrealistic EUR-based pricing and applies the new USD maximum reference pricing

-- Function to generate corrected rates structure for existing hotels
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

-- Update all demo hotels created by admin users with corrected pricing
UPDATE public.hotels 
SET 
  rates = generate_corrected_rates_structure(category),
  price_per_month = CASE 
    WHEN category = 4 THEN 
      ROUND((750 + (random() * 750))::INTEGER) -- 4-star: $750-$1500 per person/month
    ELSE 
      ROUND((500 + (random() * 500))::INTEGER) -- 3-star: $500-$1000 per person/month
  END,
  updated_at = now()
WHERE owner_id IN (
  SELECT id FROM public.admin_users
) 
AND status = 'approved'
AND rates IS NOT NULL;

-- Clean up the temporary function
DROP FUNCTION generate_corrected_rates_structure(INTEGER);

-- Log the update for audit purposes
INSERT INTO public.admin_logs (admin_id, action, details)
VALUES (
  (SELECT id FROM public.admin_users LIMIT 1)::TEXT,
  'batch_pricing_correction',
  jsonb_build_object(
    'description', 'Applied corrected USD pricing structure to existing demo hotels',
    'pricing_range', '50%-90% of maximum reference tariffs',
    'currency', 'USD',
    'timestamp', now()
  )
);