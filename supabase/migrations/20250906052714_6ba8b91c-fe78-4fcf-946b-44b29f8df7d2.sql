-- Add the specific hotel the user is trying to view
INSERT INTO public.hotels (
  id, 
  name, 
  description, 
  city, 
  address, 
  contact_email, 
  contact_phone, 
  status,
  price_per_month,
  main_image_url
) VALUES (
  '10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a',
  'Sunset Paradise Resort',
  'A beautiful beachfront resort with stunning sunset views and world-class amenities.',
  'Miami Beach',
  '123 Ocean Drive, Miami Beach, FL',
  'info@sunsetparadise.com',
  '+1-305-555-0123',
  'approved',
  2800,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
);

-- Add images for this hotel
INSERT INTO public.hotel_images (hotel_id, image_url, image_type, is_main, display_order, alt_text_en) VALUES
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'exterior', true, 1, 'Sunset Paradise Resort beachfront exterior'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'room', false, 2, 'Luxury ocean view suite'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'beach', false, 3, 'Private beach area'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'pool', false, 4, 'Infinity pool with ocean view'),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'restaurant', false, 5, 'Beachside restaurant');

-- Add availability packages for this hotel
INSERT INTO public.availability_packages (
  hotel_id,
  start_date,
  end_date,
  duration,
  rooms,
  base_price,
  base_price_usd
) VALUES
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-10-01', '2025-10-31', 30, 5, 2800, 2800),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-11-01', '2025-11-30', 30, 3, 2600, 2600),
('10e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', '2025-12-01', '2025-12-31', 31, 4, 3200, 3200);