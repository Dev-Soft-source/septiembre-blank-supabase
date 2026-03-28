-- Populate hotel_images for existing hotels
INSERT INTO hotel_images (hotel_id, image_url, is_main, created_at) VALUES
-- Mountain View Lodge images
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', true, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', false, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', false, now()),

-- Garden District Hotel images
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', true, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', false, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', false, now()),

-- Coastal Breeze Inn images
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', true, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', false, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', false, now()),

-- Pine Forest Retreat images
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', true, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', false, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', false, now()),

-- Big Sky Urban Lodge images
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', true, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', false, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', false, now());

-- Add availability packages for all hotels
INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, created_at) VALUES
-- Mountain View Lodge packages
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-01', 30, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-02-01', 30, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-03-01', 30, 5, 1235, now()),

-- Garden District Hotel packages
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-01', 30, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-02-01', 30, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-03-01', 30, 4, 1235, now()),

-- Coastal Breeze Inn packages
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-01', 30, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-02-01', 30, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-03-01', 30, 6, 1235, now()),

-- Pine Forest Retreat packages
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-01', 30, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-02-01', 30, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-03-01', 30, 3, 1235, now()),

-- Big Sky Urban Lodge packages
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-01', 30, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-02-01', 30, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-03-01', 30, 4, 823, now());

-- Populate hotel activities (using existing activity IDs)
INSERT INTO hotel_activities (hotel_id, activity_id) 
SELECT h.id, a.id FROM hotels h
CROSS JOIN (
  SELECT id FROM activities WHERE name_en IN ('Hiking', 'Swimming', 'Spa Services', 'Fine Dining', 'City Tours') LIMIT 5
) a
WHERE h.id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b'
);

-- Update hotel data with missing fields
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