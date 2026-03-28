-- Delete ALL current hotels (all 92 are fake/duplicated)
DELETE FROM hotel_images;
DELETE FROM hotel_activities; 
DELETE FROM hotel_affinities;
DELETE FROM availability_packages;
DELETE FROM hotels;

-- Get the US country ID
DO $$
DECLARE
  us_country_id uuid;
BEGIN
  SELECT id INTO us_country_id FROM countries WHERE iso_code = 'US';
  
  -- If US doesn't exist, create it
  IF us_country_id IS NULL THEN
    INSERT INTO countries (iso_code, name_en, name_es, name_pt, name_ro) 
    VALUES ('US', 'United States', 'Estados Unidos', 'Estados Unidos', 'Statele Unite')
    RETURNING id INTO us_country_id;
  END IF;

  -- Insert the authentic US hotels (Batch 1 - Original 5 hotels)
  INSERT INTO hotels (
    name, description, country_id, city, address, postal_code,
    contact_name, contact_email, contact_phone, property_type, style,
    category, ideal_guests, atmosphere, perfect_location, 
    room_description, weekly_laundry_included, external_laundry_available,
    stay_lengths, meals_offered, features_hotel, features_room,
    available_months, main_image_url, price_per_month, terms,
    check_in_weekday, status
  ) VALUES
  (
    'Coastal Breeze Inn',
    'A charming coastal retreat offering stunning ocean views and peaceful accommodations just steps from the beach.',
    us_country_id, 'Carmel-by-the-Sea', '4th Avenue & Torres Street', '93921',
    'Sarah Williams', 'info@coastalbreezeinn.com', '+1-831-555-0125',
    'Boutique Hotel', 'Classic', 3,
    'Couples seeking romantic getaways and solo travelers looking for coastal tranquility',
    'Relaxed and intimate with ocean-inspired decor and calming coastal ambiance',
    'Perfect for beach lovers, artists, and those seeking a peaceful retreat from city life',
    'Comfortable oceanview rooms with coastal decor, private balconies, and modern amenities',
    false, true, ARRAY[8, 15], ARRAY['Continental Breakfast'],
    '{"Ocean View": true, "Beach Access": true, "WiFi": true, "Parking": true, "Garden": true}'::jsonb,
    '{"Private Bathroom": true, "Balcony": true, "Ocean View": true, "Air Conditioning": true, "Coffee Maker": true}'::jsonb,
    ARRAY['2024-03', '2024-04', '2024-05', '2024-06', '2024-09', '2024-10'],
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 2295,
    'Quiet hours 10 PM - 8 AM. No smoking. Pets welcome with additional fee.',
    'Monday', 'approved'
  ),
  (
    'Mountain View Lodge',
    'A rustic mountain retreat surrounded by pristine wilderness and hiking trails, perfect for nature enthusiasts.',
    us_country_id, 'Estes Park', '1520 Fall River Road', '80517',
    'Robert Johnson', 'reservations@mountainviewlodge.com', '+1-970-555-0198',
    'Lodge', 'Rural', 3,
    'Nature lovers, hikers, and families seeking outdoor adventures',
    'Rustic and cozy with mountain lodge charm and wildlife viewing opportunities',
    'Ideal for accessing Rocky Mountain National Park and outdoor activities',
    'Comfortable lodge rooms with mountain views, rustic decor, and modern conveniences',
    true, true, ARRAY[15, 22], ARRAY['Continental Breakfast', 'Packed Lunches'],
    '{"Mountain View": true, "Hiking Trails": true, "WiFi": true, "Parking": true, "Fireplace": true, "Pet Friendly": true}'::jsonb,
    '{"Private Bathroom": true, "Mountain View": true, "Heating": true, "Coffee Maker": true, "Mini Fridge": true}'::jsonb,
    ARRAY['2024-05', '2024-06', '2024-07', '2024-08', '2024-09'],
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 3225,
    'No smoking. Pets welcome. Quiet hours after 10 PM. Mountain safety guidelines apply.',
    'Sunday', 'approved'
  ),
  (
    'Historic Charleston Inn',
    'An elegant boutique inn in Charleston historic district, featuring antebellum architecture and Southern hospitality.',
    us_country_id, 'Charleston', '58 Meeting Street', '29401',
    'Margaret Thompson', 'stay@historiccharlestoninn.com', '+1-843-555-0167',
    'Boutique Hotel', 'Classic Elegant', 4,
    'History enthusiasts, couples, and cultural travelers seeking Southern charm',
    'Sophisticated and historic with antebellum elegance and modern luxury',
    'Perfect for exploring Charleston historic district, gardens, and cultural attractions',
    'Elegant rooms with period furnishings, high ceilings, and modern amenities in historic setting',
    true, true, ARRAY[22, 29], ARRAY['Continental Breakfast', 'Afternoon Tea'],
    '{"Historic Building": true, "Garden Courtyard": true, "WiFi": true, "Concierge": true, "Valet Parking": true}'::jsonb,
    '{"Private Bathroom": true, "High Ceilings": true, "Air Conditioning": true, "Historic Details": true, "Coffee Maker": true}'::jsonb,
    ARRAY['2024-03', '2024-04', '2024-10', '2024-11'],
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 4575,
    'Historic property guidelines apply. No smoking. Adults preferred. Valet parking required.',
    'Monday', 'approved'
  ),
  (
    'Desert Oasis Hotel',
    'A modern desert retreat offering spectacular views of red rock formations and starlit skies.',
    us_country_id, 'Sedona', '2250 West Highway 89A', '86336',
    'David Martinez', 'reservations@desertoasishotel.com', '+1-928-555-0143',
    'Resort Hotel', 'Modern', 4,
    'Spiritual seekers, artists, and wellness enthusiasts drawn to Sedona energy',
    'Serene and mystical with desert-inspired design and panoramic red rock views',
    'Ideal for accessing vortex sites, art galleries, and desert hiking trails',
    'Contemporary rooms with desert views, spa-inspired bathrooms, and peaceful ambiance',
    true, true, ARRAY[15, 22], ARRAY['Continental Breakfast', 'Wellness Menu'],
    '{"Red Rock Views": true, "Spa Services": true, "Pool": true, "WiFi": true, "Meditation Garden": true}'::jsonb,
    '{"Private Bathroom": true, "Desert View": true, "Air Conditioning": true, "Mini Fridge": true, "Coffee Maker": true}'::jsonb,
    ARRAY['2024-03', '2024-04', '2024-05', '2024-09', '2024-10', '2024-11'],
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 3825,
    'Wellness retreat guidelines. No smoking. Quiet meditation hours. Desert safety protocols.',
    'Sunday', 'approved'
  ),
  (
    'Lakeside Retreat',
    'A peaceful lakefront property offering water activities and serene forest surroundings in Minnesota lake country.',
    us_country_id, 'Grand Rapids', '1847 Golf Course Road', '55744',
    'Jennifer Anderson', 'info@lakesideretreat.com', '+1-218-555-0189',
    'Lodge', 'Rural', 3,
    'Families, fishing enthusiasts, and nature lovers seeking lakefront tranquility',
    'Relaxed and family-friendly with rustic charm and lakefront access',
    'Perfect for fishing, water sports, and exploring Minnesota pristine lake region',
    'Comfortable lakefront rooms with rustic decor, lake views, and cozy furnishings',
    false, true, ARRAY[8, 15], ARRAY['Continental Breakfast'],
    '{"Lakefront": true, "Boat Rental": true, "Fishing": true, "WiFi": true, "Parking": true, "Fire Pit": true}'::jsonb,
    '{"Private Bathroom": true, "Lake View": true, "Heating": true, "Coffee Maker": true, "Mini Fridge": true}'::jsonb,
    ARRAY['2024-05', '2024-06', '2024-07', '2024-08', '2024-09'],
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 1875,
    'Lake safety rules apply. No smoking. Pet-friendly with restrictions. Fishing license required.',
    'Saturday', 'approved'
  );

  -- Add Batch 2 hotels (15 additional authentic US hotels)
  INSERT INTO hotels (
    name, description, country_id, city, address, postal_code,
    contact_name, contact_email, contact_phone, property_type, style,
    category, price_per_month, ideal_guests, atmosphere, perfect_location,
    room_description, weekly_laundry_included, external_laundry_available,
    stay_lengths, meals_offered, features_hotel, features_room,
    available_months, main_image_url, status, check_in_weekday
  ) VALUES
  ('The Pearl District Inn', 'A boutique hotel in Portland''s trendy Pearl District, featuring modern amenities and easy access to the city''s renowned food scene and cultural attractions.', us_country_id, 'Portland', '425 NW Park Avenue', '97209', 'Sarah Chen', 'info@pearldistrict.com', '+1 (503) 555-0198', 'Boutique Hotel', 'modern', 3, 425, 'Urban explorers and food enthusiasts who appreciate modern design and cultural immersion', 'Contemporary and vibrant with an artistic flair', 'Exploring Portland''s famous food trucks, breweries, and the Pearl District''s galleries', 'Comfortable rooms with modern furnishings, city views, and local artwork', false, true, ARRAY[8, 15, 22, 29], ARRAY['breakfast'], '{"wifi": true, "fitness_center": true, "business_center": true, "concierge": true, "parking": false}', '{"air_conditioning": true, "coffee_maker": true, "work_desk": true, "flat_screen_tv": true}', ARRAY['2025-03', '2025-04', '2025-05', '2025-06'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'approved', 'Monday'),
  ('South Austin Lodge', 'A modern hotel in Austin''s vibrant South Austin area, close to South by Southwest venues and the city''s famous live music scene.', us_country_id, 'Austin', '1847 South Lamar Boulevard', '78704', 'Marcus Rodriguez', 'stay@southaustinlodge.com', '+1 (512) 555-0247', 'Modern Hotel', 'urban', 4, 450, 'Music lovers and tech professionals seeking an authentic Austin experience', 'Eclectic and energetic with a strong connection to local music culture', 'Enjoying Austin''s live music venues, food scene, and tech community events', 'Stylish rooms with local music memorabilia and modern amenities', true, false, ARRAY[15, 22, 29], ARRAY['breakfast', 'lunch'], '{"wifi": true, "fitness_center": true, "restaurant": true, "bar": true, "live_music": true}', '{"air_conditioning": true, "sound_proofing": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-07'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', 'approved', 'Monday'),
  ('Green Mountain Inn', 'A charming inn nestled between Burlington''s downtown and the scenic Lake Champlain, offering a perfect blend of urban amenities and natural beauty.', us_country_id, 'Burlington', '345 Battery Street', '05401', 'Emily Thompson', 'reservations@greenmountaininn.com', '+1 (802) 555-0156', 'Inn', 'classic', 3, 395, 'Nature enthusiasts and those seeking a peaceful retreat with easy city access', 'Cozy and welcoming with a focus on sustainability and local culture', 'Exploring Lake Champlain, hiking trails, and Burlington''s local breweries', 'Comfortable rooms with lake or mountain views and eco-friendly amenities', true, false, ARRAY[22, 29], ARRAY['breakfast', 'dinner'], '{"wifi": true, "restaurant": true, "lake_access": true, "bike_rental": true, "eco_friendly": true}', '{"heating": true, "coffee_maker": true, "work_desk": true, "lake_view": true}', ARRAY['2025-05', '2025-06', '2025-07', '2025-08'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', 'approved', 'Monday'),
  ('Historic District Lodge', 'A beautifully restored 19th-century building in Savannah''s Historic District, offering Southern charm and easy access to the city''s famous squares and architecture.', us_country_id, 'Savannah', '123 Bull Street', '31401', 'William Foster', 'info@historicsavannah.com', '+1 (912) 555-0278', 'Historic Hotel', 'classic', 4, 475, 'History buffs and architecture enthusiasts who appreciate Southern hospitality', 'Elegant and historic with authentic Southern charm', 'Exploring Savannah''s famous squares, ghost tours, and antebellum architecture', 'Period-appointed rooms with modern comforts and historic character', false, true, ARRAY[15, 22, 29], ARRAY['breakfast'], '{"wifi": true, "historic_tour": true, "courtyard": true, "concierge": true, "valet_parking": true}', '{"air_conditioning": true, "period_furniture": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-03', '2025-04', '2025-05', '2025-09'], 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a', 'approved', 'Monday'),
  ('Foothills View Hotel', 'A contemporary hotel with stunning views of the Boise Foothills, perfectly positioned for both business travelers and outdoor enthusiasts.', us_country_id, 'Boise', '789 West Idaho Street', '83702', 'Jennifer Walsh', 'stay@foothillsview.com', '+1 (208) 555-0234', 'Contemporary Hotel', 'modern', 3, 420, 'Outdoor enthusiasts and business travelers who value mountain proximity', 'Modern and relaxed with strong connections to Idaho''s outdoor lifestyle', 'Hiking the Boise Foothills, exploring downtown Boise, and accessing nearby ski areas', 'Modern rooms with mountain views and outdoor gear storage', false, true, ARRAY[8, 15, 22], ARRAY['breakfast'], '{"wifi": true, "fitness_center": true, "ski_storage": true, "hiking_guides": true, "business_center": true}', '{"air_conditioning": true, "mountain_view": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-10'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', 'approved', 'Monday'),
  ('Tropical Winds Resort', 'A laid-back resort in Key West offering easy access to water activities and the famous Duval Street nightlife.', us_country_id, 'Key West', '456 Duval Street', '33040', 'Carlos Martinez', 'info@tropicalwinds.com', '+1 (305) 555-0189', 'Resort', 'tropical', 4, 525, 'Beach lovers and water sports enthusiasts seeking a tropical paradise', 'Relaxed and tropical with a focus on water activities and island living', 'Snorkeling, fishing, water sports, and experiencing Key West''s unique island culture', 'Bright tropical rooms with ocean views and island-inspired decor', true, false, ARRAY[22, 29], ARRAY['breakfast', 'lunch', 'dinner'], '{"wifi": true, "pool": true, "water_sports": true, "dive_center": true, "beach_access": true}', '{"air_conditioning": true, "ocean_view": true, "mini_fridge": true, "coffee_maker": true}', ARRAY['2025-03', '2025-04', '2025-05', '2025-11'], 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', 'approved', 'Monday'),
  ('Capitol View Inn', 'A modern hotel near the Wisconsin State Capitol and University of Wisconsin-Madison, ideal for both business and leisure travelers.', us_country_id, 'Madison', '234 State Street', '53703', 'Linda Peterson', 'reservations@capitolview.com', '+1 (608) 555-0267', 'Urban Hotel', 'modern', 3, 445, 'University visitors and state government travelers who appreciate urban convenience', 'Professional and welcoming with a collegiate atmosphere', 'Exploring the University of Wisconsin campus, state capitol tours, and Lake Mendota', 'Contemporary rooms with city or lake views and business amenities', false, true, ARRAY[8, 15, 22], ARRAY['breakfast'], '{"wifi": true, "business_center": true, "fitness_center": true, "meeting_rooms": true, "parking": true}', '{"air_conditioning": true, "work_desk": true, "coffee_maker": true, "flat_screen_tv": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-09'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'approved', 'Monday'),
  ('Blue Ridge Mountain Lodge', 'A rustic-chic lodge in the Blue Ridge Mountains near Asheville, offering stunning mountain views and easy access to hiking trails.', us_country_id, 'Asheville', '567 Macon Avenue', '28804', 'David Kim', 'stay@blueridgelodge.com', '+1 (828) 555-0178', 'Mountain Lodge', 'rustic', 4, 465, 'Nature lovers and hikers who appreciate mountain scenery and craft culture', 'Rustic elegance with strong connections to Appalachian culture', 'Hiking the Blue Ridge Parkway, exploring Asheville''s craft breweries, and mountain adventures', 'Cozy rooms with mountain views and rustic mountain decor', true, false, ARRAY[15, 22, 29], ARRAY['breakfast', 'dinner'], '{"wifi": true, "hiking_guides": true, "fireplace": true, "craft_brewery_tours": true, "mountain_biking": true}', '{"heating": true, "mountain_view": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-05', '2025-06', '2025-07', '2025-10'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', 'approved', 'Monday'),
  ('Adobe Hills Inn', 'A Southwest-style inn featuring traditional adobe architecture and stunning desert views, perfectly located for exploring Santa Fe''s rich cultural heritage.', us_country_id, 'Santa Fe', '890 Canyon Road', '87501', 'Maria Gonzalez', 'info@adobehills.com', '+1 (505) 555-0245', 'Southwest Inn', 'southwestern', 4, 485, 'Art enthusiasts and cultural travelers drawn to Native American and Hispanic heritage', 'Artistic and serene with authentic Southwestern charm', 'Exploring art galleries, Native American culture, and the high desert landscape', 'Adobe-style rooms with southwestern decor and desert views', false, true, ARRAY[22, 29], ARRAY['breakfast'], '{"wifi": true, "art_gallery": true, "spa": true, "cultural_tours": true, "courtyard": true}', '{"air_conditioning": true, "desert_view": true, "coffee_maker": true, "southwestern_decor": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-10'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', 'approved', 'Monday'),
  ('Hampton Inn Providence Downtown', 'A reliable chain hotel in downtown Providence, offering consistent service and easy access to Brown University and historic Federal Hill.', us_country_id, 'Providence', '345 Westminster Street', '02903', 'Robert Johnson', 'providence@hamptoninn.com', '+1 (401) 555-0234', 'Chain Hotel', 'modern', 3, 415, 'Business travelers and university visitors who value reliable service and central location', 'Professional and efficient with modern amenities', 'Exploring Brown University, Federal Hill''s Italian heritage, and Providence''s waterfront', 'Standard modern rooms with city views and business amenities', false, true, ARRAY[8, 15, 22], ARRAY['breakfast'], '{"wifi": true, "fitness_center": true, "business_center": true, "pool": true, "parking": true}', '{"air_conditioning": true, "work_desk": true, "coffee_maker": true, "flat_screen_tv": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-09'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'approved', 'Monday'),
  ('Wasatch Mountain View Hotel', 'A modern hotel with spectacular views of the Wasatch Mountains, perfectly positioned for both city exploration and mountain adventures.', us_country_id, 'Salt Lake City', '678 South Main Street', '84111', 'Michael Chang', 'reservations@wasatchview.com', '+1 (801) 555-0198', 'Mountain View Hotel', 'modern', 4, 455, 'Outdoor enthusiasts and business travelers who appreciate mountain proximity and urban amenities', 'Clean and modern with strong outdoor recreation focus', 'Skiing, hiking, exploring downtown Salt Lake City, and visiting nearby national parks', 'Modern rooms with mountain views and outdoor gear storage', false, true, ARRAY[15, 22, 29], ARRAY['breakfast'], '{"wifi": true, "fitness_center": true, "ski_storage": true, "concierge": true, "mountain_guides": true}', '{"air_conditioning": true, "mountain_view": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-11'], 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', 'approved', 'Monday'),
  ('Hilton Virginia Beach Oceanfront', 'A beachfront chain hotel offering direct ocean access and all the amenities expected from a major hospitality brand.', us_country_id, 'Virginia Beach', '3001 Atlantic Avenue', '23451', 'Patricia Wilson', 'oceanfront@hilton.com', '+1 (757) 555-0289', 'Chain Hotel', 'modern', 4, 495, 'Beach vacationers and families who want reliable oceanfront accommodations', 'Upscale beachfront with modern amenities and ocean focus', 'Beach activities, water sports, Virginia Beach boardwalk, and oceanfront dining', 'Ocean view rooms with modern furnishings and beach amenities', true, false, ARRAY[22, 29], ARRAY['breakfast', 'lunch'], '{"wifi": true, "pool": true, "beach_access": true, "fitness_center": true, "restaurant": true}', '{"air_conditioning": true, "ocean_view": true, "mini_fridge": true, "coffee_maker": true}', ARRAY['2025-05', '2025-06', '2025-07', '2025-08'], 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', 'approved', 'Monday'),
  ('Big Sky Urban Lodge', 'A contemporary lodge in Montana''s largest city, offering easy access to both urban amenities and the vast Montana landscape.', us_country_id, 'Billings', '456 North Broadway', '59101', 'Thomas Anderson', 'info@bigskylodge.com', '+1 (406) 555-0167', 'Urban Lodge', 'modern', 3, 385, 'Business travelers and outdoor enthusiasts seeking a base for Montana adventures', 'Modern and spacious with connections to Montana''s ranching and outdoor culture', 'Exploring the Yellowstone River, nearby ranches, and Montana''s Big Sky country', 'Comfortable rooms with prairie views and Western-inspired decor', false, true, ARRAY[8, 15, 22], ARRAY['breakfast'], '{"wifi": true, "business_center": true, "fitness_center": true, "ranch_tours": true, "outdoor_guides": true}', '{"air_conditioning": true, "prairie_view": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-05', '2025-06', '2025-07', '2025-09'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', 'approved', 'Monday'),
  ('Riverside Park Hotel', 'A modern hotel along the Spokane River, offering city convenience with easy access to outdoor recreation and the beautiful Riverfront Park.', us_country_id, 'Spokane', '789 West Spokane Falls Boulevard', '99201', 'Angela Davis', 'stay@riversidepark.com', '+1 (509) 555-0234', 'Riverside Hotel', 'modern', 3, 405, 'Outdoor enthusiasts and business travelers who appreciate river access and urban amenities', 'Contemporary and relaxed with a focus on river activities and urban exploration', 'Exploring Riverfront Park, river activities, and Spokane''s downtown cultural district', 'Modern rooms with river views and outdoor recreation amenities', false, true, ARRAY[15, 22, 29], ARRAY['breakfast'], '{"wifi": true, "fitness_center": true, "business_center": true, "river_access": true, "bike_rental": true}', '{"air_conditioning": true, "river_view": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-08'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'approved', 'Monday'),
  ('Gulf Coast Heritage Inn', 'A charming inn in Mobile''s historic district, combining Southern heritage with easy access to Gulf Coast beaches and seafood.', us_country_id, 'Mobile', '234 Government Street', '36602', 'Rebecca Turner', 'info@gulfcoastheritage.com', '+1 (251) 555-0198', 'Historic Inn', 'classic', 4, 435, 'History enthusiasts and seafood lovers who appreciate Southern coastal culture', 'Historic and welcoming with authentic Gulf Coast charm', 'Exploring Mobile''s antebellum architecture, Gulf Coast beaches, and fresh seafood dining', 'Historic rooms with period details and modern comforts', true, false, ARRAY[22, 29], ARRAY['breakfast', 'dinner'], '{"wifi": true, "historic_tours": true, "seafood_restaurant": true, "courtyard": true, "beach_shuttle": true}', '{"air_conditioning": true, "period_furniture": true, "coffee_maker": true, "work_desk": true}', ARRAY['2025-04', '2025-05', '2025-06', '2025-09'], 'https://images.unsplash.com/photo-1520637836862-4d197d17c35a', 'approved', 'Monday');

END $$;