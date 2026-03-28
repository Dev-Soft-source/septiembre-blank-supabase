-- Remove Casino District Hotel completely from the database
-- First delete all related records to avoid foreign key constraints

-- Delete hotel themes
DELETE FROM hotel_themes WHERE hotel_id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';

-- Delete hotel activities  
DELETE FROM hotel_activities WHERE hotel_id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';

-- Delete hotel images
DELETE FROM hotel_images WHERE hotel_id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';

-- Delete availability packages
DELETE FROM availability_packages WHERE hotel_id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';

-- Delete any bookings (if any exist)
DELETE FROM bookings WHERE hotel_id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';

-- Delete any favorites
DELETE FROM favorites WHERE hotel_id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';

-- Finally delete the main hotel record
DELETE FROM hotels WHERE id = '2f863d47-3480-483f-b39d-e4ecaa629f7a';