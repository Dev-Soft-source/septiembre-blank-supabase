-- Step 8: Create test booking - simulate user booking the 8-day package
WITH test_package AS (
  SELECT id, hotel_id, available_rooms, base_price_usd
  FROM availability_packages 
  WHERE hotel_id = 'f3f4bc58-dade-476a-9a0a-5d31e34b5f10' 
  AND duration_days = 8 
  LIMIT 1
)
INSERT INTO bookings (
  user_id, hotel_id, package_id, check_in, check_out, 
  total_price, status, guest_count, payment_status
)
SELECT 
  'f08dbbc5-fe2e-42a2-8670-c6b5b6f03c68', -- Test user ID
  tp.hotel_id,
  tp.id,
  '2024-10-01',
  '2024-10-08', 
  tp.base_price_usd,
  'confirmed',
  2,
  'completed'
FROM test_package tp
RETURNING id, hotel_id, package_id, total_price, status;