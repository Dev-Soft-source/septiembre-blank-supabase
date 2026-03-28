
-- First, let's clean up the duplicate hotels
-- We'll keep only one instance of each hotel (the first one created)
WITH duplicates AS (
  SELECT 
    id,
    name,
    city,
    country,
    ROW_NUMBER() OVER (
      PARTITION BY name, city, country, address 
      ORDER BY created_at ASC
    ) as rn
  FROM hotels
  WHERE name LIKE '%Welcome Pilot%' OR description LIKE '%Welcome Pilot%'
)
DELETE FROM hotels 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Also clean up related data for deleted hotels
DELETE FROM hotel_images 
WHERE hotel_id NOT IN (SELECT id FROM hotels);

DELETE FROM hotel_themes 
WHERE hotel_id NOT IN (SELECT id FROM hotels);

DELETE FROM hotel_activities 
WHERE hotel_id NOT IN (SELECT id FROM hotels);

-- Update any hotels that might have incorrect status
UPDATE hotels 
SET status = 'approved' 
WHERE (name LIKE '%Welcome Pilot%' OR description LIKE '%Welcome Pilot%') 
AND status != 'approved';
