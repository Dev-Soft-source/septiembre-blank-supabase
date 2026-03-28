-- Add guest_count to bookings and enforce guest_count ≤ occupancy (derived from package room_type)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS guest_count smallint NOT NULL DEFAULT 1,
  ADD CONSTRAINT bookings_guest_count_valid CHECK (guest_count >= 1);

CREATE OR REPLACE FUNCTION public.validate_guest_count_vs_occupancy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_room_type text;
  v_occupancy smallint;
BEGIN
  IF NEW.package_id IS NULL THEN
    RETURN NEW; -- nothing to validate if no package (defensive)
  END IF;

  SELECT ap.room_type INTO v_room_type
  FROM public.availability_packages ap
  WHERE ap.id = NEW.package_id;

  v_occupancy := CASE WHEN v_room_type = 'double' THEN 2 ELSE 1 END;

  IF NEW.guest_count > v_occupancy THEN
    RAISE EXCEPTION 'guest_count (%) exceeds occupancy (%) for this package', NEW.guest_count, v_occupancy;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_guest_count ON public.bookings;
CREATE TRIGGER trg_validate_guest_count
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_guest_count_vs_occupancy();