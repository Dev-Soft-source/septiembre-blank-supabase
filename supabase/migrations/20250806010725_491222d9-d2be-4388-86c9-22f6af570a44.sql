-- Update existing US hotels with complete content and trigger translations
DO $$
DECLARE
  hotel_record RECORD;
  content_data JSONB;
BEGIN
  RAISE LOG 'Starting existing US hotels content update and translation...';
  
  -- Loop through all existing US hotels
  FOR hotel_record IN 
    SELECT id, name, city, address, country
    FROM public.hotels 
    WHERE country = 'USA' 
    AND status = 'approved'
    AND (ideal_guests IS NULL OR atmosphere IS NULL OR perfect_location IS NULL)
  LOOP
    RAISE LOG 'Updating content for hotel: % (ID: %)', hotel_record.name, hotel_record.id;
    
    -- Generate rich content based on city
    UPDATE public.hotels 
    SET 
      ideal_guests = CASE 
        WHEN hotel_record.city = 'Boise' THEN 'Young professionals and outdoor enthusiasts seeking urban amenities with easy access to nature'
        WHEN hotel_record.city = 'Tucson' THEN 'Wellness travelers, cultural explorers, and winter residents attracted to desert landscapes'
        WHEN hotel_record.city = 'Little Rock' THEN 'Business travelers, government officials, and visitors exploring Arkansas heritage'
        WHEN hotel_record.city = 'Wilmington' THEN 'Beach lovers, history buffs, and families enjoying coastal Carolina charm'
        WHEN hotel_record.city = 'Missoula' THEN 'Adventure seekers, university visitors, and nature lovers exploring Big Sky country'
        WHEN hotel_record.city = 'Grand Forks' THEN 'Business travelers, university families, and visitors to the Red River Valley'
        WHEN hotel_record.city = 'Bowling Green' THEN 'Country music fans, university visitors, and travelers exploring Kentucky traditions'
        WHEN hotel_record.city = 'Davenport' THEN 'River enthusiasts, business travelers, and families exploring the Mississippi River region'
        WHEN hotel_record.city = 'Shreveport' THEN 'Cultural travelers, casino visitors, and guests enjoying Southern Louisiana hospitality'
        WHEN hotel_record.city = 'Augusta' THEN 'Government visitors, nature lovers, and guests seeking Maine natural beauty'
        WHEN hotel_record.city = 'Atlantic City' THEN 'Entertainment seekers, business travelers, and visitors enjoying boardwalk attractions'
        WHEN hotel_record.city = 'Albuquerque' THEN 'Cultural explorers, art enthusiasts, and travelers experiencing Southwestern culture'
        WHEN hotel_record.city = 'Fremont' THEN 'Tech professionals, business travelers, and visitors to Silicon Valley'
        WHEN hotel_record.city = 'Columbus' THEN 'University visitors, business travelers, and guests exploring Ohio capital city'
        WHEN hotel_record.city = 'Pittsburgh' THEN 'Business travelers, sports fans, and visitors exploring the Steel City renaissance'
        ELSE 'Travelers seeking comfortable accommodations and local experiences'
      END,
      atmosphere = CASE 
        WHEN hotel_record.city = 'Boise' THEN 'Relaxed mountain-town atmosphere with modern amenities and outdoor accessibility'
        WHEN hotel_record.city = 'Tucson' THEN 'Tranquil desert ambiance with Southwest charm and wellness-focused environment'
        WHEN hotel_record.city = 'Little Rock' THEN 'Professional business atmosphere with Southern hospitality and Arkansas warmth'
        WHEN hotel_record.city = 'Wilmington' THEN 'Coastal casual atmosphere with historic charm and beachside relaxation'
        WHEN hotel_record.city = 'Missoula' THEN 'Mountain lodge atmosphere with rustic elegance and outdoor adventure spirit'
        WHEN hotel_record.city = 'Grand Forks' THEN 'Friendly Midwestern atmosphere with prairie views and community warmth'
        WHEN hotel_record.city = 'Bowling Green' THEN 'Classic Southern atmosphere with bluegrass charm and Kentucky hospitality'
        WHEN hotel_record.city = 'Davenport' THEN 'Historic riverfront atmosphere with Midwestern charm and scenic river views'
        WHEN hotel_record.city = 'Shreveport' THEN 'Vibrant Southern atmosphere with Louisiana culture and entertainment energy'
        WHEN hotel_record.city = 'Augusta' THEN 'Peaceful New England atmosphere with natural beauty and governmental sophistication'
        WHEN hotel_record.city = 'Atlantic City' THEN 'Exciting boardwalk atmosphere with entertainment energy and coastal excitement'
        WHEN hotel_record.city = 'Albuquerque' THEN 'High desert atmosphere with Southwest mystique and artistic inspiration'
        WHEN hotel_record.city = 'Fremont' THEN 'Tech-forward atmosphere with Silicon Valley innovation and modern business amenities'
        WHEN hotel_record.city = 'Columbus' THEN 'Collegiate atmosphere with urban energy and Ohio State University proximity'
        WHEN hotel_record.city = 'Pittsburgh' THEN 'Industrial heritage atmosphere with modern renaissance and steel city pride'
        ELSE 'Comfortable and welcoming atmosphere with local character'
      END,
      perfect_location = CASE 
        WHEN hotel_record.city = 'Boise' THEN 'Perfect for exploring Idaho capital attractions, Boise River activities, and accessing nearby mountain recreation'
        WHEN hotel_record.city = 'Tucson' THEN 'Ideal for visiting Sonoran Desert attractions, cultural sites, and enjoying year-round outdoor activities'
        WHEN hotel_record.city = 'Little Rock' THEN 'Excellent for government business, Arkansas River activities, and exploring state capital attractions'
        WHEN hotel_record.city = 'Wilmington' THEN 'Perfect for beach access, historic downtown exploration, and coastal North Carolina experiences'
        WHEN hotel_record.city = 'Missoula' THEN 'Ideal for university visits, outdoor recreation, and exploring Montana natural wilderness'
        WHEN hotel_record.city = 'Grand Forks' THEN 'Great for university business, Red River Valley exploration, and experiencing North Dakota hospitality'
        WHEN hotel_record.city = 'Bowling Green' THEN 'Perfect for Kentucky tourism, bluegrass culture, and accessing Nashville attractions'
        WHEN hotel_record.city = 'Davenport' THEN 'Excellent for Mississippi River activities, business travel, and exploring Quad Cities area'
        WHEN hotel_record.city = 'Shreveport' THEN 'Ideal for entertainment venues, Louisiana culture, and business in northwest Louisiana'
        WHEN hotel_record.city = 'Augusta' THEN 'Perfect for government visits, Maine outdoor activities, and exploring New England charm'
        WHEN hotel_record.city = 'Atlantic City' THEN 'Ideal for boardwalk entertainment, gaming, and experiencing classic American resort culture'
        WHEN hotel_record.city = 'Albuquerque' THEN 'Perfect for Southwest cultural exploration, art districts, and New Mexico unique high desert landscape'
        WHEN hotel_record.city = 'Fremont' THEN 'Excellent for Silicon Valley business, tech industry access, and Bay Area exploration'
        WHEN hotel_record.city = 'Columbus' THEN 'Ideal for Ohio State University visits, state government business, and central Ohio exploration'
        WHEN hotel_record.city = 'Pittsburgh' THEN 'Perfect for business travel, sports venues, and exploring Pennsylvania cultural renaissance'
        ELSE 'Conveniently located for exploring local attractions and business activities'
      END,
      updated_at = now()
    WHERE id = hotel_record.id;
    
  END LOOP;
  
  RAISE LOG 'Completed existing US hotels content update';
END $$;