-- Create comprehensive demo hotel for testing all filter functionality
INSERT INTO public.hotels (
  id,
  name,
  description,
  country,
  city,
  address,
  price_per_month,
  property_type,
  style,
  category,
  status,
  owner_id,
  meal_plans,
  features_hotel,
  features_room,
  available_months,
  stay_lengths,
  check_in_weekday,
  latitude,
  longitude,
  main_image_url,
  created_at,
  updated_at
) VALUES (
  'demo-filter-test-hotel-001',
  'Demo Filter Test Hotel',
  'Comprehensive test hotel with all filter options for testing meal plans, hotel features, and room features across all languages.',
  'Spain',
  'Barcelona',
  'Passeig de Gràcia 123, Barcelona',
  2500,
  'Hotel',
  'Modern',
  4,
  'approved',
  (SELECT id FROM admin_users LIMIT 1),
  ARRAY['Breakfast included', 'Half board', 'Full board', 'Laundry services', 'All inclusive'],
  '["WiFi", "Parking", "Pool", "Gym", "Restaurant", "Bar", "Spa", "Pet friendly", "24/7 Reception", "Room service", "Concierge", "Laundry service", "Business center", "Conference rooms", "Airport shuttle", "Bicycle rental", "Car rental", "Tours organization", "Currency exchange", "ATM", "Safe deposit box", "Luggage storage", "Dry cleaning"]'::jsonb,
  '["Air conditioning", "Private bathroom", "Balcony", "Sea view", "City view", "Mountain view", "Garden view", "Kitchen", "Kitchenette", "Refrigerator", "Microwave", "Coffee machine", "Dishwasher", "Washing machine", "Dryer", "Iron", "Hair dryer", "Safe", "Desk", "Sofa", "Dining table", "Wardrobe"]'::jsonb,
  ARRAY['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ARRAY[7, 14, 30, 60, 90],
  'Monday',
  41.3874,
  2.1686,
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
  NOW(),
  NOW()
);

-- Insert some themes for the demo hotel
INSERT INTO public.hotel_themes (hotel_id, theme_id)
SELECT 
  'demo-filter-test-hotel-001',
  id
FROM public.themes 
WHERE level = 1 
LIMIT 3;

-- Insert some activities for the demo hotel
INSERT INTO public.hotel_activities (hotel_id, activity_id)
SELECT 
  'demo-filter-test-hotel-001',
  id
FROM public.activities 
LIMIT 5;

-- Insert a main image
INSERT INTO public.hotel_images (hotel_id, image_url, is_main)
VALUES (
  'demo-filter-test-hotel-001',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
  true
);

-- Insert some availability for the demo hotel
INSERT INTO public.hotel_availability (hotel_id, availability_date, availability_month, availability_year, is_full_month, preferred_weekday)
VALUES 
  ('demo-filter-test-hotel-001', '2025-01-01', 'January', 2025, true, 'Monday'),
  ('demo-filter-test-hotel-001', '2025-02-01', 'February', 2025, true, 'Monday'),
  ('demo-filter-test-hotel-001', '2025-03-01', 'March', 2025, true, 'Monday');