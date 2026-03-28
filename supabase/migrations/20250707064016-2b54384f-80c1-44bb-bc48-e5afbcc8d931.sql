-- First, let's identify Hotel Diplomat to preserve it
DO $$ 
DECLARE
    diplomat_hotel_id uuid;
BEGIN
    -- Find Hotel Diplomat in Stockholm, Sweden
    SELECT id INTO diplomat_hotel_id 
    FROM hotels 
    WHERE name ILIKE '%diplomat%' 
    AND city ILIKE '%stockholm%' 
    AND country ILIKE '%sweden%'
    LIMIT 1;
    
    -- If Hotel Diplomat is found, proceed with cleanup
    IF diplomat_hotel_id IS NOT NULL THEN
        -- Delete related data for all hotels except Hotel Diplomat
        
        -- Delete hotel activities for other hotels
        DELETE FROM hotel_activities 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete hotel themes for other hotels
        DELETE FROM hotel_themes 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete hotel images for other hotels
        DELETE FROM hotel_images 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete hotel availability for other hotels
        DELETE FROM hotel_availability 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete hotel translations for other hotels
        DELETE FROM hotel_translations 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete bookings for other hotels
        DELETE FROM bookings 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete favorites for other hotels
        DELETE FROM favorites 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete reviews for other hotels
        DELETE FROM reviews 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete admin messages for other hotels
        DELETE FROM admin_messages 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete user notifications for other hotels
        DELETE FROM user_notifications 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete payments for other hotels
        DELETE FROM payments 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Delete user reports for other hotels
        DELETE FROM user_reports 
        WHERE hotel_id != diplomat_hotel_id;
        
        -- Finally, delete all hotels except Hotel Diplomat
        DELETE FROM hotels 
        WHERE id != diplomat_hotel_id;
        
        RAISE NOTICE 'Successfully preserved Hotel Diplomat (ID: %) and deleted all other hotels', diplomat_hotel_id;
    ELSE
        RAISE EXCEPTION 'Hotel Diplomat not found in Stockholm, Sweden. Aborting cleanup to prevent data loss.';
    END IF;
END $$;