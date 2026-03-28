-- Function to notify guest and hotel on booking events
CREATE OR REPLACE FUNCTION public.handle_booking_notify_parties()
RETURNS trigger AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/send-booking-notifications',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW),
        'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END
      )::jsonb
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- Attach triggers to bookings to notify guest and hotel
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'notify_booking_created_parties'
  ) THEN
    CREATE TRIGGER notify_booking_created_parties
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_booking_notify_parties();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'notify_booking_cancelled_parties'
  ) THEN
    CREATE TRIGGER notify_booking_cancelled_parties
    AFTER UPDATE ON public.bookings
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'cancelled')
    EXECUTE FUNCTION public.handle_booking_notify_parties();
  END IF;
END$$;