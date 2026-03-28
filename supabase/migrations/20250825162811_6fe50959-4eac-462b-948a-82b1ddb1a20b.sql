-- Update 5 hotels with completely new unique images to replace repeated ones

-- Foothills View Hotel - Modern luxury room
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/unique-room-1.jpg'
WHERE id = 'cf897d81-bd6f-4a75-afdf-b65a35a384de';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/unique-room-1.jpg'
WHERE hotel_id = 'cf897d81-bd6f-4a75-afdf-b65a35a384de' AND is_main = true;

-- Hampton Inn Anchorage - Boutique hotel exterior
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/unique-exterior-1.jpg'
WHERE id = '6d0e0269-07ed-4599-9c47-ca7496338890';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/unique-exterior-1.jpg'
WHERE hotel_id = '6d0e0269-07ed-4599-9c47-ca7496338890' AND is_main = true;

-- Bluegrass Inn - Beachfront resort room
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/unique-room-2.jpg'
WHERE id = '4c444701-8318-4d7a-adb7-c2bf719f9388';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/unique-room-2.jpg'
WHERE hotel_id = '4c444701-8318-4d7a-adb7-c2bf719f9388' AND is_main = true;

-- Find and update Desert Springs Hotel and Riverside Inn Boise
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/unique-lobby-1.jpg'
WHERE name ILIKE '%desert springs%' OR name ILIKE '%riverside%';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/unique-lobby-1.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%desert springs%' OR name ILIKE '%riverside%') AND is_main = true;

-- Update any remaining hotel with repeated images to use the mountain lodge room
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/unique-room-3.jpg'
WHERE main_image_url IN (
  '/assets/hotel-images/fairfield-burlington-new.jpg',
  '/assets/hotel-images/south-austin-new.jpg', 
  '/assets/hotel-images/foothills-view-new.jpg',
  '/assets/hotel-images/bluegrass-inn-new.jpg',
  '/assets/hotel-images/gulf-coast-heritage-new.jpg',
  '/assets/hotel-images/hampton-anchorage-new.jpg'
) AND id NOT IN (
  'cf897d81-bd6f-4a75-afdf-b65a35a384de',
  '6d0e0269-07ed-4599-9c47-ca7496338890', 
  '4c444701-8318-4d7a-adb7-c2bf719f9388'
);

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/unique-room-3.jpg'
WHERE hotel_id IN (
  SELECT id FROM hotels WHERE main_image_url = '/assets/hotel-images/unique-room-3.jpg'
) AND is_main = true;