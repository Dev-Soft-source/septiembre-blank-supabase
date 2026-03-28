-- Step 11: Create booking directly without triggers
INSERT INTO bookings (
  id, user_id, hotel_id, package_id, check_in, check_out, 
  total_price, status, guest_count, payment_status, created_at
)
VALUES (
  gen_random_uuid(),
  'f08dbbc5-fe2e-42a2-8670-c6b5b6f03c68',
  'f3f4bc58-dade-476a-9a0a-5d31e34b5f10',
  (SELECT id FROM availability_packages WHERE hotel_id = 'f3f4bc58-dade-476a-9a0a-5d31e34b5f10' AND duration_days = 8 LIMIT 1),
  '2024-10-01',
  '2024-10-08',
  800,
  'confirmed', 
  2,
  'completed',
  now()
)
RETURNING id, package_id, total_price;