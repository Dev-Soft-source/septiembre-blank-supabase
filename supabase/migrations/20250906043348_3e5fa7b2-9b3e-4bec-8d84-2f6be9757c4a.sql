-- Use the correct duration values: 8, 15, 22, 29 days as required by check constraint
INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, created_at) VALUES
-- Mountain View Lodge packages
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-01', 8, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-02-01', 15, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-03-01', 22, 5, 1235, now()),

-- Garden District Hotel packages  
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-01', 8, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-02-01', 15, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-03-01', 22, 4, 1235, now()),

-- Coastal Breeze Inn packages
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-01', 8, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-02-01', 15, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-03-01', 22, 6, 1235, now()),

-- Pine Forest Retreat packages
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-01', 8, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-02-01', 15, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-03-01', 22, 3, 1235, now()),

-- Big Sky Urban Lodge packages
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-01', 8, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-02-01', 15, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-03-01', 22, 4, 823, now());

-- Add hotel activities (using existing activity IDs)
INSERT INTO hotel_activities (hotel_id, activity_id) 
SELECT h.id, a.id FROM hotels h
CROSS JOIN (SELECT id FROM activities LIMIT 3) a
WHERE h.id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b'
) ON CONFLICT DO NOTHING;

-- Update hotel metadata with missing fields
UPDATE hotels SET 
  stars = 4,
  latitude = CASE 
    WHEN city = 'Missoula' THEN 46.8721
    WHEN city = 'Shreveport' THEN 32.5252
    WHEN city = 'Wilmington' THEN 34.2257
    WHEN city = 'Augusta' THEN 44.3106
    WHEN city = 'Billings' THEN 45.7833
  END,
  longitude = CASE 
    WHEN city = 'Missoula' THEN -113.9940
    WHEN city = 'Shreveport' THEN -93.7502
    WHEN city = 'Wilmington' THEN -77.9447
    WHEN city = 'Augusta' THEN -69.7795
    WHEN city = 'Billings' THEN -108.5007
  END
WHERE id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b'
);

-- Verify data was inserted successfully
SELECT 
  (SELECT COUNT(*) FROM availability_packages) as packages_count,
  (SELECT COUNT(*) FROM hotel_images) as images_count,
  (SELECT COUNT(*) FROM hotel_activities) as activities_count,
  (SELECT COUNT(*) FROM hotels WHERE stars IS NOT NULL) as hotels_with_stars;