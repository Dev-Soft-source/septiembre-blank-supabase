-- Find hotel IDs for the hotels that need image updates
-- First let's see what hotels we need to update
SELECT id, name, city, country 
FROM hotels 
WHERE name ILIKE '%bluegrass%' 
   OR name ILIKE '%gulf coast heritage%' 
   OR name ILIKE '%foothills view%' 
   OR name ILIKE '%desert springs%';

-- Update the hotels with completely new unique images
-- Fairfield Inn & Suites Burlington
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/fairfield-burlington-lobby.jpg'
WHERE id = '83bc1f38-d469-461e-a267-7114a4fc17fb';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/fairfield-burlington-lobby.jpg'
WHERE hotel_id = '83bc1f38-d469-461e-a267-7114a4fc17fb' AND is_main = true;

-- South Austin Lodge  
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/south-austin-suite.jpg'
WHERE id = '984d2175-8f38-439f-af06-052ef8d3f24a';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/south-austin-suite.jpg'
WHERE hotel_id = '984d2175-8f38-439f-af06-052ef8d3f24a' AND is_main = true;

-- Hampton Inn Anchorage
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/hampton-inn-traditional.jpg'
WHERE id = '6d0e0269-07ed-4599-9c47-ca7496338890';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/hampton-inn-traditional.jpg'  
WHERE hotel_id = '6d0e0269-07ed-4599-9c47-ca7496338890' AND is_main = true;

-- Update remaining hotels by name matching
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/bluegrass-inn-room.jpg'
WHERE name ILIKE '%bluegrass%';

UPDATE hotels 
SET main_image_url = '/assets/hotel-images/gulf-coast-heritage-lobby.jpg'
WHERE name ILIKE '%gulf coast heritage%';

UPDATE hotels 
SET main_image_url = '/assets/hotel-images/foothills-view-room.jpg'
WHERE name ILIKE '%foothills view%';

UPDATE hotels 
SET main_image_url = '/assets/hotel-images/desert-springs-lobby.jpg'
WHERE name ILIKE '%desert springs%';

-- Update corresponding hotel_images entries
UPDATE hotel_images 
SET image_url = '/assets/hotel-images/bluegrass-inn-room.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%bluegrass%') AND is_main = true;

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/gulf-coast-heritage-lobby.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%gulf coast heritage%') AND is_main = true;

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/foothills-view-room.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%foothills view%') AND is_main = true;

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/desert-springs-lobby.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%desert springs%') AND is_main = true;