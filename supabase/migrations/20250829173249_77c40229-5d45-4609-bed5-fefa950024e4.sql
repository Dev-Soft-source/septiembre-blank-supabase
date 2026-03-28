-- Step 8: Create test booking and verify availability reduction
-- Insert a test booking for the 8-day package
INSERT INTO bookings (
  user_id, 
  hotel_id, 
  package_id, 
  check_in, 
  check_out, 
  total_price, 
  status, 
  payment_status,
  guest_count
)
SELECT 
  'f08dbbc5-fe2e-42a2-8670-c6b5b6f03c68'::uuid, -- Test user
  'f3f4bc58-dade-476a-9a0a-5d31e34b5f10'::uuid, -- Prioridad 1 hotel
  ap.id,
  ap.start_date,
  ap.end_date,
  ap.current_price_usd,
  'confirmed',
  'completed',
  1
FROM availability_packages ap
WHERE ap.hotel_id = 'f3f4bc58-dade-476a-9a0a-5d31e34b5f10'
AND ap.duration_days = 8
LIMIT 1
RETURNING id, hotel_id, package_id, total_price, status;