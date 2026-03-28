-- Fix repeated hotel images by replacing local paths with unique Unsplash URLs
-- Update main hotel images
UPDATE hotels 
SET main_image_url = CASE 
  WHEN LOWER(name) LIKE '%luxury%' OR LOWER(name) LIKE '%palace%' OR LOWER(name) LIKE '%royal%' THEN 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%mountain%' OR LOWER(name) LIKE '%alpine%' OR LOWER(name) LIKE '%peak%' THEN 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%beach%' OR LOWER(name) LIKE '%ocean%' OR LOWER(name) LIKE '%coast%' THEN 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%city%' OR LOWER(name) LIKE '%urban%' OR LOWER(name) LIKE '%downtown%' THEN 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%garden%' OR LOWER(name) LIKE '%park%' OR LOWER(name) LIKE '%green%' THEN 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%desert%' OR LOWER(name) LIKE '%sand%' OR LOWER(name) LIKE '%oasis%' THEN 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%historic%' OR LOWER(name) LIKE '%heritage%' OR LOWER(name) LIKE '%classic%' THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%modern%' OR LOWER(name) LIKE '%contemporary%' OR LOWER(name) LIKE '%design%' THEN 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%boutique%' OR LOWER(name) LIKE '%charm%' OR LOWER(name) LIKE '%cozy%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
  WHEN LOWER(name) LIKE '%spa%' OR LOWER(name) LIKE '%wellness%' OR LOWER(name) LIKE '%resort%' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
  ELSE CONCAT('https://images.unsplash.com/photo-156607394445', (id::text)[-1], '?w=800&h=600&fit=crop')
END
WHERE main_image_url LIKE '/assets/hotel-images/%' OR main_image_url = '';

-- Update hotel_images table
UPDATE hotel_images 
SET image_url = CASE 
  WHEN hotel_id IN (SELECT id FROM hotels WHERE LOWER(name) LIKE '%luxury%' OR LOWER(name) LIKE '%palace%') THEN 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
  WHEN hotel_id IN (SELECT id FROM hotels WHERE LOWER(name) LIKE '%mountain%' OR LOWER(name) LIKE '%alpine%') THEN 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
  WHEN hotel_id IN (SELECT id FROM hotels WHERE LOWER(name) LIKE '%beach%' OR LOWER(name) LIKE '%ocean%') THEN 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  WHEN hotel_id IN (SELECT id FROM hotels WHERE LOWER(name) LIKE '%city%' OR LOWER(name) LIKE '%urban%') THEN 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop'
  WHEN hotel_id IN (SELECT id FROM hotels WHERE LOWER(name) LIKE '%garden%' OR LOWER(name) LIKE '%park%') THEN 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
  ELSE CONCAT('https://images.unsplash.com/photo-1571019613454', (hotel_id::text)[-1], '?w=800&h=600&fit=crop')
END
WHERE image_url LIKE '/assets/hotel-images/%' OR image_url = '';

-- Also update any remaining empty or problematic images with unique fallbacks
UPDATE hotels 
SET main_image_url = CONCAT('https://images.unsplash.com/photo-15719', (EXTRACT(MICROSECONDS FROM created_at)::text)[-3:], '?w=800&h=600&fit=crop')
WHERE main_image_url IS NULL OR main_image_url = '' OR main_image_url LIKE '%placeholder%';