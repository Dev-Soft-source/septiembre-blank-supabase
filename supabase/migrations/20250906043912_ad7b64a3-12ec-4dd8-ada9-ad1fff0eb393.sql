-- Fix availability packages to respect hotel's chosen check-in weekday (Monday)
-- Delete existing packages that don't align with weekdays
DELETE FROM availability_packages WHERE hotel_id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b'
);

-- Insert packages with proper Monday dates (hotels' preferred check-in weekday)
INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, created_at) VALUES
-- Mountain View Lodge packages (Mondays)
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-01', 8, 5, 1235, now()),   -- Monday Jan 1
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-08', 15, 5, 1235, now()),  -- Monday Jan 8
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-15', 22, 5, 1235, now()),  -- Monday Jan 15
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-02-05', 8, 5, 1235, now()),   -- Monday Feb 5
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-03-04', 15, 5, 1235, now()),  -- Monday Mar 4

-- Garden District Hotel packages (Mondays)
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-01', 8, 4, 1235, now()),   -- Monday Jan 1
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-08', 15, 4, 1235, now()),  -- Monday Jan 8
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-22', 22, 4, 1235, now()),  -- Monday Jan 22
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-02-05', 8, 4, 1235, now()),   -- Monday Feb 5
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-03-04', 15, 4, 1235, now()),  -- Monday Mar 4

-- Coastal Breeze Inn packages (Mondays)
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-01', 8, 6, 1235, now()),   -- Monday Jan 1
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-08', 15, 6, 1235, now()),  -- Monday Jan 8
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-29', 22, 6, 1235, now()),  -- Monday Jan 29
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-02-05', 8, 6, 1235, now()),   -- Monday Feb 5
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-03-04', 15, 6, 1235, now()),  -- Monday Mar 4

-- Pine Forest Retreat packages (Mondays)
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-01', 8, 3, 1235, now()),   -- Monday Jan 1
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-08', 15, 3, 1235, now()),  -- Monday Jan 8
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-29', 22, 3, 1235, now()),  -- Monday Jan 29
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-02-12', 8, 3, 1235, now()),   -- Monday Feb 12
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-03-11', 15, 3, 1235, now()),  -- Monday Mar 11

-- Big Sky Urban Lodge packages (Mondays)
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-01', 8, 4, 823, now()),    -- Monday Jan 1
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-15', 15, 4, 823, now()),   -- Monday Jan 15
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-29', 22, 4, 823, now()),   -- Monday Jan 29
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-02-12', 8, 4, 823, now()),    -- Monday Feb 12
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-03-11', 15, 4, 823, now());   -- Monday Mar 11

-- Verify all packages now align with Monday (weekday 1)
SELECT 
  h.name,
  h.check_in_weekday,
  ap.start_date,
  EXTRACT(DOW FROM ap.start_date) as start_weekday, -- 1 = Monday
  ap.duration
FROM availability_packages ap
JOIN hotels h ON h.id = ap.hotel_id
WHERE h.id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b'
)
ORDER BY h.name, ap.start_date;