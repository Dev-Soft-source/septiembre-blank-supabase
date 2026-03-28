-- Create availability packages for hotels that have fewer than 2 packages
-- This respects price caps based on hotel category and duration

DO $$
DECLARE
  hotel_record RECORD;
  package_count INTEGER;
  start_date_1 DATE;
  start_date_2 DATE;
  weekday_offset INTEGER;
  package_price_8d INTEGER;
  package_price_15d INTEGER;
BEGIN
  -- Loop through all approved hotels
  FOR hotel_record IN 
    SELECT h.id, h.name, h.check_in_weekday, h.price_per_month, h.total_rooms, h.category
    FROM hotels h 
    WHERE h.status = 'approved'
  LOOP
    -- Count existing packages
    SELECT COUNT(*) INTO package_count 
    FROM availability_packages 
    WHERE hotel_id = hotel_record.id;
    
    -- Only create packages if hotel has fewer than 2
    IF package_count < 2 THEN
      -- Calculate pricing based on category and duration to respect caps
      -- Category 3: 8-day max 600, 15-day max 900
      -- Category 4: 8-day max 800, 15-day max 1200
      IF hotel_record.category = 3 THEN
        package_price_8d := LEAST(hotel_record.price_per_month, 600);
        package_price_15d := LEAST(hotel_record.price_per_month, 900);
      ELSIF hotel_record.category = 4 THEN
        package_price_8d := LEAST(hotel_record.price_per_month, 800);
        package_price_15d := LEAST(hotel_record.price_per_month, 1200);
      ELSE
        -- For other categories, use conservative caps
        package_price_8d := LEAST(hotel_record.price_per_month, 500);
        package_price_15d := LEAST(hotel_record.price_per_month, 750);
      END IF;
      
      -- Calculate weekday offset for start dates
      weekday_offset := CASE hotel_record.check_in_weekday
        WHEN 'Sunday' THEN 0
        WHEN 'Monday' THEN 1  
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        WHEN 'Saturday' THEN 6
        ELSE 1 -- Default to Monday
      END;
      
      -- Calculate start dates that match the hotel's check-in weekday
      -- First package: Next occurrence of the weekday that's at least 7 days from now
      start_date_1 := CURRENT_DATE + 7 + (weekday_offset - EXTRACT(DOW FROM CURRENT_DATE + 7))::INTEGER;
      IF start_date_1 <= CURRENT_DATE + 7 THEN
        start_date_1 := start_date_1 + 7; -- Move to next week if needed
      END IF;
      
      -- Second package: 30 days after first package
      start_date_2 := start_date_1 + 30;
      
      -- Ensure second date also falls on correct weekday
      start_date_2 := start_date_2 + (weekday_offset - EXTRACT(DOW FROM start_date_2))::INTEGER;
      IF start_date_2 <= start_date_1 + 30 THEN
        start_date_2 := start_date_2 + 7;
      END IF;
      
      -- Create first package (8 days) if needed
      IF package_count = 0 THEN
        INSERT INTO availability_packages (
          hotel_id,
          start_date,
          end_date,
          duration_days,
          total_rooms,
          available_rooms,
          occupancy_mode,
          base_price_usd,
          current_price_usd
        ) VALUES (
          hotel_record.id,
          start_date_1,
          start_date_1 + 7, -- 8 days duration (end_date = start_date + duration_days - 1)
          8,
          COALESCE(hotel_record.total_rooms, 1),
          COALESCE(hotel_record.total_rooms, 1),
          'double',
          package_price_8d,
          package_price_8d
        );
        
        RAISE LOG 'Created first package for hotel: % (%) - Start: %, End: %, Price: %', 
                  hotel_record.name, hotel_record.id, start_date_1, start_date_1 + 7, package_price_8d;
      END IF;
      
      -- Create second package (15 days) 
      INSERT INTO availability_packages (
        hotel_id,
        start_date,
        end_date,
        duration_days,
        total_rooms,
        available_rooms,
        occupancy_mode,
        base_price_usd,
        current_price_usd
      ) VALUES (
        hotel_record.id,
        start_date_2,
        start_date_2 + 14, -- 15 days duration (end_date = start_date + duration_days - 1)
        15,
        COALESCE(hotel_record.total_rooms, 1),
        COALESCE(hotel_record.total_rooms, 1),
        'double',
        package_price_15d,
        package_price_15d
      );
      
      RAISE LOG 'Created second package for hotel: % (%) - Start: %, End: %, Price: %', 
                hotel_record.name, hotel_record.id, start_date_2, start_date_2 + 14, package_price_15d;
                
    END IF;
  END LOOP;
  
  RAISE LOG 'Completed availability package creation for all hotels';
END $$;