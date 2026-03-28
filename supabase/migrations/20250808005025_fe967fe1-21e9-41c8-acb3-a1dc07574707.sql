-- Ensure trigger name and condition match requirements for booking cancellation notifications
DROP TRIGGER IF EXISTS trigger_booking_cancelled_notify ON public.bookings;
DROP TRIGGER IF EXISTS trigger_notify_admin_on_booking_cancelled ON public.bookings;

CREATE TRIGGER trigger_notify_admin_on_booking_cancelled
AFTER UPDATE ON public.bookings
FOR EACH ROW
WHEN (NEW.status = 'cancelled' AND (OLD.status IS DISTINCT FROM NEW.status))
EXECUTE PROCEDURE public.handle_booking_cancelled_notify();