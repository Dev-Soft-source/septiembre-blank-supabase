-- Add simple availability packages that should pass constraints
INSERT INTO public.availability_packages (
  hotel_id,
  start_date,
  duration,
  rooms,
  base_price
) VALUES
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-09-07', 7, 5, 850),   -- 1 week package
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-09-14', 14, 3, 1600), -- 2 week package
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-09-28', 28, 2, 2800)  -- 4 week package
ON CONFLICT (id) DO NOTHING;