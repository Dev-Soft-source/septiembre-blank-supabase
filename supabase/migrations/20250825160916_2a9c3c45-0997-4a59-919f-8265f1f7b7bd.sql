-- Update all 6 hotels with completely new unique images

-- Fairfield Inn & Suites Burlington
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/fairfield-burlington-new.jpg'
WHERE id = '83bc1f38-d469-461e-a267-7114a4fc17fb';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/fairfield-burlington-new.jpg'
WHERE hotel_id = '83bc1f38-d469-461e-a267-7114a4fc17fb' AND is_main = true;

-- South Austin Lodge  
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/south-austin-new.jpg'
WHERE id = '984d2175-8f38-439f-af06-052ef8d3f24a';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/south-austin-new.jpg'
WHERE hotel_id = '984d2175-8f38-439f-af06-052ef8d3f24a' AND is_main = true;

-- Hampton Inn Anchorage
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/hampton-anchorage-new.jpg'
WHERE id = '6d0e0269-07ed-4599-9c47-ca7496338890';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/hampton-anchorage-new.jpg'
WHERE hotel_id = '6d0e0269-07ed-4599-9c47-ca7496338890' AND is_main = true;

-- Bluegrass Inn
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/bluegrass-inn-new.jpg'
WHERE id = '4c444701-8318-4d7a-adb7-c2bf719f9388';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/bluegrass-inn-new.jpg'
WHERE hotel_id = '4c444701-8318-4d7a-adb7-c2bf719f9388' AND is_main = true;

-- Gulf Coast Heritage Inn
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/gulf-coast-heritage-new.jpg'
WHERE id = '5996b848-134a-452b-ae43-4de1cb08e2bd';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/gulf-coast-heritage-new.jpg'
WHERE hotel_id = '5996b848-134a-452b-ae43-4de1cb08e2bd' AND is_main = true;

-- Foothills View Hotel
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/foothills-view-new.jpg'
WHERE id = 'cf897d81-bd6f-4a75-afdf-b65a35a384de';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/foothills-view-new.jpg'
WHERE hotel_id = 'cf897d81-bd6f-4a75-afdf-b65a35a384de' AND is_main = true;