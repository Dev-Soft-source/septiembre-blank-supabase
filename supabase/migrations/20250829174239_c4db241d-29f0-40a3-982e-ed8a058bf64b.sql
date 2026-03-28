-- Test booking cancellation and availability restoration
UPDATE bookings 
SET status = 'cancelled', updated_at = now()
WHERE id = 'bfad9462-84ed-4225-aee7-532cba37d6db'
RETURNING id, status, updated_at;