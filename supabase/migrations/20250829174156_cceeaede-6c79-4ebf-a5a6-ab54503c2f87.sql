-- Re-enable the booking notification trigger
CREATE TRIGGER booking_notify_parties_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_booking_notify_parties();

-- Test booking creation for "Prioridad 1" hotel
INSERT INTO bookings (
  user_id, hotel_id, package_id, check_in, check_out, 
  total_price, status, guest_count, payment_status
)
SELECT 
  'f08dbbc5-fe2e-42a2-8670-c6b5b6f03c68',
  'f3f4bc58-dade-476a-9a0a-5d31e34b5f10',
  ap.id,
  '2024-10-01',
  '2024-10-08',
  ap.base_price_usd,
  'confirmed',
  2,
  'completed'
FROM availability_packages ap 
WHERE ap.hotel_id = 'f3f4bc58-dade-476a-9a0a-5d31e34b5f10' 
AND ap.duration_days = 8 
LIMIT 1
RETURNING id, package_id, total_price, status;