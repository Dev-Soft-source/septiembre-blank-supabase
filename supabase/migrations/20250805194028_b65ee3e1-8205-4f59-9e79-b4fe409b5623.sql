-- Get hotel IDs and add images and availability packages
WITH hotel_data AS (
  SELECT id, name FROM hotels ORDER BY created_at LIMIT 5
)
-- Insert hotel images for each hotel
INSERT INTO hotel_images (hotel_id, image_url, is_main)
SELECT 
  h.id,
  CASE 
    WHEN h.name = 'Coastal Breeze Inn' THEN 
      CASE WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
           WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 2 THEN 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
           ELSE 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9' END
    WHEN h.name = 'Mountain View Lodge' THEN 
      CASE WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000'
           WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 2 THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
           ELSE 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e' END
    WHEN h.name = 'Historic Charleston Inn' THEN 
      CASE WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
           WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 2 THEN 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'
           ELSE 'https://images.unsplash.com/photo-1578662996442-48f60103fc96' END
    WHEN h.name = 'Desert Oasis Hotel' THEN 
      CASE WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
           WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 2 THEN 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f'
           ELSE 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e' END
    ELSE 
      CASE WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
           WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 2 THEN 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'
           ELSE 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000' END
  END,
  row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 as is_main
FROM hotel_data h
CROSS JOIN generate_series(1, 3) as gs;

-- Insert availability packages
INSERT INTO availability_packages (hotel_id, start_date, end_date, duration_days, total_rooms, available_rooms)
SELECT 
  h.id,
  CASE 
    WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN '2024-03-01'::date
    ELSE '2024-04-15'::date
  END,
  CASE 
    WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN '2024-03-08'::date
    ELSE '2024-04-29'::date
  END,
  CASE 
    WHEN row_number() OVER (PARTITION BY h.id ORDER BY h.id) = 1 THEN 8
    ELSE 15
  END,
  12 + (ABS(hashtext(h.name::text)) % 20), -- Random total rooms between 12-32
  3 + (ABS(hashtext(h.name::text)) % 3) -- Random available rooms between 3-5
FROM hotel_data h
CROSS JOIN generate_series(1, 2) as gs;