-- Update Big Sky Urban Lodge to offer all three meal plan options
UPDATE hotels 
SET meals_offered = ARRAY['none', 'breakfast', 'half_board']
WHERE id = 'a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100';

-- Insert missing accommodation-only and half-board packages with non-overlapping dates
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
) VALUES
-- 8-day accommodation-only package
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-02-18', '2030-02-25', 8, 1, 1, 'double', 'accommodationOnly', 120, 120),

-- 15-day accommodation-only package  
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-03-11', '2030-03-25', 15, 1, 1, 'double', 'accommodationOnly', 225, 225),

-- 8-day half-board package (3-star pricing: 240 EUR for 8 days)
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-02-18', '2030-02-25', 8, 1, 1, 'double', 'halfBoard', 240, 240),

-- 15-day half-board package (3-star pricing: 450 EUR for 15 days)
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-03-11', '2030-03-25', 15, 1, 1, 'double', 'halfBoard', 450, 450)

ON CONFLICT DO NOTHING;