-- Create comprehensive demo hotel for testing all filter functionality
INSERT INTO public.hotels (
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
) RETURNING id;

-- Get the inserted hotel ID and use it for related inserts
WITH demo_hotel AS (
  SELECT id FROM hotels WHERE name = 'Demo Filter Test Hotel' ORDER BY created_at DESC LIMIT 1
)
-- Insert some themes for the demo hotel
INSERT INTO public.hotel_themes (hotel_id, theme_id)
SELECT 
  demo_hotel.id,
  themes.id
FROM demo_hotel, public.themes 
WHERE themes.level = 1 
LIMIT 3;

-- Insert some activities for the demo hotel  
WITH demo_hotel AS (
  SELECT id FROM hotels WHERE name = 'Demo Filter Test Hotel' ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.hotel_activities (hotel_id, activity_id)
SELECT 
  demo_hotel.id,
  activities.id
FROM demo_hotel, public.activities 
LIMIT 5;

-- Insert a main image
WITH demo_hotel AS (
  SELECT id FROM hotels WHERE name = 'Demo Filter Test Hotel' ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.hotel_images (hotel_id, image_url, is_main)
SELECT 
  demo_hotel.id,
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
  true
FROM demo_hotel;

-- Insert some availability for the demo hotel
WITH demo_hotel AS (
  SELECT id FROM hotels WHERE name = 'Demo Filter Test Hotel' ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.hotel_availability (hotel_id, availability_date, availability_month, availability_year, is_full_month, preferred_weekday)
SELECT 
  demo_hotel.id,
  date_val,
  month_name,
  2025,
  true,
  'Monday'
FROM demo_hotel,
(VALUES 
  ('2025-01-01'::date, 'January'),
  ('2025-02-01'::date, 'February'),
  ('2025-03-01'::date, 'March')
) AS dates(date_val, month_name);