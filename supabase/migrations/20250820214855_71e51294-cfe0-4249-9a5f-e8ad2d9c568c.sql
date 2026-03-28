-- Fix availability package pricing to match the correct pricing table
-- Delete existing packages and recreate with correct pricing

DO $$
DECLARE
  hotel_record RECORD;
  package_data RECORD;
  meal_offering TEXT;
  meal_plan_mapped TEXT;
  base_price INTEGER;
  duration_days INTEGER;
  start_date_calc DATE;
  end_date_calc DATE;
  week_offset INTEGER := 0;
BEGIN
  -- Delete all existing availability packages
  DELETE FROM public.availability_packages;
  
  -- Process each hotel
  FOR hotel_record IN 
    SELECT id, name, category, meals_offered, check_in_weekday
    FROM public.hotels 
    WHERE status = 'approved'
  LOOP
    RAISE LOG 'Processing hotel: % (Category: %)', hotel_record.name, hotel_record.category;
    
    -- Process each meal offering for this hotel
    IF hotel_record.meals_offered IS NOT NULL AND array_length(hotel_record.meals_offered, 1) > 0 THEN
      FOREACH meal_offering IN ARRAY hotel_record.meals_offered
      LOOP
        RAISE LOG 'Processing meal offering: %', meal_offering;
        
        -- Map meal offerings to meal plans
        meal_plan_mapped := CASE meal_offering
          WHEN 'none' THEN 'accommodationOnly'
          WHEN 'breakfast' THEN 'breakfastIncluded'  
          WHEN 'half_board' THEN 'halfBoard'
          WHEN 'full_board' THEN 'fullBoard'
          ELSE 'accommodationOnly'
        END;
        
        RAISE LOG 'Mapped to meal plan: %', meal_plan_mapped;
        
        -- Create packages for durations 8 and 15 days
        FOR duration_days IN SELECT unnest(ARRAY[8, 15])
        LOOP
          -- Calculate pricing based on hotel category, duration, and meal plan
          base_price := CASE 
            -- 3-star hotel pricing
            WHEN hotel_record.category = 3 THEN
              CASE 
                WHEN duration_days = 8 AND meal_plan_mapped = 'accommodationOnly' THEN 120
                WHEN duration_days = 8 AND meal_plan_mapped = 'breakfastIncluded' THEN 180
                WHEN duration_days = 8 AND meal_plan_mapped = 'halfBoard' THEN 240
                WHEN duration_days = 8 AND meal_plan_mapped = 'fullBoard' THEN 300
                WHEN duration_days = 15 AND meal_plan_mapped = 'accommodationOnly' THEN 225
                WHEN duration_days = 15 AND meal_plan_mapped = 'breakfastIncluded' THEN 338
                WHEN duration_days = 15 AND meal_plan_mapped = 'halfBoard' THEN 450
                WHEN duration_days = 15 AND meal_plan_mapped = 'fullBoard' THEN 563
                WHEN duration_days = 22 AND meal_plan_mapped = 'accommodationOnly' THEN 330
                WHEN duration_days = 22 AND meal_plan_mapped = 'breakfastIncluded' THEN 495
                WHEN duration_days = 22 AND meal_plan_mapped = 'halfBoard' THEN 660
                WHEN duration_days = 22 AND meal_plan_mapped = 'fullBoard' THEN 825
                WHEN duration_days = 29 AND meal_plan_mapped = 'accommodationOnly' THEN 435
                WHEN duration_days = 29 AND meal_plan_mapped = 'breakfastIncluded' THEN 653
                WHEN duration_days = 29 AND meal_plan_mapped = 'halfBoard' THEN 870
                WHEN duration_days = 29 AND meal_plan_mapped = 'fullBoard' THEN 1088
                ELSE 120 -- fallback
              END
            -- 4-star hotel pricing  
            WHEN hotel_record.category = 4 THEN
              CASE 
                WHEN duration_days = 8 AND meal_plan_mapped = 'accommodationOnly' THEN 160
                WHEN duration_days = 8 AND meal_plan_mapped = 'breakfastIncluded' THEN 240
                WHEN duration_days = 8 AND meal_plan_mapped = 'halfBoard' THEN 320
                WHEN duration_days = 8 AND meal_plan_mapped = 'fullBoard' THEN 400
                WHEN duration_days = 15 AND meal_plan_mapped = 'accommodationOnly' THEN 300
                WHEN duration_days = 15 AND meal_plan_mapped = 'breakfastIncluded' THEN 450
                WHEN duration_days = 15 AND meal_plan_mapped = 'halfBoard' THEN 600
                WHEN duration_days = 15 AND meal_plan_mapped = 'fullBoard' THEN 750
                WHEN duration_days = 22 AND meal_plan_mapped = 'accommodationOnly' THEN 440
                WHEN duration_days = 22 AND meal_plan_mapped = 'breakfastIncluded' THEN 660
                WHEN duration_days = 22 AND meal_plan_mapped = 'halfBoard' THEN 880
                WHEN duration_days = 22 AND meal_plan_mapped = 'fullBoard' THEN 1100
                WHEN duration_days = 29 AND meal_plan_mapped = 'accommodationOnly' THEN 580
                WHEN duration_days = 29 AND meal_plan_mapped = 'breakfastIncluded' THEN 870
                WHEN duration_days = 29 AND meal_plan_mapped = 'halfBoard' THEN 1160
                WHEN duration_days = 29 AND meal_plan_mapped = 'fullBoard' THEN 1450
                ELSE 160 -- fallback
              END
            -- 5-star hotel pricing (fallback to 4-star pricing)
            ELSE
              CASE 
                WHEN duration_days = 8 AND meal_plan_mapped = 'accommodationOnly' THEN 160
                WHEN duration_days = 8 AND meal_plan_mapped = 'breakfastIncluded' THEN 240
                WHEN duration_days = 8 AND meal_plan_mapped = 'halfBoard' THEN 320
                WHEN duration_days = 8 AND meal_plan_mapped = 'fullBoard' THEN 400
                WHEN duration_days = 15 AND meal_plan_mapped = 'accommodationOnly' THEN 300
                WHEN duration_days = 15 AND meal_plan_mapped = 'breakfastIncluded' THEN 450
                WHEN duration_days = 15 AND meal_plan_mapped = 'halfBoard' THEN 600
                WHEN duration_days = 15 AND meal_plan_mapped = 'fullBoard' THEN 750
                WHEN duration_days = 22 AND meal_plan_mapped = 'accommodationOnly' THEN 440
                WHEN duration_days = 22 AND meal_plan_mapped = 'breakfastIncluded' THEN 660
                WHEN duration_days = 22 AND meal_plan_mapped = 'halfBoard' THEN 880
                WHEN duration_days = 22 AND meal_plan_mapped = 'fullBoard' THEN 1100
                WHEN duration_days = 29 AND meal_plan_mapped = 'accommodationOnly' THEN 580
                WHEN duration_days = 29 AND meal_plan_mapped = 'breakfastIncluded' THEN 870
                WHEN duration_days = 29 AND meal_plan_mapped = 'halfBoard' THEN 1160
                WHEN duration_days = 29 AND meal_plan_mapped = 'fullBoard' THEN 1450
                ELSE 160 -- fallback
              END
          END;
          
          -- Calculate start date with staggered weeks to avoid overlaps
          start_date_calc := CASE hotel_record.check_in_weekday
            WHEN 'Monday' THEN '2025-08-25'::DATE + (week_offset * 7)
            WHEN 'Tuesday' THEN '2025-08-26'::DATE + (week_offset * 7)
            WHEN 'Wednesday' THEN '2025-08-27'::DATE + (week_offset * 7)
            WHEN 'Thursday' THEN '2025-08-28'::DATE + (week_offset * 7)
            WHEN 'Friday' THEN '2025-08-29'::DATE + (week_offset * 7)
            WHEN 'Saturday' THEN '2025-08-30'::DATE + (week_offset * 7)
            WHEN 'Sunday' THEN '2025-08-31'::DATE + (week_offset * 7)
            ELSE '2025-08-25'::DATE + (week_offset * 7) -- Default to Monday
          END;
          
          end_date_calc := start_date_calc + (duration_days - 1);
          
          -- Insert the package
          INSERT INTO public.availability_packages (
            hotel_id,
            start_date,
            end_date,
            duration_days,
            total_rooms,
            available_rooms,
            occupancy_mode,
            base_price_usd,
            current_price_usd,
            meal_plan
          ) VALUES (
            hotel_record.id,
            start_date_calc,
            end_date_calc,
            duration_days,
            5, -- Default total rooms
            5, -- Default available rooms
            'double',
            base_price,
            base_price,
            meal_plan_mapped
          );
          
          RAISE LOG 'Created package: Hotel %, Duration: % days, Meal Plan: %, Price: $%, Dates: % to %', 
            hotel_record.name, duration_days, meal_plan_mapped, base_price, start_date_calc, end_date_calc;
          
          -- Increment week offset for next package to avoid date overlaps
          week_offset := week_offset + 3;
        END LOOP; -- duration loop
      END LOOP; -- meal offering loop
    END IF;
  END LOOP; -- hotel loop
END $$;