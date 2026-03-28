-- First, create the views that the query adapter expects
CREATE OR REPLACE VIEW hotels_with_filters_view AS
SELECT 
  h.*,
  c.name_en as country,
  COALESCE(
    (SELECT array_agg(af.name_en) 
     FROM hotel_affinities ha 
     JOIN affinities af ON af.id = ha.affinity_id 
     WHERE ha.hotel_id = h.id), 
    ARRAY[]::text[]
  ) as theme_names,
  COALESCE(
    (SELECT array_agg(a.name_en) 
     FROM hotel_activities hact 
     JOIN activities a ON a.id = hact.activity_id 
     WHERE hact.hotel_id = h.id), 
    ARRAY[]::text[]
  ) as activity_names,
  ARRAY['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as available_months,
  pt.name_en as property_type,
  'classic' as property_style
FROM hotels h
LEFT JOIN countries c ON c.id = h.country_id
LEFT JOIN property_types pt ON pt.id = h.property_type_id
WHERE h.status = 'approved';

-- Create availability packages view
CREATE OR REPLACE VIEW availability_packages_public_view AS
SELECT 
  ap.*,
  'room_only' as meal_plan
FROM availability_packages ap;

-- Now insert a demo profile for the hotels (needed for the profile_id foreign key)
INSERT INTO profiles (user_id, name, email, role, code)
SELECT 
  gen_random_uuid(),
  'Demo Hotel Owner',
  'demo@hotel-living.com',
  'hotel_owner'::user_role,
  'DEMO001'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'demo@hotel-living.com');

-- Get the profile ID for later use
DO $$
DECLARE
  demo_profile_id uuid;
  spain_country_id uuid;
  portugal_country_id uuid;
  france_country_id uuid;
  italy_country_id uuid;
  germany_country_id uuid;
  uk_country_id uuid;
  boutique_property_id uuid;
  resort_property_id uuid;
  apartment_property_id uuid;
  
  -- Activity IDs
  spa_activity_id uuid;
  wine_activity_id uuid;
  hiking_activity_id uuid;
  cooking_activity_id uuid;
  fitness_activity_id uuid;
  yoga_activity_id uuid;
  
  -- Affinity IDs  
  wellness_affinity_id uuid;
  gastronomy_affinity_id uuid;
  nature_affinity_id uuid;
  culture_affinity_id uuid;
  luxury_affinity_id uuid;
  
  new_hotel_id uuid;
BEGIN
  -- Get the demo profile ID
  SELECT id INTO demo_profile_id FROM profiles WHERE email = 'demo@hotel-living.com';
  
  -- Get country IDs
  SELECT id INTO spain_country_id FROM countries WHERE iso_code = 'ES';
  SELECT id INTO portugal_country_id FROM countries WHERE iso_code = 'PT';
  SELECT id INTO france_country_id FROM countries WHERE iso_code = 'FR';
  SELECT id INTO italy_country_id FROM countries WHERE iso_code = 'IT';
  SELECT id INTO germany_country_id FROM countries WHERE iso_code = 'DE';
  SELECT id INTO uk_country_id FROM countries WHERE iso_code = 'GB';
  
  -- Get property type IDs
  SELECT id INTO boutique_property_id FROM property_types WHERE name_en = 'Boutique Hotel';
  SELECT id INTO resort_property_id FROM property_types WHERE name_en = 'Resort';
  SELECT id INTO apartment_property_id FROM property_types WHERE name_en = 'Apartment Hotel';
  
  -- Get activity IDs
  SELECT id INTO spa_activity_id FROM activities WHERE name_en = 'Spa & Masaje';
  SELECT id INTO wine_activity_id FROM activities WHERE name_en = 'Cata de Vinos';
  SELECT id INTO hiking_activity_id FROM activities WHERE name_en = 'Senderismo';
  SELECT id INTO cooking_activity_id FROM activities WHERE name_en = 'Taller Cocina Española';
  SELECT id INTO fitness_activity_id FROM activities WHERE name_en = 'Fitness';
  SELECT id INTO yoga_activity_id FROM activities WHERE name_en = 'Yoga Relax';
  
  -- Get affinity IDs
  SELECT id INTO wellness_affinity_id FROM affinities WHERE name_en = 'Nutrition & Wellness';
  SELECT id INTO gastronomy_affinity_id FROM affinities WHERE name_en = 'French Cuisine & Gastronomy';
  SELECT id INTO nature_affinity_id FROM affinities WHERE name_en = 'Natural Environments';
  SELECT id INTO culture_affinity_id FROM affinities WHERE name_en = 'Art History & Movements';
  SELECT id INTO luxury_affinity_id FROM affinities WHERE name_en = 'Gourmet Experiences';

  -- Insert first 10 hotels in Spain
  FOR i IN 1..10 LOOP
    INSERT INTO hotels (
      profile_id, name, description, city, country_id, address, 
      price_per_month, stars, status, main_image_url,
      latitude, longitude, property_type_id
    ) VALUES (
      demo_profile_id,
      'Hotel Español ' || i,
      'Beautiful Spanish hotel with excellent amenities and stunning views. Experience authentic Spanish hospitality in a luxurious setting.',
      CASE i % 4 
        WHEN 0 THEN 'Madrid'
        WHEN 1 THEN 'Barcelona' 
        WHEN 2 THEN 'Valencia'
        ELSE 'Seville'
      END,
      spain_country_id,
      'Calle Principal ' || i || ', ' || CASE i % 4 
        WHEN 0 THEN 'Madrid'
        WHEN 1 THEN 'Barcelona'
        WHEN 2 THEN 'Valencia' 
        ELSE 'Seville'
      END,
      1200 + (i * 100),
      3 + (i % 3),
      'approved',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      40.4168 + (i * 0.1),
      -3.7038 + (i * 0.1),
      CASE i % 3 
        WHEN 0 THEN boutique_property_id
        WHEN 1 THEN resort_property_id
        ELSE apartment_property_id
      END
    ) RETURNING id INTO new_hotel_id;
    
    -- Add activities for each hotel
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, spa_activity_id);
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, wine_activity_id);
    IF i % 2 = 0 THEN
      INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, hiking_activity_id);
    END IF;
    
    -- Add affinities
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, wellness_affinity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, gastronomy_affinity_id);
    IF i % 3 = 0 THEN
      INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, luxury_affinity_id);
    END IF;
    
    -- Add hotel images
    INSERT INTO hotel_images (hotel_id, image_url, is_main) VALUES 
      (new_hotel_id, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', true);
      
    -- Add availability package
    INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, duration_days, base_price_usd)
    VALUES (new_hotel_id, '2024-01-01', 30, 10, 1200 + (i * 100), 30, 1200 + (i * 100));
  END LOOP;

  -- Insert hotels in Portugal
  FOR i IN 11..18 LOOP
    INSERT INTO hotels (
      profile_id, name, description, city, country_id, address,
      price_per_month, stars, status, main_image_url,
      latitude, longitude, property_type_id
    ) VALUES (
      demo_profile_id,
      'Hotel Portugal ' || (i-10),
      'Charming Portuguese hotel with traditional architecture and modern comfort. Discover the beauty of Portugal while enjoying premium hospitality.',
      CASE (i-10) % 3
        WHEN 0 THEN 'Lisbon'
        WHEN 1 THEN 'Porto'
        ELSE 'Braga'
      END,
      portugal_country_id,
      'Rua Principal ' || (i-10) || ', ' || CASE (i-10) % 3
        WHEN 0 THEN 'Lisbon'
        WHEN 1 THEN 'Porto'
        ELSE 'Braga'
      END,
      1100 + ((i-10) * 80),
      3 + ((i-10) % 3),
      'approved',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      38.7223 + ((i-10) * 0.1),
      -9.1393 + ((i-10) * 0.1),
      CASE (i-10) % 3 
        WHEN 0 THEN boutique_property_id
        WHEN 1 THEN resort_property_id
        ELSE apartment_property_id
      END
    ) RETURNING id INTO new_hotel_id;
    
    -- Add activities and affinities for Portuguese hotels
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, spa_activity_id);
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, wine_activity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, wellness_affinity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, nature_affinity_id);
    
    -- Add images and packages
    INSERT INTO hotel_images (hotel_id, image_url, is_main) VALUES 
      (new_hotel_id, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', true);
    INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, duration_days, base_price_usd)
    VALUES (new_hotel_id, '2024-01-01', 30, 8, 1100 + ((i-10) * 80), 30, 1100 + ((i-10) * 80));
  END LOOP;

  -- Insert hotels in France  
  FOR i IN 19..28 LOOP
    INSERT INTO hotels (
      profile_id, name, description, city, country_id, address,
      price_per_month, stars, status, main_image_url,
      latitude, longitude, property_type_id
    ) VALUES (
      demo_profile_id,
      'Hôtel France ' || (i-18),
      'Elegant French hotel combining classic charm with contemporary luxury. Experience the finest French hospitality and cuisine.',
      CASE (i-18) % 4
        WHEN 0 THEN 'Paris'
        WHEN 1 THEN 'Lyon'
        WHEN 2 THEN 'Nice'
        ELSE 'Bordeaux'
      END,
      france_country_id,
      'Rue Principale ' || (i-18) || ', ' || CASE (i-18) % 4
        WHEN 0 THEN 'Paris'
        WHEN 1 THEN 'Lyon'
        WHEN 2 THEN 'Nice'
        ELSE 'Bordeaux'
      END,
      1500 + ((i-18) * 120),
      4 + ((i-18) % 2),
      'approved',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      48.8566 + ((i-18) * 0.1),
      2.3522 + ((i-18) * 0.1),
      boutique_property_id
    ) RETURNING id INTO new_hotel_id;
    
    -- French hotels get premium activities and affinities
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, spa_activity_id);
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, wine_activity_id);
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, cooking_activity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, gastronomy_affinity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, luxury_affinity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, culture_affinity_id);
    
    INSERT INTO hotel_images (hotel_id, image_url, is_main) VALUES 
      (new_hotel_id, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', true);
    INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, duration_days, base_price_usd)
    VALUES (new_hotel_id, '2024-01-01', 30, 12, 1500 + ((i-18) * 120), 30, 1500 + ((i-18) * 120));
  END LOOP;

  -- Continue with remaining countries following the same pattern...
  -- Italy (hotels 29-36)
  FOR i IN 29..36 LOOP
    INSERT INTO hotels (
      profile_id, name, description, city, country_id, address,
      price_per_month, stars, status, main_image_url,
      latitude, longitude, property_type_id
    ) VALUES (
      demo_profile_id,
      'Hotel Italia ' || (i-28),
      'Magnificent Italian hotel showcasing the beauty and elegance of Italy. Enjoy authentic Italian culture and cuisine.',
      CASE (i-28) % 4
        WHEN 0 THEN 'Rome'
        WHEN 1 THEN 'Milan'
        WHEN 2 THEN 'Florence'
        ELSE 'Venice'
      END,
      italy_country_id,
      'Via Principale ' || (i-28) || ', ' || CASE (i-28) % 4
        WHEN 0 THEN 'Rome'
        WHEN 1 THEN 'Milan'
        WHEN 2 THEN 'Florence'
        ELSE 'Venice'
      END,
      1400 + ((i-28) * 110),
      4 + ((i-28) % 2),
      'approved',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&q=80',
      41.9028 + ((i-28) * 0.1),
      12.4964 + ((i-28) * 0.1),
      CASE (i-28) % 2 
        WHEN 0 THEN boutique_property_id
        ELSE resort_property_id
      END
    ) RETURNING id INTO new_hotel_id;
    
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, spa_activity_id);
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, wine_activity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, culture_affinity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, luxury_affinity_id);
    
    INSERT INTO hotel_images (hotel_id, image_url, is_main) VALUES 
      (new_hotel_id, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&q=80', true);
    INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, duration_days, base_price_usd)
    VALUES (new_hotel_id, '2024-01-01', 30, 10, 1400 + ((i-28) * 110), 30, 1400 + ((i-28) * 110));
  END LOOP;

  -- Germany (hotels 37-42)
  FOR i IN 37..42 LOOP
    INSERT INTO hotels (
      profile_id, name, description, city, country_id, address,
      price_per_month, stars, status, main_image_url,
      latitude, longitude, property_type_id
    ) VALUES (
      demo_profile_id,
      'Hotel Deutschland ' || (i-36),
      'Modern German hotel combining efficiency with comfort. Experience German hospitality in stylish contemporary settings.',
      CASE (i-36) % 3
        WHEN 0 THEN 'Berlin'
        WHEN 1 THEN 'Munich'
        ELSE 'Hamburg'
      END,
      germany_country_id,
      'Hauptstraße ' || (i-36) || ', ' || CASE (i-36) % 3
        WHEN 0 THEN 'Berlin'
        WHEN 1 THEN 'Munich'
        ELSE 'Hamburg'
      END,
      1300 + ((i-36) * 100),
      3 + ((i-36) % 2),
      'approved',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      52.5200 + ((i-36) * 0.1),
      13.4050 + ((i-36) * 0.1),
      apartment_property_id
    ) RETURNING id INTO new_hotel_id;
    
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, fitness_activity_id);
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, yoga_activity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, wellness_affinity_id);
    
    INSERT INTO hotel_images (hotel_id, image_url, is_main) VALUES 
      (new_hotel_id, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', true);
    INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, duration_days, base_price_usd)
    VALUES (new_hotel_id, '2024-01-01', 30, 8, 1300 + ((i-36) * 100), 30, 1300 + ((i-36) * 100));
  END LOOP;

  -- UK (hotels 43-46)
  FOR i IN 43..46 LOOP
    INSERT INTO hotels (
      profile_id, name, description, city, country_id, address,
      price_per_month, stars, status, main_image_url,
      latitude, longitude, property_type_id
    ) VALUES (
      demo_profile_id,
      'Hotel Britain ' || (i-42),
      'Classic British hotel offering traditional charm and exceptional service. Experience the best of British hospitality.',
      CASE (i-42) % 2
        WHEN 0 THEN 'London'
        ELSE 'Edinburgh'
      END,
      uk_country_id,
      'Main Street ' || (i-42) || ', ' || CASE (i-42) % 2
        WHEN 0 THEN 'London'
        ELSE 'Edinburgh'
      END,
      1600 + ((i-42) * 150),
      4 + ((i-42) % 2),
      'approved',
      'https://images.unsplash.com/photo-1529290130-4c1dc6772814?w=800&q=80',
      51.5074 + ((i-42) * 0.1),
      -0.1278 + ((i-42) * 0.1),
      boutique_property_id
    ) RETURNING id INTO new_hotel_id;
    
    INSERT INTO hotel_activities (hotel_id, activity_id) VALUES (new_hotel_id, spa_activity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, culture_affinity_id);
    INSERT INTO hotel_affinities (hotel_id, affinity_id) VALUES (new_hotel_id, luxury_affinity_id);
    
    INSERT INTO hotel_images (hotel_id, image_url, is_main) VALUES 
      (new_hotel_id, 'https://images.unsplash.com/photo-1529290130-4c1dc6772814?w=800&q=80', true);
    INSERT INTO availability_packages (hotel_id, start_date, duration, rooms, base_price, duration_days, base_price_usd)
    VALUES (new_hotel_id, '2024-01-01', 30, 12, 1600 + ((i-42) * 150), 30, 1600 + ((i-42) * 150));
  END LOOP;

END $$;