-- Fix missing themes and activities for all existing hotels
DO $$
DECLARE
    hotel_record RECORD;
    theme_record RECORD;
    activity_record RECORD;
    theme_ids UUID[];
    activity_ids UUID[];
    hotel_index INTEGER := 0;
BEGIN
    -- Get all themes and activities
    SELECT array_agg(id) INTO theme_ids FROM themes WHERE level = 1;
    SELECT array_agg(id) INTO activity_ids FROM activities;
    
    -- Loop through hotels without themes or activities
    FOR hotel_record IN 
        SELECT h.id, h.name
        FROM hotels h
        WHERE h.status = 'approved'
        AND (
            NOT EXISTS (SELECT 1 FROM hotel_themes WHERE hotel_id = h.id)
            OR NOT EXISTS (SELECT 1 FROM hotel_activities WHERE hotel_id = h.id)
        )
    LOOP
        hotel_index := hotel_index + 1;
        
        RAISE NOTICE 'Processing hotel: % (index: %)', hotel_record.name, hotel_index;
        
        -- Delete existing themes/activities to ensure clean state
        DELETE FROM hotel_themes WHERE hotel_id = hotel_record.id;
        DELETE FROM hotel_activities WHERE hotel_id = hotel_record.id;
        
        -- Assign 3 themes using rotation for variety
        FOR i IN 1..3 LOOP
            INSERT INTO hotel_themes (hotel_id, theme_id)
            VALUES (
                hotel_record.id,
                theme_ids[((hotel_index + i - 1) % array_length(theme_ids, 1)) + 1]
            );
        END LOOP;
        
        -- Assign 4 activities using rotation for variety  
        FOR i IN 1..4 LOOP
            INSERT INTO hotel_activities (hotel_id, activity_id)
            VALUES (
                hotel_record.id,
                activity_ids[((hotel_index + i - 1) % array_length(activity_ids, 1)) + 1]
            );
        END LOOP;
        
        RAISE NOTICE 'Assigned themes and activities to hotel: %', hotel_record.name;
    END LOOP;
    
    RAISE NOTICE 'Completed assignment for % hotels', hotel_index;
END $$;