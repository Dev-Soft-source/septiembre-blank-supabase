-- Execute hotel data import directly with sample data
-- Insert hotels data
INSERT INTO hotels (id, name, description, address, city, country_id, stars, price_per_month, main_image_url, latitude, longitude, created_at, updated_at, status, check_in_weekday, contact_email, contact_phone, website_url, amenities, house_rules, accessibility_features, parking_available, pet_friendly, is_commissionable, cancellation_policy, zip_code) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'Grand Hotel Bucharest', 'Luxurious hotel in the heart of Bucharest with modern amenities and traditional Romanian hospitality.', 'Calea Victoriei 63-81', 'Bucharest', (SELECT id FROM countries WHERE iso_code = 'RO' LIMIT 1), 5, 2500, 'https://example.com/hotels/grand-bucharest.jpg', 44.4268, 26.1025, now(), now(), 'approved', 'Monday', 'info@grandhotelbucharest.ro', '+40 21 315 8900', '["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar", "Gym"]', '["No smoking", "No pets", "Quiet hours 10 PM - 7 AM"]', '["Wheelchair accessible", "Elevator", "Accessible bathroom"]', true, false, true, 'Free cancellation up to 24 hours before check-in', '010141'),
('223e4567-e89b-12d3-a456-426614174001', 'Casa Braşovului Boutique', 'Charming boutique hotel in historic Braşov with views of Tampa Mountain.', 'Strada Republicii 12', 'Braşov', (SELECT id FROM countries WHERE iso_code = 'RO' LIMIT 1), 4, 1800, 'https://example.com/hotels/casa-brasov.jpg', 45.6427, 25.5887, now(), now(), 'approved', 'Monday', 'contact@casabrasov.ro', '+40 268 477 500', '["Wi-Fi", "Restaurant", "Bar", "Terrace", "City View"]', '["No smoking", "Quiet hours 10 PM - 8 AM"]', '["Elevator", "Accessible entrance"]', true, true, true, 'Free cancellation up to 48 hours before check-in', '500030')
ON CONFLICT (id) DO NOTHING;

-- Insert hotel images
INSERT INTO hotel_images (id, hotel_id, image_url, image_type, alt_text_en, alt_text_ro, alt_text_es, alt_text_pt, is_main, display_order, created_at) VALUES
('111e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'https://example.com/hotels/grand-bucharest-main.jpg', 'exterior', 'Grand Hotel Bucharest exterior view', 'Vedere exterioară Grand Hotel București', 'Vista exterior del Grand Hotel Bucarest', 'Vista exterior do Grand Hotel Bucareste', true, 1, now()),
('211e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'https://example.com/hotels/grand-bucharest-lobby.jpg', 'interior', 'Elegant lobby of Grand Hotel Bucharest', 'Lobby elegant al Grand Hotel București', 'Elegante lobby del Grand Hotel Bucarest', 'Elegante lobby do Grand Hotel Bucareste', false, 2, now()),
('311e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174001', 'https://example.com/hotels/casa-brasov-main.jpg', 'exterior', 'Casa Braşovului Boutique exterior', 'Exterior Casa Braşovului Boutique', 'Exterior Casa Braşovului Boutique', 'Exterior Casa Braşovului Boutique', true, 1, now())
ON CONFLICT (id) DO NOTHING;

-- Insert availability packages
INSERT INTO availability_packages (id, hotel_id, start_date, duration, rooms, base_price, base_price_usd, price_increase_pct, round_step, dynamic_increment, created_at, updated_at) VALUES
('444e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '2025-01-06', 30, 10, 2500.00, 500, 20, 5, 20.00, now(), now()),
('544e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '2025-02-03', 30, 8, 2500.00, 500, 20, 5, 20.00, now(), now()),
('644e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174001', '2025-01-06', 30, 5, 1800.00, 360, 20, 5, 20.00, now(), now())
ON CONFLICT (id) DO NOTHING;