-- Clean up all hotels and insert the exact 46 authentic US hotels from the user's list
-- First delete all existing hotels
DELETE FROM public.hotels;

-- Insert the complete list of 46 authentic US hotels
INSERT INTO public.hotels (
  id,
  profile_id,
  name, 
  description,
  address,
  city,
  country_id,
  contact_email,
  contact_phone,
  status,
  check_in_weekday,
  price_per_month,
  main_image_url,
  zip_code,
  created_at,
  updated_at
) VALUES 
-- 1. Mountain View Lodge - Missoula
(
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', null, 'Mountain View Lodge',
  'A mountain lodge in Missoula with spectacular views', '123 Mountain Road', 'Missoula',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56', 'info@mountainview.com', '+1-406-555-0123',
  'approved', 'Monday', 1235, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
  '59801', now(), now()
),

-- 2. Mountain View Lodge - Estes Park
(
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', null, 'Mountain View Lodge',
  'A rustic mountain retreat surrounded by pristine wilderness and hiking trails, perfect for nature enthusiasts.',
  '1520 Fall River Road', 'Estes Park', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@mountainviewlodge.com', '+1-970-555-0198', 'approved', 'Sunday', 411,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', '80517', now(), now()
),

-- 3. Garden District Hotel - Shreveport
(
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', null, 'Garden District Hotel',
  'An elegant hotel in Shreveport''s historic Garden District, offering Southern charm and modern amenities.',
  '423 Market Street', 'Shreveport', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@gardendistrict.com', '+1-318-555-0142', 'approved', 'Monday', 1235,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '71101', now(), now()
),

-- 4. Coastal Breeze Inn - Wilmington
(
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', null, 'Coastal Breeze Inn',
  'A charming coastal retreat in Wilmington offering stunning views and peaceful accommodations.',
  '234 Harbor Street', 'Wilmington', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@coastalbreeze.com', '+1-910-555-0145', 'approved', 'Monday', 1235,
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', '28401', now(), now()
),

-- 5. Pine Forest Retreat - Augusta
(
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', null, 'Pine Forest Retreat',
  'A peaceful retreat surrounded by pine forests, perfect for nature lovers seeking tranquility.',
  '892 Forest Trail Road', 'Augusta', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@pineforestretreat.com', '+1-207-555-0167', 'approved', 'Sunday', 1235,
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', '04330', now(), now()
),

-- 6. Big Sky Urban Lodge - Billings, Montana
(
  'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', null, 'Big Sky Urban Lodge',
  'A modern urban lodge in Billings with stunning views of the Montana sky and easy access to city attractions.',
  '567 North Broadway', 'Billings', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@bigskyurban.com', '+1-406-555-0198', 'approved', 'Monday', 823,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', '59101', now(), now()
),

-- 7. Capitol View Inn - Madison, Wisconsin
(
  '17b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', null, 'Capitol View Inn',
  'A charming inn with views of the Wisconsin State Capitol, located in the heart of Madison.',
  '789 State Street', 'Madison', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@capitolviewinn.com', '+1-608-555-0156', 'approved', 'Monday', 617,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '53703', now(), now()
),

-- 8. The Pearl District Inn - Portland, Oregon
(
  '28c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', null, 'The Pearl District Inn',
  'A boutique hotel in Portland''s trendy Pearl District, featuring modern amenities and easy access to the city''s renowned food scene.',
  '425 NW Park Avenue', 'Portland', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@pearldistrict.com', '+1-503-555-0198', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '97209', now(), now()
),

-- 9. Tropical Winds Resort - Key West, Florida
(
  '39d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', null, 'Tropical Winds Resort',
  'A tropical paradise resort in Key West offering luxury accommodations with ocean views and island charm.',
  '234 Duval Street', 'Key West', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@tropicalwinds.com', '+1-305-555-0189', 'approved', 'Sunday', 893,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', '33040', now(), now()
),

-- 10. Wasatch Mountain View Hotel - Salt Lake City, Utah
(
  '4ae1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', null, 'Wasatch Mountain View Hotel',
  'A luxury hotel with breathtaking views of the Wasatch Mountains, perfect for outdoor enthusiasts.',
  '456 South Temple Street', 'Salt Lake City', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@wasatchview.com', '+1-801-555-0173', 'approved', 'Monday', 893,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', '84111', now(), now()
),

-- 11. South Austin Lodge - Austin, Texas
(
  '5bf2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', null, 'South Austin Lodge',
  'A modern hotel in Austin''s vibrant South Austin area, close to South by Southwest venues and the city''s famous live music scene.',
  '1847 South Lamar Boulevard', 'Austin', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@southaustinlodge.com', '+1-512-555-0247', 'approved', 'Monday', 893,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', '78704', now(), now()
),

-- 12. Blue Ridge Mountain Lodge - Asheville, North Carolina
(
  '6ca3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', null, 'Blue Ridge Mountain Lodge',
  'A rustic mountain lodge nestled in the Blue Ridge Mountains, offering authentic Appalachian hospitality.',
  '678 Tunnel Road', 'Asheville', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@blueridgelodge.com', '+1-828-555-0164', 'approved', 'Sunday', 893,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', '28805', now(), now()
),

-- 13. Gulf Coast Heritage Inn - Mobile, Alabama
(
  '7db4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', null, 'Gulf Coast Heritage Inn',
  'A historic inn celebrating Mobile''s rich Gulf Coast heritage with antebellum architecture and Southern hospitality.',
  '321 Government Street', 'Mobile', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@gulfcoastheritage.com', '+1-251-555-0187', 'approved', 'Monday', 893,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', '36602', now(), now()
),

-- 14. Riverside Park Hotel - Spokane, Washington
(
  '8ec5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', null, 'Riverside Park Hotel',
  'A modern hotel overlooking the Spokane River, featuring contemporary amenities and scenic park views.',
  '789 West Spokane Falls Boulevard', 'Spokane', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@riversidepark.com', '+1-509-555-0143', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '99201', now(), now()
),

-- 15. Hampton Inn Providence Downtown
(
  '9fd6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', null, 'Hampton Inn Providence Downtown',
  'A comfortable downtown hotel in Providence''s historic district, walking distance to major attractions.',
  '101 West Exchange Street', 'Providence', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@hamptonprovidence.com', '+1-401-555-0156', 'approved', 'Monday', 617,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '02903', now(), now()
),

-- 16. Historic District Lodge - Savannah, Georgia
(
  'a0e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', null, 'Historic District Lodge',
  'A beautifully restored 19th-century building in Savannah''s Historic District, offering Southern charm and easy access to the city''s famous squares.',
  '123 Bull Street', 'Savannah', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@historicsavannah.com', '+1-912-555-0174', 'approved', 'Sunday', 893,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', '31401', now(), now()
),

-- 17. Prairie Wind Hotel - Grand Forks
(
  'b1f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', null, 'Prairie Wind Hotel',
  'A contemporary hotel on the Great Plains, offering Midwestern hospitality and modern comfort.',
  '567 North Washington Street', 'Grand Forks', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@prairiewind.com', '+1-701-555-0172', 'approved', 'Sunday', 1235,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '58201', now(), now()
),

-- 18. Green Mountain Inn - Burlington, Vermont
(
  'c2a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', null, 'Green Mountain Inn',
  'A charming inn nestled between Burlington''s downtown and the scenic Lake Champlain, offering a perfect blend of urban amenities and natural beauty.',
  '345 Battery Street', 'Burlington', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@greenmountaininn.com', '+1-802-555-0156', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '05401', now(), now()
),

-- 19. Foothills View Hotel - Boise, Idaho
(
  'd3b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d', null, 'Foothills View Hotel',
  'A modern hotel with panoramic views of the Boise Foothills, perfect for outdoor adventurers.',
  '890 West Idaho Street', 'Boise', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@foothillsview.com', '+1-208-555-0185', 'approved', 'Monday', 617,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', '83702', now(), now()
),

-- 20. Adobe Hills Inn - Santa Fe, New Mexico
(
  'e4c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e', null, 'Adobe Hills Inn',
  'A southwestern-style inn featuring traditional adobe architecture and authentic New Mexican charm.',
  '432 Old Santa Fe Trail', 'Santa Fe', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@adobehills.com', '+1-505-555-0168', 'approved', 'Sunday', 893,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', '87501', now(), now()
),

-- 21. Desert Oasis Hotel - Sedona, Arizona
(
  'f5d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', null, 'Desert Oasis Hotel',
  'A modern desert retreat offering spectacular views of red rock formations and starlit skies.',
  '2250 West Highway 89A', 'Sedona', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@desertoasishotel.com', '+1-928-555-0143', 'approved', 'Sunday', 583,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', '86336', now(), now()
),

-- 22. Steel City Lodge - Pittsburgh
(
  'a6e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a', null, 'Steel City Lodge',
  'A industrial-chic lodge celebrating Pittsburgh''s steel heritage with modern amenities and city views.',
  '654 Liberty Avenue', 'Pittsburgh', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@steelcitylodge.com', '+1-412-555-0159', 'approved', 'Monday', 1235,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', '15222', now(), now()
),

-- 23. High Desert Inn - Albuquerque
(
  'b7f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b', null, 'High Desert Inn',
  'A contemporary inn in the high desert of New Mexico, offering Southwestern hospitality and stunning sunsets.',
  '876 Central Avenue NE', 'Albuquerque', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@highdesertinn.com', '+1-505-555-0194', 'approved', 'Sunday', 1235,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', '87106', now(), now()
),

-- 24. Silicon Valley Suites - Fremont
(
  'c8a5b6c7-d8e9-0f1a-2b3c-4d5e6f7a8b9c', null, 'Silicon Valley Suites',
  'Modern extended-stay suites in the heart of Silicon Valley, perfect for tech professionals and entrepreneurs.',
  '123 Innovation Drive', 'Fremont', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@siliconvalleysuites.com', '+1-510-555-0171', 'approved', 'Monday', 1235,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '94538', now(), now()
),

-- 25. Historic Charleston Inn - Charleston, South Carolina
(
  'd9b6c7d8-e9f0-1a2b-3c4d-5e6f7a8b9c0d', null, 'Historic Charleston Inn',
  'An elegant boutique inn in Charleston historic district, featuring antebellum architecture and Southern hospitality.',
  '58 Meeting Street', 'Charleston', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@historiccharlestoninn.com', '+1-843-555-0167', 'approved', 'Monday', 595,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', '29401', now(), now()
),

-- 26. Buckeye State Hotel - Columbus
(
  'e0c7d8e9-f0a1-2b3c-4d5e-6f7a8b9c0d1e', null, 'Buckeye State Hotel',
  'A classic hotel in Ohio''s capital city, celebrating Columbus''s rich history and vibrant culture.',
  '345 High Street', 'Columbus', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@buckeyestate.com', '+1-614-555-0148', 'approved', 'Sunday', 1235,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '43215', now(), now()
),

-- 27. Bluegrass Inn - Bowling Green
(
  'f1d8e9f0-a1b2-3c4d-5e6f-7a8b9c0d1e2f', null, 'Bluegrass Inn',
  'A charming inn celebrating Kentucky''s bluegrass heritage with Southern comfort and hospitality.',
  '567 State Street', 'Bowling Green', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@bluegrassinn.com', '+1-270-555-0162', 'approved', 'Monday', 1235,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', '42101', now(), now()
),

-- 28. Desert Springs Hotel - Tucson, Arizona
(
  'a2e9f0a1-b2c3-4d5e-6f7a-8b9c0d1e2f3a', null, 'Desert Springs Hotel',
  'A luxury desert resort in Tucson featuring natural hot springs and stunning Sonoran Desert views.',
  '789 East Speedway Boulevard', 'Tucson', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@desertsprings.com', '+1-520-555-0177', 'approved', 'Sunday', 1235,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', '85719', now(), now()
),

-- 29. Riverfront Hotel - Davenport
(
  'b3f0a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b', null, 'Riverfront Hotel',
  'A contemporary hotel along the Mississippi River, offering scenic riverfront views and modern amenities.',
  '234 River Drive', 'Davenport', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@riverfronthotel.com', '+1-563-555-0153', 'approved', 'Monday', 1235,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '52801', now(), now()
),

-- 30. Graduate Ann Arbor - Ann Arbor, Michigan
(
  'c4a1b2c3-d4e5-6f7a-8b9c-0d1e2f3a4b5c', null, 'Graduate Ann Arbor',
  'A stylish hotel celebrating University of Michigan traditions with collegiate charm and modern comfort.',
  '615 East Huron Street', 'Ann Arbor', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@graduateannarbor.com', '+1-734-555-0186', 'approved', 'Sunday', 638,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '48104', now(), now()
),

-- 31. Fairfield Inn & Suites Burlington
(
  'd5b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', null, 'Fairfield Inn & Suites Burlington',
  'A comfortable hotel in Burlington offering easy access to Lake Champlain and the Green Mountains.',
  '401 Dorset Street', 'Burlington', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@fairfieldburlington.com', '+1-802-555-0174', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '05403', now(), now()
),

-- 32. Hotel Galvez & Spa - Galveston, Texas
(
  'e6c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', null, 'Hotel Galvez & Spa',
  'A historic luxury hotel on Galveston Island, known as the "Queen of the Gulf" with elegant accommodations.',
  '2024 Seawall Boulevard', 'Galveston', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@hotelgalvez.com', '+1-409-555-0192', 'approved', 'Sunday', 638,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', '77550', now(), now()
),

-- 33. Hilton Garden Inn Portland Downtown
(
  'f7d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', null, 'Hilton Garden Inn Portland Downtown',
  'A modern downtown hotel in Portland''s Pearl District, within walking distance of major attractions.',
  '965 SW Salmon Street', 'Portland', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@hiltongardenportland.com', '+1-503-555-0165', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '97205', now(), now()
),

-- 34. Hotel Viking Newport - Newport, Rhode Island
(
  'a8e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', null, 'Hotel Viking Newport',
  'A historic luxury hotel in Newport offering elegant accommodations near the famous mansions.',
  '1 Bellevue Avenue', 'Newport', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@hotelviking.com', '+1-401-555-0181', 'approved', 'Sunday', 630,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', '02840', now(), now()
),

-- 35. Hotel Del Coronado - Coronado, California
(
  'b9f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', null, 'Hotel Del Coronado',
  'An iconic Victorian beachfront resort hotel, a National Historic Landmark on Coronado Beach.',
  '1500 Orange Avenue', 'Coronado', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@hoteldel.com', '+1-619-555-0197', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', '92118', now(), now()
),

-- 36. Coastal Breeze Inn - Carmel-by-the-Sea
(
  'c0a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', null, 'Coastal Breeze Inn',
  'A charming coastal retreat offering stunning ocean views and peaceful accommodations just steps from the beach.',
  '4th Avenue & Torres Street', 'Carmel-by-the-Sea', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@coastalbreezeinn.com', '+1-831-555-0125', 'approved', 'Monday', 425,
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', '93921', now(), now()
),

-- 37. Lakeside Retreat - Grand Rapids, Michigan
(
  'd1b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', null, 'Lakeside Retreat',
  'A peaceful lakefront property offering water activities and serene forest surroundings in Michigan lake country.',
  '1847 Golf Course Road', 'Grand Rapids', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@lakesideretreat.com', '+1-616-555-0189', 'approved', 'Saturday', 425,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', '49546', now(), now()
),

-- 38. Hotel Jackson Hole - Jackson, Mississippi
(
  'e2c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', null, 'Hotel Jackson Hole',
  'A modern hotel in Jackson, Mississippi offering Southern hospitality and convenient downtown location.',
  '567 Capitol Street', 'Jackson', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@hoteljacksonhole.com', '+1-601-555-0174', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '39201', now(), now()
),

-- 39. Hampton Inn Anchorage - Anchorage, Alaska
(
  'f3d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', null, 'Hampton Inn Anchorage',
  'A comfortable hotel in Anchorage offering easy access to Alaska''s wilderness and downtown attractions.',
  '4301 Credit Union Drive', 'Anchorage', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@hamptonanchorage.com', '+1-907-555-0183', 'approved', 'Sunday', 617,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '99503', now(), now()
),

-- 40. Hotel Charleston - Charleston, South Carolina
(
  'a4e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', null, 'Hotel Charleston',
  'A luxury hotel in Charleston''s historic downtown district offering refined Southern elegance.',
  '205 Meeting Street', 'Charleston', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@hotelcharleston.com', '+1-843-555-0195', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', '29401', now(), now()
),

-- 41. Hotel Bellwether Seattle - Seattle, Washington
(
  'b5f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', null, 'Hotel Bellwether Seattle',
  'A waterfront hotel in Seattle offering stunning views of Elliott Bay and easy access to Pike Place Market.',
  '2411 Alaskan Way', 'Seattle', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@hotelbellwether.com', '+1-206-555-0176', 'approved', 'Sunday', 630,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', '98121', now(), now()
),

-- 42. Aloft Phoenix Downtown - Phoenix, Arizona
(
  'c6a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', null, 'Aloft Phoenix Downtown',
  'A modern downtown hotel in Phoenix offering contemporary style and easy access to the city''s attractions.',
  '401 North 1st Street', 'Phoenix', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@aloftphoenix.com', '+1-602-555-0188', 'approved', 'Monday', 638,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '85004', now(), now()
),

-- 43. Hampton Inn & Suites Austin-Downtown - Austin, Texas
(
  'd7b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', null, 'Hampton Inn & Suites Austin-Downtown',
  'A comfortable downtown hotel in Austin with easy access to the music scene and local attractions.',
  '200 San Jacinto Boulevard', 'Austin', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@hamptonaustin.com', '+1-512-555-0196', 'approved', 'Sunday', 630,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', '78701', now(), now()
),

-- 44. Graduate Nashville - Nashville, Tennessee
(
  'e8c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', null, 'Graduate Nashville',
  'A stylish hotel in Nashville celebrating the city''s music heritage with contemporary accommodations.',
  '101 20th Avenue North', 'Nashville', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@graduatenashville.com', '+1-615-555-0192', 'approved', 'Monday', 630,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', '37203', now(), now()
),

-- 45. Hilton Virginia Beach Oceanfront - Virginia Beach
(
  'f9d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', null, 'Hilton Virginia Beach Oceanfront',
  'A beachfront hotel offering direct ocean access and stunning views of the Atlantic Ocean.',
  '3001 Atlantic Avenue', 'Virginia Beach', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@hiltonvb.com', '+1-757-555-0184', 'approved', 'Sunday', 893,
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', '23451', now(), now()
),

-- 46. Mountain View Lodge - Estes Park, Colorado (second location)
(
  'a0e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', null, 'Lakeside Retreat',
  'A peaceful lakefront property offering water activities and serene forest surroundings in Minnesota lake country.',
  '1847 Golf Course Road', 'Grand Rapids', '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@lakesideretreat.com', '+1-218-555-0189', 'approved', 'Saturday', 1875,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', '55744', now(), now()
);