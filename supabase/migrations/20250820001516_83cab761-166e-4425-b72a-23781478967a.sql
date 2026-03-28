-- Update demo hotels with sacred pricing policy - simplified approach
-- Remove existing packages and add new ones with proper future dates

-- First, delete all existing packages for demo hotels to start fresh
DELETE FROM availability_packages 
WHERE hotel_id IN (SELECT id FROM hotels WHERE owner_id IS NULL);

-- Now add sacred pricing compliant packages for each demo hotel
DO $$
DECLARE
    hotel_record RECORD;
    star_category INTEGER;
    demo_prices RECORD;
BEGIN
    -- Loop through all demo hotels
    FOR hotel_record IN 
        SELECT id, name, category FROM hotels WHERE owner_id IS NULL
    LOOP
        -- Determine star category (3, 4, or 5)
        star_category := GREATEST(LEAST(hotel_record.category, 5), 3);
        
        -- Calculate demo prices (75% of sacred maximums with proper rounding)
        CASE star_category
            WHEN 3 THEN
                demo_prices := ROW(225, 410, 600, 750, 340, 640, 900, 1125);  -- 75% of 3-star maximums, rounded to 0/5/9
            WHEN 4 THEN 
                demo_prices := ROW(320, 600, 825, 1030, 450, 865, 1240, 1540); -- 75% of 4-star maximums, rounded to 0/5/9
            ELSE -- 5 stars
                demo_prices := ROW(375, 715, 1125, 1390, 600, 1125, 1650, 2025); -- 75% of 5-star maximums, rounded to 0/5/9
        END CASE;
        
        -- Insert double occupancy packages (future dates)
        INSERT INTO availability_packages 
        (hotel_id, start_date, end_date, duration_days, total_rooms, available_rooms, occupancy_mode, base_price_usd, current_price_usd)
        VALUES 
        -- 8 days double
        (hotel_record.id, '2025-01-15', '2025-01-23', 8, 10, 8, 'double', demo_prices.f1, demo_prices.f1),
        -- 15 days double  
        (hotel_record.id, '2025-02-01', '2025-02-16', 15, 10, 8, 'double', demo_prices.f2, demo_prices.f2),
        -- 22 days double
        (hotel_record.id, '2025-03-01', '2025-03-23', 22, 10, 8, 'double', demo_prices.f3, demo_prices.f3),
        -- 29 days double
        (hotel_record.id, '2025-04-01', '2025-04-30', 29, 10, 8, 'double', demo_prices.f4, demo_prices.f4);
        
        -- Insert single occupancy packages  
        INSERT INTO availability_packages 
        (hotel_id, start_date, end_date, duration_days, total_rooms, available_rooms, occupancy_mode, base_price_usd, current_price_usd)
        VALUES 
        -- 8 days single
        (hotel_record.id, '2025-05-01', '2025-05-09', 8, 5, 4, 'single', demo_prices.f5, demo_prices.f5),
        -- 15 days single
        (hotel_record.id, '2025-06-01', '2025-06-16', 15, 5, 4, 'single', demo_prices.f6, demo_prices.f6),
        -- 22 days single
        (hotel_record.id, '2025-07-01', '2025-07-23', 22, 5, 4, 'single', demo_prices.f7, demo_prices.f7),
        -- 29 days single
        (hotel_record.id, '2025-08-01', '2025-08-30', 29, 5, 4, 'single', demo_prices.f8, demo_prices.f8);
        
        -- Update hotel's price_per_month to reflect the lowest monthly per person rate (29-day double)
        UPDATE hotels 
        SET price_per_month = demo_prices.f4
        WHERE id = hotel_record.id;
        
        RAISE NOTICE 'Updated hotel % (% stars) with sacred pricing packages', hotel_record.name, star_category;
    END LOOP;
    
    RAISE NOTICE 'Sacred pricing policy applied to all demo hotels successfully!';
END;
$$;