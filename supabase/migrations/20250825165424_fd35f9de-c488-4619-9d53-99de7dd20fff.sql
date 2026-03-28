-- Fix hotels with repeated or placeholder images by assigning unique images
-- Update hotels that have placeholder or repeated images with new unique images

-- Update desert/oasis hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/desert-oasis-hotel-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%desert%' OR name ILIKE '%oasis%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update mountain/lodge hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/mountain-lodge-lobby-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%mountain%' OR name ILIKE '%lodge%' OR name ILIKE '%alpine%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update beach/ocean hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/beachfront-hotel-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%beach%' OR name ILIKE '%ocean%' OR name ILIKE '%coastal%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update historic hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/historic-hotel-lobby-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%historic%' OR name ILIKE '%heritage%' OR name ILIKE '%classic%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update urban hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/urban-hotel-lobby-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%urban%' OR name ILIKE '%city%' OR name ILIKE '%metro%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update spa hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/spa-resort-lobby-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%spa%' OR name ILIKE '%wellness%' OR name ILIKE '%zen%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update ski hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/ski-lodge-lobby-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%ski%' OR name ILIKE '%snow%' OR name ILIKE '%winter%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update lake hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/lakeside-resort-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%lake%' OR name ILIKE '%river%' OR name ILIKE '%water%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update garden hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/garden-hotel-lobby-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%garden%' OR name ILIKE '%green%' OR name ILIKE '%eco%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update country/inn hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/countryside-inn-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%country%' OR name ILIKE '%rural%' OR name ILIKE '%inn%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update boutique hotels
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/boutique-hotel-exterior-1.jpg'
WHERE status = 'approved'
  AND (name ILIKE '%boutique%' OR name ILIKE '%design%')
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update remaining hotels with placeholder images to luxury lobby
UPDATE hotels 
SET main_image_url = '/assets/hotel-images/luxury-hotel-lobby-1.jpg'
WHERE status = 'approved'
  AND (
    main_image_url IS NULL 
    OR main_image_url = '' 
    OR main_image_url LIKE '%placeholder%'
    OR main_image_url LIKE '%bedroom%'
    OR main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update corresponding hotel_images records
UPDATE hotel_images 
SET image_url = '/assets/hotel-images/desert-oasis-hotel-1.jpg'
WHERE is_main = true 
  AND hotel_id IN (SELECT id FROM hotels WHERE status = 'approved' AND (name ILIKE '%desert%' OR name ILIKE '%oasis%'))
  AND (
    image_url LIKE '%placeholder%' 
    OR image_url LIKE '%bedroom%'
    OR image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Continue with other hotel_images updates...
UPDATE hotel_images 
SET image_url = '/assets/hotel-images/mountain-lodge-lobby-1.jpg'
WHERE is_main = true 
  AND hotel_id IN (SELECT id FROM hotels WHERE status = 'approved' AND (name ILIKE '%mountain%' OR name ILIKE '%lodge%' OR name ILIKE '%alpine%'))
  AND (
    image_url LIKE '%placeholder%' 
    OR image_url LIKE '%bedroom%'
    OR image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

UPDATE hotel_images 
SET image_url = '/assets/hotel-images/beachfront-hotel-1.jpg'
WHERE is_main = true 
  AND hotel_id IN (SELECT id FROM hotels WHERE status = 'approved' AND (name ILIKE '%beach%' OR name ILIKE '%ocean%' OR name ILIKE '%coastal%'))
  AND (
    image_url LIKE '%placeholder%' 
    OR image_url LIKE '%bedroom%'
    OR image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );

-- Update all remaining hotel_images with placeholder to luxury lobby
UPDATE hotel_images 
SET image_url = '/assets/hotel-images/luxury-hotel-lobby-1.jpg'
WHERE is_main = true 
  AND (
    image_url LIKE '%placeholder%' 
    OR image_url LIKE '%bedroom%'
    OR image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );