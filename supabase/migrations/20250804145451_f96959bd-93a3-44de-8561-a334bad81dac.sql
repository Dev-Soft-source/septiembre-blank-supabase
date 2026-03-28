-- Complete cleanup of all activities data
-- Delete all activities from filters table
DELETE FROM public.filters WHERE category = 'activities';

-- Delete all records from activities table  
DELETE FROM public.activities;

-- Delete all hotel_activities relationships
DELETE FROM public.hotel_activities;

-- Verify cleanup completion
DO $$
DECLARE
    filters_count INTEGER;
    activities_count INTEGER;
    hotel_activities_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO filters_count FROM public.filters WHERE category = 'activities';
    SELECT COUNT(*) INTO activities_count FROM public.activities;
    SELECT COUNT(*) INTO hotel_activities_count FROM public.hotel_activities;
    
    RAISE LOG 'Cleanup verification - Filters (activities): %, Activities: %, Hotel_activities: %', 
        filters_count, activities_count, hotel_activities_count;
        
    IF filters_count = 0 AND activities_count = 0 AND hotel_activities_count = 0 THEN
        RAISE LOG 'SUCCESS: Complete cleanup verified - zero activity entries remain';
    ELSE
        RAISE WARNING 'WARNING: Cleanup incomplete - some activity data still exists';
    END IF;
END $$;