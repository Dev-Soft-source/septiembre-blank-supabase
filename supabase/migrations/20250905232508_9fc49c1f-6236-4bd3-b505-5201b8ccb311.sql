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

  -- Insert the authentic US hotels (20 total - exactly as they were)
  INSERT INTO hotels (
    name, description, country_id, city, address, zip_code,
    contact_email, contact_phone, price_per_month,
    main_image_url, status, check_in_weekday
  ) VALUES
  -- Batch 1: Original 5 hotels
  ('Coastal Breeze Inn', 'A charming coastal retreat offering stunning ocean views and peaceful accommodations just steps from the beach.',
   us_country_id, 'Carmel-by-the-Sea', '4th Avenue & Torres Street', '93921',
   'info@coastalbreezeinn.com', '+1-831-555-0125', 2295,
   'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'approved', 'Monday'),
   
  ('Mountain View Lodge', 'A rustic mountain retreat surrounded by pristine wilderness and hiking trails, perfect for nature enthusiasts.',
   us_country_id, 'Estes Park', '1520 Fall River Road', '80517',
   'reservations@mountainviewlodge.com', '+1-970-555-0198', 3225,
   'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 'approved', 'Sunday'),
   
  ('Historic Charleston Inn', 'An elegant boutique inn in Charleston historic district, featuring antebellum architecture and Southern hospitality.',
   us_country_id, 'Charleston', '58 Meeting Street', '29401',
   'stay@historiccharlestoninn.com', '+1-843-555-0167', 4575,
   'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 'approved', 'Monday'),
   
  ('Desert Oasis Hotel', 'A modern desert retreat offering spectacular views of red rock formations and starlit skies.',
   us_country_id, 'Sedona', '2250 West Highway 89A', '86336',
   'reservations@desertoasishotel.com', '+1-928-555-0143', 3825,
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'approved', 'Sunday'),
   
  ('Lakeside Retreat', 'A peaceful lakefront property offering water activities and serene forest surroundings in Minnesota lake country.',
   us_country_id, 'Grand Rapids', '1847 Golf Course Road', '55744',
   'info@lakesideretreat.com', '+1-218-555-0189', 1875,
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'approved', 'Saturday'),
   
  -- Batch 2: Additional 15 authentic US hotels
  ('The Pearl District Inn', 'A boutique hotel in Portland''s trendy Pearl District, featuring modern amenities and easy access to the city''s renowned food scene and cultural attractions.',
   us_country_id, 'Portland', '425 NW Park Avenue', '97209',
   'info@pearldistrict.com', '+1 (503) 555-0198', 425,
   'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'approved', 'Monday'),
   
  ('South Austin Lodge', 'A modern hotel in Austin''s vibrant South Austin area, close to South by Southwest venues and the city''s famous live music scene.',
   us_country_id, 'Austin', '1847 South Lamar Boulevard', '78704',
   'stay@southaustinlodge.com', '+1 (512) 555-0247', 450,
   'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'approved', 'Monday'),
   
  ('Green Mountain Inn', 'A charming inn nestled between Burlington''s downtown and the scenic Lake Champlain, offering a perfect blend of urban amenities and natural beauty.',
   us_country_id, 'Burlington', '345 Battery Street', '05401',
   'reservations@greenmountaininn.com', '+1 (802) 555-0156', 395,
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'approved', 'Monday'),
   
  ('Historic District Lodge', 'A beautifully restored 19th-century building in Savannah''s Historic District, offering Southern charm and easy access to the city''s famous squares and architecture.',
   us_country_id, 'Savannah', '123 Bull Street', '31401',
   'info@historicsavannah.com', '+1 (912) 555-0278', 475,
   'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800', 'approved', 'Monday'),
   
  ('Foothills View Hotel', 'A contemporary hotel with stunning views of the Boise Foothills, perfectly positioned for both business travelers and outdoor enthusiasts.',
   us_country_id, 'Boise', '789 West Idaho Street', '83702',
   'stay@foothillsview.com', '+1 (208) 555-0234', 420,
   'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 'approved', 'Monday'),
   
  ('Tropical Winds Resort', 'A laid-back resort in Key West offering easy access to water activities and the famous Duval Street nightlife.',
   us_country_id, 'Key West', '456 Duval Street', '33040',
   'info@tropicalwinds.com', '+1 (305) 555-0189', 525,
   'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'approved', 'Monday'),
   
  ('Capitol View Inn', 'A modern hotel near the Wisconsin State Capitol and University of Wisconsin-Madison, ideal for both business and leisure travelers.',
   us_country_id, 'Madison', '234 State Street', '53703',
   'reservations@capitolview.com', '+1 (608) 555-0267', 445,
   'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'approved', 'Monday'),
   
  ('Blue Ridge Mountain Lodge', 'A rustic-chic lodge in the Blue Ridge Mountains near Asheville, offering stunning mountain views and easy access to hiking trails.',
   us_country_id, 'Asheville', '567 Macon Avenue', '28804',
   'stay@blueridgelodge.com', '+1 (828) 555-0178', 465,
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'approved', 'Monday'),
   
  ('Adobe Hills Inn', 'A Southwest-style inn featuring traditional adobe architecture and stunning desert views, perfectly located for exploring Santa Fe''s rich cultural heritage.',
   us_country_id, 'Santa Fe', '890 Canyon Road', '87501',
   'info@adobehills.com', '+1 (505) 555-0245', 485,
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'approved', 'Monday'),
   
  ('Hampton Inn Providence Downtown', 'A reliable chain hotel in downtown Providence, offering consistent service and easy access to Brown University and historic Federal Hill.',
   us_country_id, 'Providence', '345 Westminster Street', '02903',
   'providence@hamptoninn.com', '+1 (401) 555-0234', 415,
   'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'approved', 'Monday'),
   
  ('Wasatch Mountain View Hotel', 'A modern hotel with spectacular views of the Wasatch Mountains, perfectly positioned for both city exploration and mountain adventures.',
   us_country_id, 'Salt Lake City', '678 South Main Street', '84111',
   'reservations@wasatchview.com', '+1 (801) 555-0198', 455,
   'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 'approved', 'Monday'),
   
  ('Hilton Virginia Beach Oceanfront', 'A beachfront chain hotel offering direct ocean access and all the amenities expected from a major hospitality brand.',
   us_country_id, 'Virginia Beach', '3001 Atlantic Avenue', '23451',
   'oceanfront@hilton.com', '+1 (757) 555-0289', 495,
   'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'approved', 'Monday'),
   
  ('Big Sky Urban Lodge', 'A contemporary lodge in Montana''s largest city, offering easy access to both urban amenities and the vast Montana landscape.',
   us_country_id, 'Billings', '456 North Broadway', '59101',
   'info@bigskylodge.com', '+1 (406) 555-0167', 385,
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'approved', 'Monday'),
   
  ('Riverside Park Hotel', 'A modern hotel along the Spokane River, offering city convenience with easy access to outdoor recreation and the beautiful Riverfront Park.',
   us_country_id, 'Spokane', '789 West Spokane Falls Boulevard', '99201',
   'stay@riversidepark.com', '+1 (509) 555-0234', 405,
   'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'approved', 'Monday'),
   
  ('Gulf Coast Heritage Inn', 'A charming inn in Mobile''s historic district, combining Southern heritage with easy access to Gulf Coast beaches and seafood.',
   us_country_id, 'Mobile', '234 Government Street', '36602',
   'info@gulfcoastheritage.com', '+1 (251) 555-0198', 435,
   'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=800', 'approved', 'Monday');

END $$;