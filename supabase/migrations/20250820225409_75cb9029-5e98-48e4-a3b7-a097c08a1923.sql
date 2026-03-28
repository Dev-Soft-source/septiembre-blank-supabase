-- GLOBAL SACRED POLICY PRICE UPDATE
-- Update ALL availability packages to match Sacred Policy table exactly

-- First, let's see what we're working with
-- SELECT DISTINCT hotel_id, occupancy_mode, duration_days, meal_plan FROM availability_packages ORDER BY hotel_id, duration_days;

-- Update packages based on Sacred Policy Matrix
-- 3-STAR HOTELS (category 1, 2, 3)
UPDATE availability_packages SET 
  base_price_usd = CASE 
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 120
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 160
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 180
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 240
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 240
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 320
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 300
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 400
    
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 220
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 300
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 330
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 450
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 440
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 600
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 550
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 750
    
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 320
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 430
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 645
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 860
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1075
    
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 400
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 540
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 600
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 810
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1080
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1000
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1350
    ELSE base_price_usd
  END,
  current_price_usd = CASE 
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 120
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 160
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 180
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 240
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 240
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 320
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 300
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 400
    
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 220
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 300
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 330
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 450
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 440
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 600
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 550
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 750
    
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 320
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 430
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 645
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 860
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1075
    
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 400
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 540
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 600
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 810
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1080
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1000
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1350
    ELSE current_price_usd
  END,
  updated_at = now()
WHERE hotel_id IN (
  SELECT id FROM hotels WHERE category IS NULL OR category <= 3
);

-- 4-STAR HOTELS (category 4)
UPDATE availability_packages SET 
  base_price_usd = CASE 
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 170
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 230
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 255
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 344
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 340
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 459
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 425
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 574
    
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 320
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 430
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 645
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 860
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1075
    
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 650
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 720
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 975
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1300
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1200
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1625
    
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 865
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 1298
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 1280
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1730
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1600
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 2163
    ELSE base_price_usd
  END,
  current_price_usd = CASE 
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 170
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 230
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 255
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 344
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 340
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 459
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 425
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 574
    
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 320
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 430
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 645
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 860
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1075
    
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 650
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 720
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 975
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1300
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1200
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1625
    
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 865
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 1298
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 1280
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1730
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1600
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 2163
    ELSE current_price_usd
  END,
  updated_at = now()
WHERE hotel_id IN (
  SELECT id FROM hotels WHERE category = 4
);

-- 5-STAR HOTELS (category 5+) - Same as 4-star in Sacred Policy
UPDATE availability_packages SET 
  base_price_usd = CASE 
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 170
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 230
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 255
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 344
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 340
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 459
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 425
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 574
    
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 320
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 430
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 645
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 860
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1075
    
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 650
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 720
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 975
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1300
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1200
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1625
    
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 865
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 1298
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 1280
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1730
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1600
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 2163
    ELSE base_price_usd
  END,
  current_price_usd = CASE 
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 170
    WHEN duration_days = 8 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 230
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 255
    WHEN duration_days = 8 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 344
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 340
    WHEN duration_days = 8 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 459
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 425
    WHEN duration_days = 8 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 574
    
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 320
    WHEN duration_days = 15 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 430
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 15 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 645
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 15 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 860
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 800
    WHEN duration_days = 15 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1075
    
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 480
    WHEN duration_days = 22 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 650
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 720
    WHEN duration_days = 22 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 975
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 22 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1300
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1200
    WHEN duration_days = 22 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 1625
    
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'double' THEN 640
    WHEN duration_days = 29 AND meal_plan = 'room_only' AND occupancy_mode = 'single' THEN 865
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'double' THEN 960
    WHEN duration_days = 29 AND meal_plan = 'breakfast' AND occupancy_mode = 'single' THEN 1298
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'double' THEN 1280
    WHEN duration_days = 29 AND meal_plan = 'half_board' AND occupancy_mode = 'single' THEN 1730
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'double' THEN 1600
    WHEN duration_days = 29 AND meal_plan = 'full_board' AND occupancy_mode = 'single' THEN 2163
    ELSE current_price_usd
  END,
  updated_at = now()
WHERE hotel_id IN (
  SELECT id FROM hotels WHERE category >= 5
);

-- Log the changes made
INSERT INTO admin_logs (admin_id, action, details)
VALUES (
  'system', 
  'GLOBAL_SACRED_POLICY_UPDATE', 
  jsonb_build_object(
    'description', 'Applied Sacred Policy pricing to all availability packages',
    'timestamp', now(),
    'affected_tables', jsonb_build_array('availability_packages'),
    'price_matrix_applied', jsonb_build_object(
      '3_star', jsonb_build_object(
        '8_days', jsonb_build_object('half_board', jsonb_build_object('double', 240, 'single', 320)),
        '15_days', jsonb_build_object('half_board', jsonb_build_object('double', 440, 'single', 600))
      ),
      '4_star', jsonb_build_object(
        '8_days', jsonb_build_object('half_board', jsonb_build_object('double', 340, 'single', 459)),
        '15_days', jsonb_build_object('half_board', jsonb_build_object('double', 640, 'single', 860))
      )
    )
  )
);