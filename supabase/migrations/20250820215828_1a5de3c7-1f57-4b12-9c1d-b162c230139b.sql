-- Insert missing accommodation-only and half-board packages for Big Sky Urban Lodge
-- Using different date ranges to avoid overlap validation
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
-- 8-day accommodation-only package (different dates)
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-04-01', '2030-04-08', 8, 1, 1, 'double', 'accommodationOnly', 120, 120),

-- 15-day accommodation-only package (different dates)
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-04-15', '2030-04-29', 15, 1, 1, 'double', 'accommodationOnly', 225, 225),

-- 8-day half-board package (different dates)
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-05-01', '2030-05-08', 8, 1, 1, 'double', 'halfBoard', 240, 240),

-- 15-day half-board package (different dates)
('a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100', '2030-05-15', '2030-05-29', 15, 1, 1, 'double', 'halfBoard', 450, 450)

ON CONFLICT DO NOTHING;