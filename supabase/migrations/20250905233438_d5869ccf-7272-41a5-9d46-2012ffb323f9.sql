-- Add the missing 26 hotels from the original 46 hotel list
-- (20 hotels were already restored in previous migrations)

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
-- Garden District Hotel - Shreveport
(
  'f8b9d2c1-4a6e-4f2c-8b7a-9d3e5f7a8b2c',
  null,
  'Garden District Hotel',
  'An elegant hotel in Shreveport''s historic Garden District, offering Southern charm and modern amenities.',
  '423 Market Street',
  'Shreveport',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@gardendistrict.com',
  '+1-318-555-0142',
  'approved',
  'Monday',
  1235,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '71101',
  now(),
  now()
),

-- Pine Forest Retreat - Augusta  
(
  'a7c8e1f3-5b9d-4e2a-9f6c-8a1b3d5e7f9a',
  null,
  'Pine Forest Retreat',
  'A peaceful retreat surrounded by pine forests, perfect for nature lovers seeking tranquility.',
  '892 Forest Trail Road',
  'Augusta',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@pineforestretreat.com',
  '+1-207-555-0167',
  'approved',
  'Sunday',
  1235,
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
  '04330',
  now(),
  now()
),

-- Big Sky Urban Lodge - Billings, Montana
(
  'b2d4f6a8-7c9e-4f1b-8a5d-6b8c1e3f5a7b',
  null,
  'Big Sky Urban Lodge',
  'A modern urban lodge in Billings with stunning views of the Montana sky and easy access to city attractions.',
  '567 North Broadway',
  'Billings',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@bigskyurban.com',
  '+1-406-555-0198',
  'approved',
  'Monday',
  823,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  '59101',
  now(),
  now()
),

-- Capitol View Inn - Madison, Wisconsin
(
  'c3e5f7b9-8d1a-4f2c-9b6e-7c9a2d4f6b8c',
  null,
  'Capitol View Inn',
  'A charming inn with views of the Wisconsin State Capitol, located in the heart of Madison.',
  '789 State Street',
  'Madison',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@capitolviewinn.com',
  '+1-608-555-0156',
  'approved',
  'Monday',
  617,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '53703',
  now(),
  now()
),

-- Tropical Winds Resort - Key West, Florida
(
  'd4f6a8c1-9e2b-4f3d-8a7c-8b1d3e5f7a9b',
  null,
  'Tropical Winds Resort',
  'A tropical paradise resort in Key West offering luxury accommodations with ocean views and island charm.',
  '234 Duval Street',
  'Key West',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@tropicalwinds.com',
  '+1-305-555-0189',
  'approved',
  'Sunday',
  893,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '33040',
  now(),
  now()
),

-- Wasatch Mountain View Hotel - Salt Lake City, Utah  
(
  'e5f7b9d2-1a3c-4f4e-9b8a-9c2d4e6f8a1b',
  null,
  'Wasatch Mountain View Hotel',
  'A luxury hotel with breathtaking views of the Wasatch Mountains, perfect for outdoor enthusiasts.',
  '456 South Temple Street',
  'Salt Lake City',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@wasatchview.com',
  '+1-801-555-0173',
  'approved',
  'Monday',
  893,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
  '84111',
  now(),
  now()
),

-- Blue Ridge Mountain Lodge - Asheville, North Carolina
(
  'f6a8c1e3-2b4d-4f5f-8a9c-1a3c5d7e9f2b',
  null,
  'Blue Ridge Mountain Lodge',
  'A rustic mountain lodge nestled in the Blue Ridge Mountains, offering authentic Appalachian hospitality.',
  '678 Tunnel Road',
  'Asheville',  
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@blueridgelodge.com',
  '+1-828-555-0164',
  'approved',
  'Sunday',
  893,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
  '28805',
  now(),
  now()
),

-- Gulf Coast Heritage Inn - Mobile, Alabama
(
  'a7b9d2f4-3c5e-4f6a-9b1d-2b4d6e8f1a3c',
  null,
  'Gulf Coast Heritage Inn',
  'A historic inn celebrating Mobile''s rich Gulf Coast heritage with antebellum architecture and Southern hospitality.',
  '321 Government Street',
  'Mobile',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56', 
  'reservations@gulfcoastheritage.com',
  '+1-251-555-0187',
  'approved',
  'Monday',
  893,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  '36602',
  now(),
  now()
),

-- Riverside Park Hotel - Spokane, Washington
(
  'b8c1e4f6-4d6a-4f7b-8a2e-3c5d7e9f2a4b',
  null,
  'Riverside Park Hotel',  
  'A modern hotel overlooking the Spokane River, featuring contemporary amenities and scenic park views.',
  '789 West Spokane Falls Boulevard',
  'Spokane',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@riversidepark.com',
  '+1-509-555-0143',
  'approved',
  'Monday',
  630,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
  '99201',
  now(),
  now()
),

-- Hampton Inn Providence Downtown
(
  'c9d2f5a7-5e7b-4f8c-9b3f-4d6e8f1a2c5d',
  null,
  'Hampton Inn Providence Downtown',
  'A comfortable downtown hotel in Providence''s historic district, walking distance to major attractions.',
  '101 West Exchange Street',
  'Providence', 
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@hamptonprovidence.com',
  '+1-401-555-0156',
  'approved',
  'Monday',
  617,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '02903',
  now(),
  now()
),

-- Prairie Wind Hotel - Grand Forks
(
  'd1e3f6a8-6f8c-4f9d-8a4a-5e7f9a2b3d6e',
  null,
  'Prairie Wind Hotel',
  'A contemporary hotel on the Great Plains, offering Midwestern hospitality and modern comfort.',
  '567 North Washington Street',
  'Grand Forks',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@prairiewind.com',
  '+1-701-555-0172',
  'approved',
  'Sunday',
  1235,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '58201',
  now(),
  now()
),

-- Foothills View Hotel - Boise, Idaho
(
  'e2f4a7b9-7a9d-4f1e-9b5b-6f8a1b4c6d8f',
  null,
  'Foothills View Hotel',
  'A modern hotel with panoramic views of the Boise Foothills, perfect for outdoor adventurers.',
  '890 West Idaho Street',
  'Boise',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@foothillsview.com',
  '+1-208-555-0185',
  'approved',
  'Monday',
  617,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
  '83702',
  now(),
  now()
),

-- Adobe Hills Inn - Santa Fe, New Mexico
(
  'f3e5b8c1-8b1e-4f2f-8a6c-7a9b2c5d7e9a',
  null,
  'Adobe Hills Inn',
  'A southwestern-style inn featuring traditional adobe architecture and authentic New Mexican charm.',
  '432 Old Santa Fe Trail',
  'Santa Fe',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@adobehills.com',
  '+1-505-555-0168',
  'approved',
  'Sunday',
  893,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '87501',
  now(),
  now()
),

-- Steel City Lodge - Pittsburgh  
(
  'a4f6c9e2-9c2f-4f3a-9b7d-8b1c4d6e8f1a',
  null,
  'Steel City Lodge',
  'A industrial-chic lodge celebrating Pittsburgh''s steel heritage with modern amenities and city views.',
  '654 Liberty Avenue',
  'Pittsburgh',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56', 
  'reservations@steelcitylodge.com',
  '+1-412-555-0159',
  'approved',
  'Monday',
  1235,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  '15222',
  now(),
  now()
),

-- High Desert Inn - Albuquerque
(
  'b5a7d1f3-1d3a-4f4b-8a8e-9c2d5e7f9a2b',
  null,
  'High Desert Inn',
  'A contemporary inn in the high desert of New Mexico, offering Southwestern hospitality and stunning sunsets.',
  '876 Central Avenue NE',
  'Albuquerque',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@highdesertinn.com',
  '+1-505-555-0194',
  'approved',
  'Sunday',
  1235,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '87106',
  now(),
  now()
),

-- Silicon Valley Suites - Fremont
(
  'c6b8e2f4-2e4b-4f5c-9b9f-1a3d6e8f1a4c',
  null,
  'Silicon Valley Suites',
  'Modern extended-stay suites in the heart of Silicon Valley, perfect for tech professionals and entrepreneurs.',
  '123 Innovation Drive',
  'Fremont',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@siliconvalleysuites.com',
  '+1-510-555-0171',
  'approved',
  'Monday',
  1235,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '94538',
  now(),
  now()
),

-- Buckeye State Hotel - Columbus  
(
  'd7c9f3a5-3f5c-4f6d-8a1a-2b4d7e9f2a5c',
  null,
  'Buckeye State Hotel',
  'A classic hotel in Ohio''s capital city, celebrating Columbus''s rich history and vibrant culture.',
  '345 High Street',
  'Columbus',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@buckeyestate.com',
  '+1-614-555-0148',
  'approved',
  'Sunday',
  1235,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
  '43215',
  now(),
  now()
),

-- Bluegrass Inn - Bowling Green
(
  'e8d1a4f6-4a6d-4f7e-9b2b-3c5d8e1f3a6d',
  null,
  'Bluegrass Inn',
  'A charming inn celebrating Kentucky''s bluegrass heritage with Southern comfort and hospitality.',
  '567 State Street',
  'Bowling Green',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@bluegrassinn.com',
  '+1-270-555-0162',
  'approved',
  'Monday',
  1235,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  '42101',
  now(),
  now()
),

-- Desert Springs Hotel - Tucson, Arizona
(
  'f9e2b5a7-5b7e-4f8f-8a3c-4d6e9f2a4b7d',
  null,
  'Desert Springs Hotel',
  'A luxury desert resort in Tucson featuring natural hot springs and stunning Sonoran Desert views.',
  '789 East Speedway Boulevard',
  'Tucson',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@desertsprings.com',
  '+1-520-555-0177',
  'approved',
  'Sunday',
  1235,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '85719',
  now(),
  now()
),

-- Riverfront Hotel - Davenport
(
  'a1f3c6b8-6c8f-4f9a-9b4d-5e7f1a3b5c8e',
  null,
  'Riverfront Hotel',
  'A contemporary hotel along the Mississippi River, offering scenic riverfront views and modern amenities.',
  '234 River Drive',
  'Davenport',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@riverfronthotel.com',
  '+1-563-555-0153',
  'approved',
  'Monday',
  1235,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
  '52801',
  now(),
  now()
),

-- Graduate Ann Arbor - Ann Arbor, Michigan
(
  'b2a4d7c9-7d9a-4f1b-8a5e-6f8a2b4c6d9f',
  null,
  'Graduate Ann Arbor',
  'A stylish hotel celebrating University of Michigan traditions with collegiate charm and modern comfort.',
  '615 East Huron Street',
  'Ann Arbor',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@graduateannarbor.com',
  '+1-734-555-0186',
  'approved',
  'Sunday',
  638,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '48104',
  now(),
  now()
),

-- Fairfield Inn & Suites Burlington - Burlington, Vermont
(
  'c3b5e8d1-8e1b-4f2c-9b6f-7a9b3c5d8e2a',
  null,
  'Fairfield Inn & Suites Burlington',
  'A comfortable hotel in Burlington offering easy access to Lake Champlain and the Green Mountains.',
  '401 Dorset Street', 
  'Burlington',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@fairfieldburlington.com',
  '+1-802-555-0174',
  'approved',
  'Monday',
  630,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
  '05403',
  now(),
  now()
),

-- Hotel Galvez & Spa - Galveston, Texas
(
  'd4c6f9e2-9f2c-4f3d-8a7a-8b1d4c6e9f3b',
  null,
  'Hotel Galvez & Spa',
  'A historic luxury hotel on Galveston Island, known as the "Queen of the Gulf" with elegant accommodations.',
  '2024 Seawall Boulevard',
  'Galveston',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@hotelgalvez.com',
  '+1-409-555-0192',
  'approved',
  'Sunday',
  638,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  '77550',
  now(),
  now()
),

-- Hilton Garden Inn Portland Downtown
(
  'e5d7a1f3-1a3d-4f4e-9b8b-9c2e5d7f1a4c',
  null,
  'Hilton Garden Inn Portland Downtown',
  'A modern downtown hotel in Portland''s Pearl District, within walking distance of major attractions.',
  '965 SW Salmon Street',
  'Portland',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'info@hiltongardenportland.com',
  '+1-503-555-0165',
  'approved',
  'Monday',
  630,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '97205',
  now(),
  now()
),

-- Hotel Viking Newport - Newport, Rhode Island
(
  'f6e8b2c4-2b4e-4f5f-8a9c-1a3c6d8e2a5d',
  null,
  'Hotel Viking Newport',
  'A historic luxury hotel in Newport offering elegant accommodations near the famous mansions.',
  '1 Bellevue Avenue',
  'Newport',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'stay@hotelviking.com',
  '+1-401-555-0181',
  'approved',
  'Sunday',
  630,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  '02840',
  now(),
  now()
),

-- Hotel Del Coronado - Coronado, California  
(
  'a7f9c3e5-3c5f-4f6a-9b1d-2b4d7e9a3b6d',
  null,
  'Hotel Del Coronado',
  'An iconic Victorian beachfront resort hotel, a National Historic Landmark on Coronado Beach.',
  '1500 Orange Avenue',
  'Coronado',
  '13c879cf-76ec-4956-a4fd-ea8b1053aa56',
  'reservations@hoteldel.com',
  '+1-619-555-0197',
  'approved',
  'Monday',
  630,
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  '92118',
  now(),
  now()
);