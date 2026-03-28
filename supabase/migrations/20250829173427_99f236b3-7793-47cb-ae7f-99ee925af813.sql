-- Step 8: Create test booking (bypass notification trigger temporarily)
-- Temporarily disable the trigger
ALTER TABLE bookings DISABLE TRIGGER handle_booking_notify_parties_trigger;