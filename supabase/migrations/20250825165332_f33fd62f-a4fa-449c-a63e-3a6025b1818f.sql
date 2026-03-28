-- Fix hotels with repeated or placeholder images by assigning unique images
-- Update hotels that have placeholder or repeated images with new unique images

-- Create a temporary table to map hotels to new images
WITH hotel_image_mapping AS (
  SELECT 
    h.id as hotel_id,
    h.name,
    CASE 
      WHEN h.name ILIKE '%desert%' OR h.name ILIKE '%oasis%' THEN '/assets/hotel-images/desert-oasis-hotel-1.jpg'
      WHEN h.name ILIKE '%mountain%' OR h.name ILIKE '%lodge%' OR h.name ILIKE '%alpine%' THEN '/assets/hotel-images/mountain-lodge-lobby-1.jpg'
      WHEN h.name ILIKE '%beach%' OR h.name ILIKE '%ocean%' OR h.name ILIKE '%coastal%' THEN '/assets/hotel-images/beachfront-hotel-1.jpg'
      WHEN h.name ILIKE '%historic%' OR h.name ILIKE '%heritage%' OR h.name ILIKE '%classic%' THEN '/assets/hotel-images/historic-hotel-lobby-1.jpg'
      WHEN h.name ILIKE '%urban%' OR h.name ILIKE '%city%' OR h.name ILIKE '%metro%' THEN '/assets/hotel-images/urban-hotel-lobby-1.jpg'
      WHEN h.name ILIKE '%spa%' OR h.name ILIKE '%wellness%' OR h.name ILIKE '%zen%' THEN '/assets/hotel-images/spa-resort-lobby-1.jpg'
      WHEN h.name ILIKE '%ski%' OR h.name ILIKE '%snow%' OR h.name ILIKE '%winter%' THEN '/assets/hotel-images/ski-lodge-lobby-1.jpg'
      WHEN h.name ILIKE '%lake%' OR h.name ILIKE '%river%' OR h.name ILIKE '%water%' THEN '/assets/hotel-images/lakeside-resort-1.jpg'
      WHEN h.name ILIKE '%garden%' OR h.name ILIKE '%green%' OR h.name ILIKE '%eco%' THEN '/assets/hotel-images/garden-hotel-lobby-1.jpg'
      WHEN h.name ILIKE '%country%' OR h.name ILIKE '%rural%' OR h.name ILIKE '%inn%' THEN '/assets/hotel-images/countryside-inn-1.jpg'
      WHEN h.name ILIKE '%boutique%' OR h.name ILIKE '%design%' THEN '/assets/hotel-images/boutique-hotel-exterior-1.jpg'
      ELSE '/assets/hotel-images/luxury-hotel-lobby-1.jpg'
    END as new_image_url,
    ROW_NUMBER() OVER (ORDER BY h.created_at) as row_num
  FROM hotels h
  WHERE h.status = 'approved'
    AND (
      h.main_image_url IS NULL 
      OR h.main_image_url = '' 
      OR h.main_image_url LIKE '%placeholder%'
      OR h.main_image_url LIKE '%bedroom%'
      OR h.main_image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
    )
)
-- Update the main_image_url in hotels table
UPDATE hotels 
SET main_image_url = him.new_image_url
FROM hotel_image_mapping him
WHERE hotels.id = him.hotel_id;

-- Insert or update hotel_images records to match
INSERT INTO hotel_images (hotel_id, image_url, is_main, created_at)
SELECT 
  him.hotel_id,
  him.new_image_url,
  true,
  now()
FROM hotel_image_mapping him
ON CONFLICT (hotel_id, image_url) DO UPDATE SET
  is_main = true,
  created_at = now();

-- Also update any existing main hotel_images that might have the placeholder
UPDATE hotel_images 
SET image_url = CASE 
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%desert%') THEN '/assets/hotel-images/desert-oasis-hotel-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%mountain%') THEN '/assets/hotel-images/mountain-lodge-lobby-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%beach%') THEN '/assets/hotel-images/beachfront-hotel-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%historic%') THEN '/assets/hotel-images/historic-hotel-lobby-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%urban%') THEN '/assets/hotel-images/urban-hotel-lobby-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%spa%') THEN '/assets/hotel-images/spa-resort-lobby-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%ski%') THEN '/assets/hotel-images/ski-lodge-lobby-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%lake%') THEN '/assets/hotel-images/lakeside-resort-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%garden%') THEN '/assets/hotel-images/garden-hotel-lobby-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%country%') THEN '/assets/hotel-images/countryside-inn-1.jpg'
  WHEN EXISTS (SELECT 1 FROM hotels h WHERE h.id = hotel_images.hotel_id AND h.name ILIKE '%boutique%') THEN '/assets/hotel-images/boutique-hotel-exterior-1.jpg'
  ELSE '/assets/hotel-images/luxury-hotel-lobby-1.jpg'
END
WHERE is_main = true 
  AND (
    image_url LIKE '%placeholder%' 
    OR image_url LIKE '%bedroom%'
    OR image_url LIKE 'https://images.unsplash.com/photo-1586105251261-72a756497a11%'
  );