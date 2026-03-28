-- Hotel Living Data Export
-- Generated on: 2025-01-06
-- Tables: hotels, hotel_images, hotel_affinities, hotel_activities, availability_packages
-- 
-- ⚠️ IMPORTANT: This export contains ONLY the existing data from the current project.
-- Related tables (hotel_images, hotel_affinities, hotel_activities, availability_packages) are EMPTY in the source database.

-- =============================================================================
-- HOTELS TABLE DATA (26 records found)
-- =============================================================================

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM availability_packages;
-- DELETE FROM hotel_activities; 
-- DELETE FROM hotel_affinities;
-- DELETE FROM hotel_images;
-- DELETE FROM hotels;

-- Insert Hotels Data
INSERT INTO hotels (
    id, 
    profile_id, 
    name, 
    description, 
    address, 
    city, 
    zip_code, 
    country_id, 
    latitude, 
    longitude, 
    stars, 
    price_per_month, 
    main_image_url, 
    contact_email, 
    contact_phone, 
    website_url, 
    check_in_weekday, 
    property_type_id, 
    amenities, 
    house_rules, 
    accessibility_features, 
    parking_available, 
    pet_friendly, 
    is_commissionable, 
    status, 
    referred_by, 
    cancellation_policy, 
    created_at, 
    updated_at
) VALUES 

-- Mountain View Lodge (Missoula)
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', NULL, 'Mountain View Lodge', 'A mountain lodge in Missoula with spectacular views', '123 Mountain Road', 'Missoula', '59801', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'info@mountainview.com', '+1-406-555-0123', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Garden District Hotel (Shreveport)
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', NULL, 'Garden District Hotel', 'An elegant hotel in Shreveport''s historic Garden District, offering Southern charm and modern amenities.', '423 Market Street', 'Shreveport', '71101', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'info@gardendistrict.com', '+1-318-555-0142', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Coastal Breeze Inn (Wilmington)
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', NULL, 'Coastal Breeze Inn', 'A charming coastal retreat in Wilmington offering stunning views and peaceful accommodations.', '234 Harbor Street', 'Wilmington', '28401', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'info@coastalbreeze.com', '+1-910-555-0145', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Pine Forest Retreat (Augusta)
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', NULL, 'Pine Forest Retreat', 'A peaceful retreat surrounded by pine forests, perfect for nature lovers seeking tranquility.', '892 Forest Trail Road', 'Augusta', '04330', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'reservations@pineforestretreat.com', '+1-207-555-0167', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Big Sky Urban Lodge (Billings)
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', NULL, 'Big Sky Urban Lodge', 'A modern urban lodge in Billings with stunning views of the Montana sky and easy access to city attractions.', '567 North Broadway', 'Billings', '59101', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 823, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'stay@bigskyurban.com', '+1-406-555-0198', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Capitol View Inn (Madison)
('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', NULL, 'Capitol View Inn', 'A charming inn with views of the Wisconsin State Capitol, located in the heart of Madison.', '789 State Street', 'Madison', '53703', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 617, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'info@capitolviewinn.com', '+1-608-555-0156', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- The Pearl District Inn (Portland)
('17b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', NULL, 'The Pearl District Inn', 'A boutique hotel in Portland''s trendy Pearl District, featuring modern amenities and easy access to the city''s renowned food scene.', '425 NW Park Avenue', 'Portland', '97209', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 630, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'info@pearldistrict.com', '+1-503-555-0198', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Tropical Winds Resort (Key West)
('28c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', NULL, 'Tropical Winds Resort', 'A tropical paradise resort in Key West offering luxury accommodations with ocean views and island charm.', '234 Duval Street', 'Key West', '33040', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 893, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'reservations@tropicalwinds.com', '+1-305-555-0189', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Wasatch Mountain View Hotel (Salt Lake City)
('39d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', NULL, 'Wasatch Mountain View Hotel', 'A luxury hotel with breathtaking views of the Wasatch Mountains, perfect for outdoor enthusiasts.', '456 South Temple Street', 'Salt Lake City', '84111', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 893, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'info@wasatchview.com', '+1-801-555-0173', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- South Austin Lodge (Austin)
('4ae1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', NULL, 'South Austin Lodge', 'A modern hotel in Austin''s vibrant South Austin area, close to South by Southwest venues and the city''s famous live music scene.', '1847 South Lamar Boulevard', 'Austin', '78704', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 893, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'stay@southaustinlodge.com', '+1-512-555-0247', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Blue Ridge Mountain Lodge (Asheville)
('5bf2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', NULL, 'Blue Ridge Mountain Lodge', 'A rustic mountain lodge nestled in the Blue Ridge Mountains, offering authentic Appalachian hospitality.', '678 Tunnel Road', 'Asheville', '28805', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 893, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'stay@blueridgelodge.com', '+1-828-555-0164', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Gulf Coast Heritage Inn (Mobile)
('6ca3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', NULL, 'Gulf Coast Heritage Inn', 'A historic inn celebrating Mobile''s rich Gulf Coast heritage with antebellum architecture and Southern hospitality.', '321 Government Street', 'Mobile', '36602', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 893, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'reservations@gulfcoastheritage.com', '+1-251-555-0187', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Riverside Park Hotel (Spokane)
('7db4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', NULL, 'Riverside Park Hotel', 'A modern hotel overlooking the Spokane River, featuring contemporary amenities and scenic park views.', '789 West Spokane Falls Boulevard', 'Spokane', '99201', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 630, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'info@riversidepark.com', '+1-509-555-0143', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Hampton Inn Providence Downtown (Providence)
('8ec5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', NULL, 'Hampton Inn Providence Downtown', 'A comfortable downtown hotel in Providence''s historic district, walking distance to major attractions.', '101 West Exchange Street', 'Providence', '02903', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 617, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'stay@hamptonprovidence.com', '+1-401-555-0156', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Historic District Lodge (Savannah)
('9fd6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', NULL, 'Historic District Lodge', 'A beautifully restored 19th-century building in Savannah''s Historic District, offering Southern charm and easy access to the city''s famous squares.', '123 Bull Street', 'Savannah', '31401', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 893, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 'info@historicsavannah.com', '+1-912-555-0174', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Prairie Wind Hotel (Grand Forks)
('b1f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', NULL, 'Prairie Wind Hotel', 'A contemporary hotel on the Great Plains, offering Midwestern hospitality and modern comfort.', '567 North Washington Street', 'Grand Forks', '58201', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'reservations@prairiewind.com', '+1-701-555-0172', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Green Mountain Inn (Burlington)
('c2a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', NULL, 'Green Mountain Inn', 'A charming inn nestled between Burlington''s downtown and the scenic Lake Champlain, offering a perfect blend of urban amenities and natural beauty.', '345 Battery Street', 'Burlington', '05401', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 630, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'reservations@greenmountaininn.com', '+1-802-555-0156', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Foothills View Hotel (Boise)
('d3b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d', NULL, 'Foothills View Hotel', 'A modern hotel with panoramic views of the Boise Foothills, perfect for outdoor adventurers.', '890 West Idaho Street', 'Boise', '83702', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 617, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'info@foothillsview.com', '+1-208-555-0185', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Adobe Hills Inn (Santa Fe)
('e4c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e', NULL, 'Adobe Hills Inn', 'A southwestern-style inn featuring traditional adobe architecture and authentic New Mexican charm.', '432 Old Santa Fe Trail', 'Santa Fe', '87501', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 893, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'stay@adobehills.com', '+1-505-555-0168', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Desert Oasis Hotel (Sedona)
('f5d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', NULL, 'Desert Oasis Hotel', 'A modern desert retreat offering spectacular views of red rock formations and starlit skies.', '2250 West Highway 89A', 'Sedona', '86336', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 583, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'reservations@desertoasishotel.com', '+1-928-555-0143', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Steel City Lodge (Pittsburgh)
('a6e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a', NULL, 'Steel City Lodge', 'A industrial-chic lodge celebrating Pittsburgh''s steel heritage with modern amenities and city views.', '654 Liberty Avenue', 'Pittsburgh', '15222', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'reservations@steelcitylodge.com', '+1-412-555-0159', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- High Desert Inn (Albuquerque)
('b7f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', NULL, 'High Desert Inn', 'A contemporary inn in the high desert of New Mexico, offering Southwestern hospitality and stunning sunsets.', '876 Central Avenue NE', 'Albuquerque', '87106', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'info@highdesertinn.com', '+1-505-555-0194', NULL, 'Sunday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00'),

-- Silicon Valley Suites (Fremont)
('c8a5b6c7-d8e9-0f1a-2b3c-4d5e6f7a8b9c', NULL, 'Silicon Valley Suites', 'Modern extended-stay suites in the heart of Silicon Valley, perfect for tech professionals and entrepreneurs.', '123 Innovation Drive', 'Fremont', '94538', '13c879cf-76ec-4956-a4fd-ea8b1053aa56', NULL, NULL, NULL, 1235, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'stay@siliconvalleysuites.com', '+1-510-555-0171', NULL, 'Monday', NULL, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, false, false, true, 'approved', NULL, NULL, '2025-09-05 23:41:39.650402+00', '2025-09-05 23:41:39.650402+00');

-- =============================================================================
-- RELATED TABLES (ALL EMPTY IN SOURCE DATABASE)
-- =============================================================================

-- Hotel Images: NO DATA FOUND
-- The hotel_images table is empty in the source database

-- Hotel Affinities: NO DATA FOUND  
-- The hotel_affinities table is empty in the source database

-- Hotel Activities: NO DATA FOUND
-- The hotel_activities table is empty in the source database

-- Availability Packages: NO DATA FOUND
-- The availability_packages table is empty in the source database

-- =============================================================================
-- EXPORT SUMMARY
-- =============================================================================
-- ✅ Hotels: 26 records exported
-- ❌ Hotel Images: 0 records (table empty)
-- ❌ Hotel Affinities: 0 records (table empty)
-- ❌ Hotel Activities: 0 records (table empty)  
-- ❌ Availability Packages: 0 records (table empty)
--
-- TOTAL EXPORTED: 26 records from hotels table only
-- 
-- NOTE: The empty related tables explain why hotel detail pages show "Error loading hotel"
-- These tables need to be populated with appropriate data after import.
-- =============================================================================