-- Ensure unique constraint for admin notification deduplication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'ux_admin_notification_events_user_event'
  ) THEN
    CREATE UNIQUE INDEX ux_admin_notification_events_user_event
      ON public.admin_notification_events (user_id, event);
  END IF;
END$$;

-- Create function to adjust package availability on booking status changes
CREATE OR REPLACE FUNCTION public.update_package_availability_on_booking()
RETURNS trigger AS $$
BEGIN
  -- Reserve rooms when booking is confirmed (on insert or status transition to confirmed)
  IF NEW.status = 'confirmed' AND NEW.package_id IS NOT NULL THEN
    IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND (OLD.status IS DISTINCT FROM NEW.status)) THEN
      PERFORM public.reserve_package_rooms_enhanced(NEW.package_id, 1);
    END IF;
  END IF;

  -- Restore rooms when booking is cancelled (on status transition to cancelled)
  IF TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND (OLD.status IS DISTINCT FROM NEW.status) AND NEW.package_id IS NOT NULL THEN
    PERFORM public.restore_package_availability_enhanced(NEW.package_id, 1);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- Attach trigger to bookings for availability sync
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'booking_availability_sync'
  ) THEN
    CREATE TRIGGER booking_availability_sync
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_package_availability_on_booking();
  END IF;
END$$;

-- Attach triggers for admin notifications on booking created/cancelled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'notify_booking_created_admin'
  ) THEN
    CREATE TRIGGER notify_booking_created_admin
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_booking_created_notify();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'notify_booking_cancelled_admin'
  ) THEN
    CREATE TRIGGER notify_booking_cancelled_admin
    AFTER UPDATE ON public.bookings
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'cancelled')
    EXECUTE FUNCTION public.handle_booking_cancelled_notify();
  END IF;
END$$;

-- Attach trigger for hotel submission admin notification
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'notify_hotel_submission_admin'
  ) THEN
    CREATE TRIGGER notify_hotel_submission_admin
    AFTER INSERT ON public.hotels
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_hotel_submission_notify();
  END IF;
END$$;

-- Attach overlap validation trigger on availability packages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'check_package_overlap_trg'
  ) THEN
    CREATE TRIGGER check_package_overlap_trg
    BEFORE INSERT OR UPDATE ON public.availability_packages
    FOR EACH ROW
    EXECUTE FUNCTION public.check_package_overlap();
  END IF;
END$$;

-- Attach weekday validation trigger on availability packages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'validate_checkin_weekday_trg'
  ) THEN
    CREATE TRIGGER validate_checkin_weekday_trg
    BEFORE INSERT OR UPDATE ON public.availability_packages
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_package_checkin_weekday();
  END IF;
END$$;

-- Attach hotel availability months maintenance trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_hotel_available_months_trg'
  ) THEN
    CREATE TRIGGER update_hotel_available_months_trg
    AFTER INSERT OR UPDATE ON public.hotel_availability
    FOR EACH ROW
    EXECUTE FUNCTION public.update_hotel_available_months();
  END IF;
END$$;