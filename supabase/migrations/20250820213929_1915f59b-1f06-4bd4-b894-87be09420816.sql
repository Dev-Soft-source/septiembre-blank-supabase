-- Fix availability packages with correct meal plans and pricing
-- Delete all existing packages
DELETE FROM availability_packages;

-- Create packages for each hotel based on their actual meal offerings and star rating
DO $$
DECLARE
    hotel_record RECORD;
    meal_offering TEXT;
    meal_plan TEXT;
    duration INT;
    price_8 INT;
    price_15 INT;
    price_22 INT;
    price_29 INT;
    current_price INT;
BEGIN
    -- Loop through all approved hotels
    FOR hotel_record IN 
        SELECT id, name, category, meals_offered, total_rooms, check_in_weekday
        FROM hotels 
        WHERE status = 'approved'
    LOOP
        RAISE LOG 'Processing hotel: % (Category: %)', hotel_record.name, hotel_record.category;
        
        -- Process each meal offering for this hotel
        FOREACH meal_offering IN ARRAY hotel_record.meals_offered
        LOOP
            RAISE LOG 'Processing meal offering: %', meal_offering;
            
            -- Map meal offerings to meal plan types
            CASE
                WHEN meal_offering IN ('none', 'accommodationOnly') THEN
                    meal_plan := 'accommodationOnly';
                WHEN meal_offering IN ('breakfast', 'Continental Breakfast', 'Desayuno incluido', 'breakfastIncluded') THEN
                    meal_plan := 'breakfastIncluded';
                WHEN meal_offering IN ('lunch', 'halfBoard', 'demipensiune') THEN
                    meal_plan := 'halfBoard';
                WHEN meal_offering IN ('dinner', 'lunch dinner', 'breakfast lunch dinner', 'fullBoard', 'pensiune completa') THEN
                    meal_plan := 'fullBoard';
                WHEN meal_offering IN ('allInclusive', 'all_inclusive') THEN
                    meal_plan := 'allInclusive';
                ELSE
                    -- Default unrecognized offerings to breakfast
                    meal_plan := 'breakfastIncluded';
            END CASE;
            
            RAISE LOG 'Mapped to meal plan: %', meal_plan;
            
            -- Set pricing based on hotel category and meal plan
            IF hotel_record.category = 3 THEN
                CASE meal_plan
                    WHEN 'accommodationOnly' THEN
                        price_8 := 400; price_15 := 320; price_22 := 220; price_29 := 120;
                    WHEN 'breakfastIncluded' THEN
                        price_8 := 600; price_15 := 480; price_22 := 330; price_29 := 180;
                    WHEN 'halfBoard' THEN
                        price_8 := 800; price_15 := 640; price_22 := 440; price_29 := 240;
                    WHEN 'fullBoard' THEN
                        price_8 := 1000; price_15 := 800; price_22 := 550; price_29 := 300;
                    WHEN 'allInclusive' THEN
                        price_8 := 1000; price_15 := 800; price_22 := 550; price_29 := 300;
                END CASE;
            ELSIF hotel_record.category = 4 THEN
                CASE meal_plan
                    WHEN 'accommodationOnly' THEN
                        price_8 := 600; price_15 := 480; price_22 := 330; price_29 := 180;
                    WHEN 'breakfastIncluded' THEN
                        price_8 := 900; price_15 := 720; price_22 := 495; price_29 := 270;
                    WHEN 'halfBoard' THEN
                        price_8 := 1200; price_15 := 960; price_22 := 660; price_29 := 360;
                    WHEN 'fullBoard' THEN
                        price_8 := 1500; price_15 := 1200; price_22 := 825; price_29 := 450;
                    WHEN 'allInclusive' THEN
                        price_8 := 1500; price_15 := 1200; price_22 := 825; price_29 := 450;
                END CASE;
            ELSE
                -- Default to 4-star pricing for any other category
                CASE meal_plan
                    WHEN 'accommodationOnly' THEN
                        price_8 := 600; price_15 := 480; price_22 := 330; price_29 := 180;
                    WHEN 'breakfastIncluded' THEN
                        price_8 := 900; price_15 := 720; price_22 := 495; price_29 := 270;
                    WHEN 'halfBoard' THEN
                        price_8 := 1200; price_15 := 960; price_22 := 660; price_29 := 360;
                    WHEN 'fullBoard' THEN
                        price_8 := 1500; price_15 := 1200; price_22 := 825; price_29 := 450;
                    WHEN 'allInclusive' THEN
                        price_8 := 1500; price_15 := 1200; price_22 := 825; price_29 := 450;
                END CASE;
            END IF;
            
            -- Create packages for different durations (8 and 15 days as requested)
            FOREACH duration IN ARRAY ARRAY[8, 15]
            LOOP
                CASE duration
                    WHEN 8 THEN current_price := price_8;
                    WHEN 15 THEN current_price := price_15;
                    WHEN 22 THEN current_price := price_22;
                    WHEN 29 THEN current_price := price_29;
                END CASE;
                
                -- Insert the availability package
                INSERT INTO availability_packages (
                    hotel_id,
                    start_date,
                    end_date,
                    duration_days,
                    total_rooms,
                    available_rooms,
                    occupancy_mode,
                    meal_plan,
                    base_price_usd,
                    current_price_usd
                ) VALUES (
                    hotel_record.id,
                    CURRENT_DATE + INTERVAL '7 days', -- Start next week
                    CURRENT_DATE + INTERVAL '7 days' + INTERVAL '1 day' * duration,
                    duration,
                    COALESCE(hotel_record.total_rooms, 10),
                    COALESCE(hotel_record.total_rooms, 10),
                    'double',
                    meal_plan,
                    current_price,
                    current_price
                );
                
                RAISE LOG 'Created package: Hotel %, Duration: % days, Meal Plan: %, Price: $%', 
                    hotel_record.name, duration, meal_plan, current_price;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;