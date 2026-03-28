-- Read and execute SQL files directly from storage
-- This executes all INSERT statements from the stored SQL files

-- First, create a function to execute raw SQL (temporary for data import)
CREATE OR REPLACE FUNCTION public.execute_sql_from_text(sql_text text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql_text;
END;
$$;

-- Now execute the SQL content for hotels
SELECT public.execute_sql_from_text($hotels$
INSERT INTO hotels (id, name, description, address, city, country_id, stars, price_per_month, main_image_url, latitude, longitude, profile_id, created_at, updated_at, status, check_in_weekday, contact_email, contact_phone, website_url, amenities, house_rules, accessibility_features, parking_available, pet_friendly, is_commissionable, cancellation_policy, property_type_id, zip_code, referred_by) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'Grand Hotel Bucharest', 'Luxurious hotel in the heart of Bucharest with modern amenities and traditional Romanian hospitality.', 'Calea Victoriei 63-81', 'Bucharest', (SELECT id FROM countries WHERE iso_code = 'RO'), 5, 2500, 'https://example.com/hotels/grand-bucharest.jpg', 44.4268, 26.1025, NULL, now(), now(), 'approved', 'Monday', 'info@grandhotelbucharest.ro', '+40 21 315 8900', 'https://grandhotelbucharest.ro', '["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar", "Gym"]', '["No smoking", "No pets", "Quiet hours 10 PM - 7 AM"]', '["Wheelchair accessible", "Elevator", "Accessible bathroom"]', true, false, true, 'Free cancellation up to 24 hours before check-in', (SELECT id FROM property_types WHERE name_en = 'Hotel'), '010141', NULL),
('223e4567-e89b-12d3-a456-426614174001', 'Casa Braşovului Boutique', 'Charming boutique hotel in historic Braşov with views of Tampa Mountain.', 'Strada Republicii 12', 'Braşov', (SELECT id FROM countries WHERE iso_code = 'RO'), 4, 1800, 'https://example.com/hotels/casa-brasov.jpg', 45.6427, 25.5887, NULL, now(), now(), 'approved', 'Monday', 'contact@casabrasov.ro', '+40 268 477 500', 'https://casabrasov.ro', '["Wi-Fi", "Restaurant", "Bar", "Terrace", "City View"]', '["No smoking", "Quiet hours 10 PM - 8 AM"]', '["Elevator", "Accessible entrance"]', true, true, true, 'Free cancellation up to 48 hours before check-in', (SELECT id FROM property_types WHERE name_en = 'Boutique Hotel'), '500030', NULL);
$hotels$);

-- Execute SQL content for hotel images  
SELECT public.execute_sql_from_text($images$
INSERT INTO hotel_images (id, hotel_id, image_url, image_type, alt_text_en, alt_text_ro, alt_text_es, alt_text_pt, is_main, display_order, created_at) VALUES
('111e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'https://example.com/hotels/grand-bucharest-main.jpg', 'exterior', 'Grand Hotel Bucharest exterior view', 'Vedere exterioară Grand Hotel București', 'Vista exterior del Grand Hotel Bucarest', 'Vista exterior do Grand Hotel Bucareste', true, 1, now()),
('211e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'https://example.com/hotels/grand-bucharest-lobby.jpg', 'interior', 'Elegant lobby of Grand Hotel Bucharest', 'Lobby elegant al Grand Hotel București', 'Elegante lobby del Grand Hotel Bucarest', 'Elegante lobby do Grand Hotel Bucareste', false, 2, now()),
('311e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174001', 'https://example.com/hotels/casa-brasov-main.jpg', 'exterior', 'Casa Braşovului Boutique exterior', 'Exterior Casa Braşovului Boutique', 'Exterior Casa Braşovului Boutique', 'Exterior Casa Braşovului Boutique', true, 1, now());
$images$);

-- Execute SQL content for hotel themes
SELECT public.execute_sql_from_text($themes$
INSERT INTO hotel_themes (id, hotel_id, theme_id) VALUES
('aaa11111-1111-1111-1111-111111111111', '123e4567-e89b-12d3-a456-426614174000', (SELECT id FROM themes WHERE name = 'CULTURE' AND level = 1)),
('bbb22222-2222-2222-2222-222222222222', '123e4567-e89b-12d3-a456-426614174000', (SELECT id FROM themes WHERE name = 'ART' AND level = 1)),
('ccc33333-3333-3333-3333-333333333333', '223e4567-e89b-12d3-a456-426614174001', (SELECT id FROM themes WHERE name = 'CULTURE' AND level = 1));
$themes$);

-- Execute SQL content for hotel activities  
SELECT public.execute_sql_from_text($activities$
INSERT INTO hotel_activities (id, hotel_id, activity_id) VALUES
('ddd44444-4444-4444-4444-444444444444', '123e4567-e89b-12d3-a456-426614174000', (SELECT id FROM activities WHERE name_en = 'Museums')),
('eee55555-5555-5555-5555-555555555555', '123e4567-e89b-12d3-a456-426614174000', (SELECT id FROM activities WHERE name_en = 'History')),
('fff66666-6666-6666-6666-666666666666', '223e4567-e89b-12d3-a456-426614174001', (SELECT id FROM activities WHERE name_en = 'History'));
$activities$);

-- Execute SQL content for availability packages
SELECT public.execute_sql_from_text($packages$
INSERT INTO availability_packages (id, hotel_id, start_date, duration, rooms, base_price, base_price_usd, price_increase_pct, round_step, dynamic_increment, created_at, updated_at) VALUES
('444e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '2025-01-06', 30, 10, 2500.00, 500, 20, 5, 20.00, now(), now()),
('544e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '2025-02-03', 30, 8, 2500.00, 500, 20, 5, 20.00, now(), now()),
('644e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174001', '2025-01-06', 30, 5, 1800.00, 360, 20, 5, 20.00, now(), now());
$packages$);

-- Clean up the temporary function
DROP FUNCTION public.execute_sql_from_text(text);