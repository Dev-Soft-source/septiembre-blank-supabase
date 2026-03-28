-- Fix coordinates for The Historic hotel to match New York address
-- Coordinates for 8102 Main Street, New York, NY area (approximate coordinates for NYC)
UPDATE hotels 
SET 
  latitude = 40.7128,
  longitude = -74.0060
WHERE name = 'The Historic' 
  AND city = 'New York, NY' 
  AND address = '8102 Main Street';