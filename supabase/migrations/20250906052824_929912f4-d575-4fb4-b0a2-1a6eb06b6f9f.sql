-- Add images for the existing hotel the user is trying to view
INSERT INTO public.hotel_images (hotel_id, image_url, image_type, is_main, display_order, alt_text_en) VALUES
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'exterior', true, 1, 'Hilton Virginia Beach Oceanfront exterior view'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'room', false, 2, 'Luxury oceanfront hotel room'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'beach', false, 3, 'Virginia Beach oceanfront'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'pool', false, 4, 'Hotel pool with ocean view'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'lobby', false, 5, 'Elegant hotel lobby');

-- Add some themes for this hotel
INSERT INTO public.hotel_themes (hotel_id, theme_id) 
SELECT '10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', t.id 
FROM themes t 
WHERE t.name IN ('HEALTH AND WELLNESS', 'SPORTS', 'CULTURE')
LIMIT 3;

-- Add hotel activities for this hotel
INSERT INTO public.hotel_activities (hotel_id, activity_id, created_at) 
SELECT '10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', a.id, now()
FROM activities a 
WHERE a.name_en IN ('Spa & Massage', 'Beach & Volleyball', 'Fitness')
LIMIT 3;