-- Add availability packages with proper duration calculation
INSERT INTO public.availability_packages (
  hotel_id,
  start_date,
  duration,
  rooms,
  base_price,
  base_price_usd,
  total_rooms
) VALUES
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-09-07', 30, 8, 2800, 2800, 8),  -- Sunday Sep 7, 30 days
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-10-05', 30, 6, 3000, 3000, 6),  -- Sunday Oct 5, 30 days  
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-11-02', 30, 4, 2600, 2600, 4)   -- Sunday Nov 2, 30 days
ON CONFLICT (id) DO NOTHING;