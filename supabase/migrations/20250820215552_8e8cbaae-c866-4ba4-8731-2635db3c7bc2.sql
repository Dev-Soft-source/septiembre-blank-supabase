-- Update Big Sky Urban Lodge to offer all three meal plan options
UPDATE hotels 
SET meals_offered = ARRAY['none', 'breakfast', 'half_board']
WHERE id = 'a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100';

-- Insert missing accommodation-only packages for Big Sky Urban Lodge (3-star pricing)
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
-- 8-day accommodation-only packages  
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-04-26', '2032-05-03', 8, 1, 1, 'double', 'accommodationOnly', 120, 120),
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-06-07', '2032-06-14', 8, 1, 1, 'double', 'accommodationOnly', 120, 120),

-- 15-day accommodation-only packages
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-05-17', '2032-05-31', 15, 1, 1, 'double', 'accommodationOnly', 225, 225),
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-06-28', '2032-07-12', 15, 1, 1, 'double', 'accommodationOnly', 225, 225),

-- 8-day half-board packages (3-star pricing: 80% of max = 80% of breakfast price)
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-04-26', '2032-05-03', 8, 1, 1, 'double', 'halfBoard', 240, 240),
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-06-07', '2032-06-14', 8, 1, 1, 'double', 'halfBoard', 240, 240),

-- 15-day half-board packages  
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-05-17', '2032-05-31', 15, 1, 1, 'double', 'halfBoard', 450, 450),
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2032-06-28', '2032-07-12', 15, 1, 1, 'double', 'halfBoard', 450, 450)

ON CONFLICT DO NOTHING;