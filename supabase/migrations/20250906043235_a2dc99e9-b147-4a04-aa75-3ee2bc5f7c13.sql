-- Fix the availability packages insertion by using proper duration values
INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, created_at) VALUES
-- Mountain View Lodge packages (using 7, 14, 21 day durations)
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-01', 7, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-15', 14, 5, 1235, now()),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-02-01', 21, 5, 1235, now()),

-- Garden District Hotel packages
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-01', 7, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-01-15', 14, 4, 1235, now()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-02-01', 21, 4, 1235, now()),

-- Coastal Breeze Inn packages
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-01', 7, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-01-15', 14, 6, 1235, now()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-02-01', 21, 6, 1235, now()),

-- Pine Forest Retreat packages
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-01', 7, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-01-15', 14, 3, 1235, now()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-02-01', 21, 3, 1235, now()),

-- Big Sky Urban Lodge packages
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-01', 7, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-01-15', 14, 4, 823, now()),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-02-01', 21, 4, 823, now());

-- Add missing foreign key constraint for hotel_themes table
ALTER TABLE hotel_themes ADD CONSTRAINT fk_hotel_themes_hotel_id FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE;

-- Populate hotel activities with existing activities
INSERT INTO hotel_activities (hotel_id, activity_id) 
SELECT h.id, a.id FROM hotels h
CROSS JOIN (
  SELECT id FROM activities LIMIT 3
) a
WHERE h.id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b'
) 
ON CONFLICT DO NOTHING;