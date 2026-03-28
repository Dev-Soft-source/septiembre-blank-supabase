-- Delete all fake/sample hotels and their related data
-- First, delete related data for fake hotels
DELETE FROM hotel_images WHERE hotel_id IN (
  SELECT id FROM hotels WHERE name LIKE 'Hotel Español %' 
  OR name LIKE 'Hôtel France %' 
  OR name LIKE 'Hotel Portugal %' 
  OR name LIKE 'Hotel Italia %' 
  OR name LIKE 'Hotel Deutschland %' 
  OR name LIKE 'Hotel Britain %'
);

DELETE FROM hotel_activities WHERE hotel_id IN (
  SELECT id FROM hotels WHERE name LIKE 'Hotel Español %' 
  OR name LIKE 'Hôtel France %' 
  OR name LIKE 'Hotel Portugal %' 
  OR name LIKE 'Hotel Italia %' 
  OR name LIKE 'Hotel Deutschland %' 
  OR name LIKE 'Hotel Britain %'
);

DELETE FROM hotel_affinities WHERE hotel_id IN (
  SELECT id FROM hotels WHERE name LIKE 'Hotel Español %' 
  OR name LIKE 'Hôtel France %' 
  OR name LIKE 'Hotel Portugal %' 
  OR name LIKE 'Hotel Italia %' 
  OR name LIKE 'Hotel Deutschland %' 
  OR name LIKE 'Hotel Britain %'
);

DELETE FROM availability_packages WHERE hotel_id IN (
  SELECT id FROM hotels WHERE name LIKE 'Hotel Español %' 
  OR name LIKE 'Hôtel France %' 
  OR name LIKE 'Hotel Portugal %' 
  OR name LIKE 'Hotel Italia %' 
  OR name LIKE 'Hotel Deutschland %' 
  OR name LIKE 'Hotel Britain %'
);

-- Finally, delete the fake hotels themselves
DELETE FROM hotels WHERE name LIKE 'Hotel Español %' 
OR name LIKE 'Hôtel France %' 
OR name LIKE 'Hotel Portugal %' 
OR name LIKE 'Hotel Italia %' 
OR name LIKE 'Hotel Deutschland %' 
OR name LIKE 'Hotel Britain %';