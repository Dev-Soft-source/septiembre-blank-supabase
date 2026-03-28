-- Fix image paths and ensure database records are correct

-- First, fix the incorrect paths from the previous migration
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/desert-springs-lobby-new.jpg'
WHERE name ILIKE '%desert springs%' OR name ILIKE '%desert oasis%';

UPDATE hotels 
SET main_image_url = '/assets/hotel-images/bluegrass-lobby-new.jpg'
WHERE name ILIKE '%bluegrass%' OR name ILIKE '%green mountain%';

-- Fix existing hotel_images records if they exist
UPDATE hotel_images 
SET image_url = '/assets/hotel-images/desert-springs-lobby-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%desert springs%' OR name ILIKE '%desert oasis%') 
AND is_main = true;

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/bluegrass-lobby-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%bluegrass%' OR name ILIKE '%green mountain%') 
AND is_main = true;

-- Insert missing hotel_images records if they don't exist
INSERT INTO hotel_images (hotel_id, image_url, is_main)
SELECT h.id, '/assets/hotel-images/desert-springs-lobby-new.jpg', true
FROM hotels h
WHERE (h.name ILIKE '%desert springs%' OR h.name ILIKE '%desert oasis%')
AND NOT EXISTS (
    SELECT 1 FROM hotel_images hi 
    WHERE hi.hotel_id = h.id AND hi.is_main = true
);

INSERT INTO hotel_images (hotel_id, image_url, is_main)
SELECT h.id, '/assets/hotel-images/bluegrass-lobby-new.jpg', true
FROM hotels h
WHERE (h.name ILIKE '%bluegrass%' OR h.name ILIKE '%green mountain%')
AND NOT EXISTS (
    SELECT 1 FROM hotel_images hi 
    WHERE hi.hotel_id = h.id AND hi.is_main = true
);