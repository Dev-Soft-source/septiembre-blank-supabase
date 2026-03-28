-- Update demo hotels with sacred pricing policy compliant packages

-- First, let's create a function to update availability packages with sacred pricing
CREATE OR REPLACE FUNCTION update_demo_hotel_packages()
RETURNS void AS $$
DECLARE
    hotel_record RECORD;
    package_record RECORD;
    stars INTEGER;
    max_double_8 INTEGER;
    max_double_15 INTEGER;
    max_double_22 INTEGER;
    max_double_29 INTEGER;
    max_individual_8 INTEGER;
    max_individual_15 INTEGER;
    max_individual_22 INTEGER;
    max_individual_29 INTEGER;
    demo_double_8 INTEGER;
    demo_double_15 INTEGER;
    demo_double_22 INTEGER;
    demo_double_29 INTEGER;
    demo_individual_8 INTEGER;
    demo_individual_15 INTEGER;
    demo_individual_22 INTEGER;
    demo_individual_29 INTEGER;
BEGIN
    -- Loop through all demo hotels (owner_id IS NULL)
    FOR hotel_record IN 
        SELECT id, name, category FROM hotels WHERE owner_id IS NULL
    LOOP
        -- Convert category to stars (ensure at least 3 stars)
        stars := GREATEST(hotel_record.category, 3);
        stars := LEAST(stars, 5); -- Cap at 5 stars
        
        -- Set sacred maximum prices per person based on stars
        IF stars = 3 THEN
            max_double_8 := 300; max_individual_8 := 450;
            max_double_15 := 550; max_individual_15 := 850;
            max_double_22 := 800; max_individual_22 := 1200;
            max_double_29 := 1000; max_individual_29 := 1500;
        ELSIF stars = 4 THEN
            max_double_8 := 425; max_individual_8 := 600;
            max_double_15 := 800; max_individual_15 := 1150;
            max_double_22 := 1100; max_individual_22 := 1650;
            max_double_29 := 1375; max_individual_29 := 2050;
        ELSE -- 5 stars
            max_double_8 := 500; max_individual_8 := 800;
            max_double_15 := 950; max_individual_15 := 1500;
            max_double_22 := 1500; max_individual_22 := 2200;
            max_double_29 := 1850; max_individual_29 := 2700;
        END IF;
        
        -- Calculate demo prices (75% of maximum, rounded to sacred rules)
        demo_double_8 := CASE 
            WHEN (max_double_8 * 0.75)::INTEGER % 10 <= 2 THEN (max_double_8 * 0.75)::INTEGER - ((max_double_8 * 0.75)::INTEGER % 10)
            WHEN (max_double_8 * 0.75)::INTEGER % 10 <= 6 THEN (max_double_8 * 0.75)::INTEGER + (5 - ((max_double_8 * 0.75)::INTEGER % 10))
            ELSE (max_double_8 * 0.75)::INTEGER + (9 - ((max_double_8 * 0.75)::INTEGER % 10))
        END;
        
        demo_double_15 := CASE 
            WHEN (max_double_15 * 0.75)::INTEGER % 10 <= 2 THEN (max_double_15 * 0.75)::INTEGER - ((max_double_15 * 0.75)::INTEGER % 10)
            WHEN (max_double_15 * 0.75)::INTEGER % 10 <= 6 THEN (max_double_15 * 0.75)::INTEGER + (5 - ((max_double_15 * 0.75)::INTEGER % 10))
            ELSE (max_double_15 * 0.75)::INTEGER + (9 - ((max_double_15 * 0.75)::INTEGER % 10))
        END;
        
        demo_double_22 := CASE 
            WHEN (max_double_22 * 0.75)::INTEGER % 10 <= 2 THEN (max_double_22 * 0.75)::INTEGER - ((max_double_22 * 0.75)::INTEGER % 10)
            WHEN (max_double_22 * 0.75)::INTEGER % 10 <= 6 THEN (max_double_22 * 0.75)::INTEGER + (5 - ((max_double_22 * 0.75)::INTEGER % 10))
            ELSE (max_double_22 * 0.75)::INTEGER + (9 - ((max_double_22 * 0.75)::INTEGER % 10))
        END;
        
        demo_double_29 := CASE 
            WHEN (max_double_29 * 0.75)::INTEGER % 10 <= 2 THEN (max_double_29 * 0.75)::INTEGER - ((max_double_29 * 0.75)::INTEGER % 10)
            WHEN (max_double_29 * 0.75)::INTEGER % 10 <= 6 THEN (max_double_29 * 0.75)::INTEGER + (5 - ((max_double_29 * 0.75)::INTEGER % 10))
            ELSE (max_double_29 * 0.75)::INTEGER + (9 - ((max_double_29 * 0.75)::INTEGER % 10))
        END;
        
        demo_individual_8 := CASE 
            WHEN (max_individual_8 * 0.75)::INTEGER % 10 <= 2 THEN (max_individual_8 * 0.75)::INTEGER - ((max_individual_8 * 0.75)::INTEGER % 10)
            WHEN (max_individual_8 * 0.75)::INTEGER % 10 <= 6 THEN (max_individual_8 * 0.75)::INTEGER + (5 - ((max_individual_8 * 0.75)::INTEGER % 10))
            ELSE (max_individual_8 * 0.75)::INTEGER + (9 - ((max_individual_8 * 0.75)::INTEGER % 10))
        END;
        
        demo_individual_15 := CASE 
            WHEN (max_individual_15 * 0.75)::INTEGER % 10 <= 2 THEN (max_individual_15 * 0.75)::INTEGER - ((max_individual_15 * 0.75)::INTEGER % 10)
            WHEN (max_individual_15 * 0.75)::INTEGER % 10 <= 6 THEN (max_individual_15 * 0.75)::INTEGER + (5 - ((max_individual_15 * 0.75)::INTEGER % 10))
            ELSE (max_individual_15 * 0.75)::INTEGER + (9 - ((max_individual_15 * 0.75)::INTEGER % 10))
        END;
        
        demo_individual_22 := CASE 
            WHEN (max_individual_22 * 0.75)::INTEGER % 10 <= 2 THEN (max_individual_22 * 0.75)::INTEGER - ((max_individual_22 * 0.75)::INTEGER % 10)
            WHEN (max_individual_22 * 0.75)::INTEGER % 10 <= 6 THEN (max_individual_22 * 0.75)::INTEGER + (5 - ((max_individual_22 * 0.75)::INTEGER % 10))
            ELSE (max_individual_22 * 0.75)::INTEGER + (9 - ((max_individual_22 * 0.75)::INTEGER % 10))
        END;
        
        demo_individual_29 := CASE 
            WHEN (max_individual_29 * 0.75)::INTEGER % 10 <= 2 THEN (max_individual_29 * 0.75)::INTEGER - ((max_individual_29 * 0.75)::INTEGER % 10)
            WHEN (max_individual_29 * 0.75)::INTEGER % 10 <= 6 THEN (max_individual_29 * 0.75)::INTEGER + (5 - ((max_individual_29 * 0.75)::INTEGER % 10))
            ELSE (max_individual_29 * 0.75)::INTEGER + (9 - ((max_individual_29 * 0.75)::INTEGER % 10))
        END;
        
        -- Delete existing packages for this hotel
        DELETE FROM availability_packages WHERE hotel_id = hotel_record.id;
        
        -- Create new packages with sacred pricing (8, 15, 22, 29 days)
        -- Double occupancy packages
        INSERT INTO availability_packages 
        (hotel_id, start_date, end_date, duration_days, total_rooms, available_rooms, occupancy_mode, base_price_usd, current_price_usd)
        VALUES 
        (hotel_record.id, '2024-01-01', '2024-01-09', 8, 10, 8, 'double', demo_double_8, demo_double_8),
        (hotel_record.id, '2024-01-15', '2024-01-30', 15, 10, 8, 'double', demo_double_15, demo_double_15),
        (hotel_record.id, '2024-02-01', '2024-02-23', 22, 10, 8, 'double', demo_double_22, demo_double_22),
        (hotel_record.id, '2024-03-01', '2024-03-30', 29, 10, 8, 'double', demo_double_29, demo_double_29);
        
        -- Single occupancy packages  
        INSERT INTO availability_packages 
        (hotel_id, start_date, end_date, duration_days, total_rooms, available_rooms, occupancy_mode, base_price_usd, current_price_usd)
        VALUES 
        (hotel_record.id, '2024-04-01', '2024-04-09', 8, 5, 4, 'single', demo_individual_8, demo_individual_8),
        (hotel_record.id, '2024-04-15', '2024-04-30', 15, 5, 4, 'single', demo_individual_15, demo_individual_15),
        (hotel_record.id, '2024-05-01', '2024-05-23', 22, 5, 4, 'single', demo_individual_22, demo_individual_22),
        (hotel_record.id, '2024-05-01', '2024-05-30', 29, 5, 4, 'single', demo_individual_29, demo_individual_29);
        
        -- Update hotel's price_per_month to reflect the lowest monthly per person rate
        UPDATE hotels 
        SET price_per_month = demo_double_29
        WHERE id = hotel_record.id;
        
        RAISE NOTICE 'Updated hotel % (% stars) with sacred pricing packages', hotel_record.name, stars;
    END LOOP;
    
    RAISE NOTICE 'Sacred pricing policy applied to all demo hotels successfully!';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update all demo hotels
SELECT update_demo_hotel_packages();

-- Drop the function as it's no longer needed
DROP FUNCTION update_demo_hotel_packages();