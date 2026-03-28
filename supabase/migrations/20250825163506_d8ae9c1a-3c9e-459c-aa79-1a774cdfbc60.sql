-- Replace all repeated hotel images with the 5 new unique images

-- Riverside Inn Boise - Modern lobby
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/modern-lobby-new.jpg'
WHERE name ILIKE '%riverside%boise%' OR name ILIKE '%riverside inn%';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/modern-lobby-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%riverside%boise%' OR name ILIKE '%riverside inn%') AND is_main = true;

-- Desert Springs Hotel - Pool exterior
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/pool-exterior-new.jpg'
WHERE name ILIKE '%desert springs%';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/pool-exterior-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%desert springs%') AND is_main = true;

-- Riverside Park Hotel - Courtyard night
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/courtyard-night-new.jpg'
WHERE name ILIKE '%riverside park%';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/courtyard-night-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%riverside park%') AND is_main = true;

-- Fairfield Inn & Suites Burlington - Room interior
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/room-interior-new.jpg'
WHERE name ILIKE '%fairfield%burlington%';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/room-interior-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%fairfield%burlington%') AND is_main = true;

-- Bluegrass Inn - Brick hotel exterior
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/brick-hotel-exterior-new.jpg'
WHERE name ILIKE '%bluegrass%';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/brick-hotel-exterior-new.jpg'
WHERE hotel_id IN (SELECT id FROM hotels WHERE name ILIKE '%bluegrass%') AND is_main = true;

-- Update any remaining hotels that still have the repeated bedroom image
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/modern-lobby-new.jpg'
WHERE main_image_url IN (
  '/assets/hotel-images/unique-room-1.jpg',
  '/assets/hotel-images/unique-room-2.jpg', 
  '/assets/hotel-images/unique-room-3.jpg',
  '/assets/hotel-images/unique-exterior-1.jpg',
  '/assets/hotel-images/unique-lobby-1.jpg'
) AND main_image_url != '/assets/hotel-images/modern-lobby-new.jpg'
  AND main_image_url != '/assets/hotel-images/pool-exterior-new.jpg'
  AND main_image_url != '/assets/hotel-images/courtyard-night-new.jpg'
  AND main_image_url != '/assets/hotel-images/room-interior-new.jpg'
  AND main_image_url != '/assets/hotel-images/brick-hotel-exterior-new.jpg';

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/modern-lobby-new.jpg'
WHERE image_url IN (
  '/assets/hotel-images/unique-room-1.jpg',
  '/assets/hotel-images/unique-room-2.jpg', 
  '/assets/hotel-images/unique-room-3.jpg',
  '/assets/hotel-images/unique-exterior-1.jpg',
  '/assets/hotel-images/unique-lobby-1.jpg'
) AND is_main = true
  AND image_url != '/assets/hotel-images/modern-lobby-new.jpg'
  AND image_url != '/assets/hotel-images/pool-exterior-new.jpg'
  AND image_url != '/assets/hotel-images/courtyard-night-new.jpg'
  AND image_url != '/assets/hotel-images/room-interior-new.jpg'
  AND image_url != '/assets/hotel-images/brick-hotel-exterior-new.jpg';