-- Add sample hotel images for existing hotels
INSERT INTO public.hotel_images (hotel_id, image_url, image_type, is_main, display_order, alt_text_en) VALUES
-- Mountain View Lodge images
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'exterior', true, 1, 'Mountain View Lodge exterior with mountain backdrop'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'room', false, 2, 'Cozy mountain lodge room interior'),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'common_area', false, 3, 'Lodge common area with fireplace'),

-- Garden District Hotel images
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'exterior', true, 1, 'Garden District Hotel elegant facade'),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'room', false, 2, 'Luxurious hotel room with garden view'),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'lobby', false, 3, 'Elegant hotel lobby'),

-- Coastal Breeze Inn images
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'exterior', true, 1, 'Coastal inn with ocean view'),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1631049035175-7d6cc0e4ba52?w=800', 'room', false, 2, 'Bright coastal room with sea breeze'),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'terrace', false, 3, 'Ocean view terrace'),

-- Pine Forest Retreat images
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'exterior', true, 1, 'Pine forest retreat cabin'),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'room', false, 2, 'Rustic forest room interior'),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'nature', false, 3, 'Forest surroundings'),

-- Big Sky Urban Lodge images
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 'exterior', true, 1, 'Modern urban lodge exterior'),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', 'room', false, 2, 'Contemporary urban room'),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=800', 'rooftop', false, 3, 'Urban rooftop view');

-- Add hotel themes for sample hotels
INSERT INTO public.hotel_themes (hotel_id, theme_id) 
SELECT h.id, t.id 
FROM hotels h 
CROSS JOIN themes t 
WHERE h.id IN (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
) AND t.name IN ('CULTURE', 'ART', 'HEALTH AND WELLNESS')
LIMIT 9;