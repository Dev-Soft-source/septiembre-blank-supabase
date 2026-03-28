-- Use allowed duration values (1, 3, 6 months instead of days)
INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, created_at) VALUES
-- Mountain View Lodge packages
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-01', 1, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-04-01', 3, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-07-01', 6, 5, 1235, now()),

-- Garden District Hotel packages  
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-01', 1, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-04-01', 3, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-07-01', 6, 4, 1235, now()),

-- Coastal Breeze Inn packages
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-01', 1, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-04-01', 3, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-07-01', 6, 6, 1235, now()),

-- Pine Forest Retreat packages
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-01', 1, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-04-01', 3, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-07-01', 6, 3, 1235, now()),

-- Big Sky Urban Lodge packages
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-01', 1, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-04-01', 3, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-07-01', 6, 4, 823, now());

-- Verify insertion worked by counting records
SELECT COUNT(*) as availability_packages_count FROM availability_packages;
SELECT COUNT(*) as hotel_images_count FROM hotel_images;
SELECT COUNT(*) as hotel_activities_count FROM hotel_activities;