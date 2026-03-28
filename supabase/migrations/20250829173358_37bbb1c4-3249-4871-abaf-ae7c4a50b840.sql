-- Step 8: Simulate booking - Create test booking for 8-day package
-- First, get the 8-day package ID and current availability
WITH package_info AS (
  SELECT id, available_rooms, total_rooms 
  FROM availability_packages 
  WHERE hotel_id = 'f3f4bc58-dade-476a-9a0a-5d31e34b5f10' 
  AND duration_days = 8 
  LIMIT 1
)
INSERT INTO bookings (
  user_id, hotel_id, package_id, check_in, check_out, 
  total_price, status, payment_status, guest_count
)
SELECT 
  'f08dbbc5-fe2e-42a2-8670-c6b5b6f03c68'::uuid, -- Test user ID
  'f3f4bc58-dade-476a-9a0a-5d31e34b5f10'::uuid, -- Hotel ID
  pi.id, -- Package ID
  '2024-10-01'::date,
  '2024-10-08'::date,
  800, -- Price for 8 days
  'confirmed',
  'paid',
  1
FROM package_info pi
RETURNING id, hotel_id, package_id, total_price, status;