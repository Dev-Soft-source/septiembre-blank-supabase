-- Update main images for the 4 hotels with duplicated photos
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/hampton-inn-anchorage-unique.jpg'
WHERE id = '6d0e0269-07ed-4599-9c47-ca7496338890';

UPDATE hotels 
SET main_image_url = '/assets/hotel-images/fairfield-burlington-unique.jpg'
WHERE id = '83bc1f38-d469-461e-a267-7114a4fc17fb';

UPDATE hotels 
SET main_image_url = '/assets/hotel-images/south-austin-lodge-unique.jpg'
WHERE id = '984d2175-8f38-439f-af06-052ef8d3f24a';

UPDATE hotels 
SET main_image_url = '/assets/hotel-images/bluegrass-inn-unique.jpg'
WHERE id = '4c444701-8318-4d7a-adb7-c2bf719f9388';

-- Update hotel_images table with new main images for existing entries
UPDATE hotel_images 
SET image_url = '/assets/hotel-images/hampton-inn-anchorage-unique.jpg'
WHERE hotel_id = '6d0e0269-07ed-4599-9c47-ca7496338890' AND is_main = true;

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/fairfield-burlington-unique.jpg'
WHERE hotel_id = '83bc1f38-d469-461e-a267-7114a4fc17fb' AND is_main = true;

-- Add hotel_images entries for hotels that don't have main images yet
INSERT INTO hotel_images (hotel_id, image_url, is_main)
SELECT '984d2175-8f38-439f-af06-052ef8d3f24a', '/assets/hotel-images/south-austin-lodge-unique.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM hotel_images WHERE hotel_id = '984d2175-8f38-439f-af06-052ef8d3f24a' AND is_main = true);

INSERT INTO hotel_images (hotel_id, image_url, is_main)
SELECT '4c444701-8318-4d7a-adb7-c2bf719f9388', '/assets/hotel-images/bluegrass-inn-unique.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM hotel_images WHERE hotel_id = '4c444701-8318-4d7a-adb7-c2bf719f9388' AND is_main = true);