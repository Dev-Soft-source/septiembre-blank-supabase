-- Remove price cap constraints and update pricing to match the star rating tables

-- Drop the trigger and function that enforces price caps (using CASCADE)
DROP FUNCTION IF EXISTS enforce_price_caps() CASCADE;

-- Add meal_plan column to availability_packages
ALTER TABLE availability_packages 
ADD COLUMN IF NOT EXISTS meal_plan TEXT DEFAULT 'half_board';

-- Update pricing for all existing packages based on hotel category, duration, and meal plan
DO $$
DECLARE
  package_record RECORD;
  new_price INTEGER;
BEGIN
  -- Loop through all availability packages
  FOR package_record IN 
    SELECT ap.id, ap.duration_days, ap.meal_plan, h.category
    FROM availability_packages ap
    JOIN hotels h ON ap.hotel_id = h.id
    WHERE h.status = 'approved'
  LOOP
    -- Calculate price based on category, duration, and meal plan from the pricing tables
    new_price := CASE 
      -- 3-STAR HOTELS
      WHEN package_record.category = 3 THEN
        CASE package_record.duration_days
          WHEN 8 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 400
              WHEN 'breakfast' THEN 600
              WHEN 'half_board' THEN 800
              WHEN 'full_board' THEN 1000
              ELSE 800
            END
          WHEN 15 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 320
              WHEN 'breakfast' THEN 480
              WHEN 'half_board' THEN 640
              WHEN 'full_board' THEN 800
              ELSE 640
            END
          WHEN 22 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 220
              WHEN 'breakfast' THEN 330
              WHEN 'half_board' THEN 440
              WHEN 'full_board' THEN 550
              ELSE 440
            END
          WHEN 29 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 120
              WHEN 'breakfast' THEN 180
              WHEN 'half_board' THEN 240
              WHEN 'full_board' THEN 300
              ELSE 240
            END
          ELSE 800
        END
      
      -- 4-STAR HOTELS  
      WHEN package_record.category = 4 THEN
        CASE package_record.duration_days
          WHEN 8 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 640
              WHEN 'breakfast' THEN 960
              WHEN 'half_board' THEN 1280
              WHEN 'full_board' THEN 1600
              ELSE 1280
            END
          WHEN 15 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 480
              WHEN 'breakfast' THEN 720
              WHEN 'half_board' THEN 960
              WHEN 'full_board' THEN 1200
              ELSE 960
            END
          WHEN 22 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 320
              WHEN 'breakfast' THEN 480
              WHEN 'half_board' THEN 640
              WHEN 'full_board' THEN 800
              ELSE 640
            END
          WHEN 29 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 170
              WHEN 'breakfast' THEN 255
              WHEN 'half_board' THEN 340
              WHEN 'full_board' THEN 425
              ELSE 340
            END
          ELSE 1280
        END
        
      -- 5-STAR HOTELS
      WHEN package_record.category >= 5 THEN
        CASE package_record.duration_days
          WHEN 8 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 1380
              WHEN 'breakfast' THEN 2070
              WHEN 'half_board' THEN 2760
              WHEN 'full_board' THEN 3450
              ELSE 2760
            END
          WHEN 15 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 640
              WHEN 'breakfast' THEN 960
              WHEN 'half_board' THEN 1280
              WHEN 'full_board' THEN 1600
              ELSE 1280
            END
          WHEN 22 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 440
              WHEN 'breakfast' THEN 660
              WHEN 'half_board' THEN 880
              WHEN 'full_board' THEN 1100
              ELSE 880
            END
          WHEN 29 THEN
            CASE COALESCE(package_record.meal_plan, 'half_board')
              WHEN 'room_only' THEN 240
              WHEN 'breakfast' THEN 360
              WHEN 'half_board' THEN 480
              WHEN 'full_board' THEN 600
              ELSE 480
            END
          ELSE 2760
        END
        
      -- DEFAULT (for categories 1-2 or unknown, use 3-star pricing)
      ELSE
        CASE package_record.duration_days
          WHEN 8 THEN 800
          WHEN 15 THEN 640
          WHEN 22 THEN 440
          WHEN 29 THEN 240
          ELSE 800
        END
    END;
    
    -- Update the package with the new pricing
    UPDATE availability_packages 
    SET 
      base_price_usd = new_price,
      current_price_usd = new_price,
      meal_plan = COALESCE(meal_plan, 'half_board'),
      updated_at = now()
    WHERE id = package_record.id;
    
  END LOOP;
  
  RAISE LOG 'Successfully updated all availability package prices according to star rating tables';
END $$;