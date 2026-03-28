-- Add availability packages for the hotel that's failing to load
INSERT INTO public.availability_packages (
  hotel_id,
  start_date,
  end_date,
  duration,
  rooms,
  base_price,
  base_price_usd,
  total_rooms
) VALUES
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-09-01', '2025-09-30', 30, 8, 2800, 2800, 8),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-10-01', '2025-10-31', 31, 6, 3000, 3000, 6),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-11-01', '2025-11-30', 30, 4, 2600, 2600, 4) 
ON CONFLICT (id) DO NOTHING;