-- Booking created -> Edge function
CREATE OR REPLACE FUNCTION public.handle_booking_created_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE LOG 'Triggering admin notification for booking created - Booking ID: %, User: %', NEW.id, NEW.user_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-booking-created',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
      body := json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)
      )::jsonb
    );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_booking_created_notify ON public.bookings;
CREATE TRIGGER trigger_booking_created_notify
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE PROCEDURE public.handle_booking_created_notify();

-- Booking cancelled -> Edge function
CREATE OR REPLACE FUNCTION public.handle_booking_cancelled_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.status IS DISTINCT FROM NEW.status) AND (NEW.status = 'cancelled') THEN
    RAISE LOG 'Triggering admin notification for booking cancelled - Booking ID: %, User: %', NEW.id, NEW.user_id;
    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-booking-cancelled',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
        body := json_build_object(
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA,
          'record', row_to_json(NEW),
          'old_record', row_to_json(OLD)
        )::jsonb
      );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_booking_cancelled_notify ON public.bookings;
CREATE TRIGGER trigger_booking_cancelled_notify
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE PROCEDURE public.handle_booking_cancelled_notify();