-- Delete all hotel records and related data atomically
-- This will clean the hotels dataset completely

-- Delete hotel-related tables in correct order (child tables first)
DELETE FROM hotel_translations;
DELETE FROM hotel_activities; 
DELETE FROM hotel_themes;
DELETE FROM hotel_images;
DELETE FROM hotel_availability;
DELETE FROM availability_packages;

-- Finally delete the main hotels table
DELETE FROM hotels;

-- Note: UUIDs don't use sequences, so no sequence reset needed
-- Verify deletion with a count check
DO $$
DECLARE
  hotel_count INTEGER;
  images_count INTEGER;
  themes_count INTEGER;
  activities_count INTEGER;
  availability_count INTEGER;
  packages_count INTEGER;
  translations_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO hotel_count FROM hotels;
  SELECT COUNT(*) INTO images_count FROM hotel_images;
  SELECT COUNT(*) INTO themes_count FROM hotel_themes;
  SELECT COUNT(*) INTO activities_count FROM hotel_activities;
  SELECT COUNT(*) INTO availability_count FROM hotel_availability;
  SELECT COUNT(*) INTO packages_count FROM availability_packages;
  SELECT COUNT(*) INTO translations_count FROM hotel_translations;
  
  RAISE NOTICE 'Deletion complete. Remaining records:';
  RAISE NOTICE 'Hotels: %, Images: %, Themes: %, Activities: %, Availability: %, Packages: %, Translations: %', 
    hotel_count, images_count, themes_count, activities_count, availability_count, packages_count, translations_count;
    
  IF hotel_count > 0 OR images_count > 0 OR themes_count > 0 OR activities_count > 0 OR availability_count > 0 OR packages_count > 0 OR translations_count > 0 THEN
    RAISE EXCEPTION 'Deletion failed - records still exist';
  END IF;
END $$;