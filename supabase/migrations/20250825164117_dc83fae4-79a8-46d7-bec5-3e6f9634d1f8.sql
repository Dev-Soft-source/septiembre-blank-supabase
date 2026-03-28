-- Replace Desert Springs Hotel and Bluegrass Inn images with new lobby images

-- Desert Springs Hotel - New lobby image
UPDATE hotels 
SET main_image_url = '/src/assets/hotel-images/desert-springs-lobby-new.jpg'
WHERE name ILIKE '%desert springs%';

UPDATE hotel_images 
SET image_url = '/src/assets/hotel-images/desert-springs-lobby-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%desert springs%') AND is_main = true;

-- Bluegrass Inn - New lobby image  
UPDATE hotels 
SET main_image_url = '/src/assets/hotel-images/bluegrass-lobby-new.jpg'
WHERE name ILIKE '%bluegrass%';

UPDATE hotel_images 
SET image_url = '/src/assets/hotel-images/bluegrass-lobby-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%bluegrass%') AND is_main = true;