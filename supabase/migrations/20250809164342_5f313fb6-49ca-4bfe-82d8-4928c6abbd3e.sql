DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enforce_price_caps') THEN
    DROP TRIGGER trg_enforce_price_caps ON public.availability_packages;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_validate_pkg_weekday') THEN
    DROP TRIGGER trg_validate_pkg_weekday ON public.availability_packages;
  END IF;
END $$;

-- Ensure column exists and backfill safely
ALTER TABLE public.availability_packages
  ADD COLUMN IF NOT EXISTS occupancy_mode text;

UPDATE public.availability_packages
SET occupancy_mode = COALESCE(occupancy_mode,
  CASE WHEN room_type IN ('single','double') THEN room_type ELSE 'double' END)
WHERE occupancy_mode IS NULL;

-- Add constraints
ALTER TABLE public.availability_packages
  ALTER COLUMN occupancy_mode SET NOT NULL;

ALTER TABLE public.availability_packages
  DROP CONSTRAINT IF EXISTS availability_packages_occupancy_mode_chk,
  ADD CONSTRAINT availability_packages_occupancy_mode_chk CHECK (occupancy_mode IN ('single','double'));

-- Replace price cap function
CREATE OR REPLACE FUNCTION public.enforce_price_caps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_category integer;
  v_cap integer;
  v_skip text;
BEGIN
  v_skip := current_setting('app.skip_cap_enforcement', true);
  IF v_skip = '1' THEN RETURN NEW; END IF;

  IF NEW.occupancy_mode IS NULL OR NEW.occupancy_mode NOT IN ('single','double') THEN
    RAISE EXCEPTION 'occupancy_mode is required and must be one of (single, double)';
  END IF;

  SELECT h.category INTO v_category FROM public.hotels h WHERE h.id = NEW.hotel_id;

  SELECT pc.max_price_usd INTO v_cap
  FROM public.price_caps pc
  WHERE pc.duration_days = NEW.duration_days
    AND pc.room_type = NEW.occupancy_mode
    AND (pc.category = v_category OR pc.category IS NULL)
  ORDER BY (pc.category IS NULL) ASC
  LIMIT 1;

  IF v_cap IS NULL THEN
    RAISE EXCEPTION 'No price cap configured for duration %, occupancy_mode %, category %', NEW.duration_days, NEW.occupancy_mode, COALESCE(v_category::text, 'default');
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.base_price_usd > v_cap THEN
      RAISE EXCEPTION 'Base price (%) exceeds cap (%) for duration %, occupancy_mode %, category %', NEW.base_price_usd, v_cap, NEW.duration_days, NEW.occupancy_mode, COALESCE(v_category::text, 'default');
    END IF;
    IF NEW.current_price_usd > v_cap THEN
      RAISE EXCEPTION 'Current price (%) exceeds cap (%) for duration %, occupancy_mode %, category %', NEW.current_price_usd, v_cap, NEW.duration_days, NEW.occupancy_mode, COALESCE(v_category::text, 'default');
    END IF;
  ELSE
    IF NEW.base_price_usd IS DISTINCT FROM OLD.base_price_usd AND NEW.base_price_usd > v_cap THEN
      RAISE EXCEPTION 'Base price (%) exceeds cap (%) for duration %, occupancy_mode %, category %', NEW.base_price_usd, v_cap, NEW.duration_days, NEW.occupancy_mode, COALESCE(v_category::text, 'default');
    END IF;
    IF NEW.current_price_usd IS DISTINCT FROM OLD.current_price_usd AND NEW.current_price_usd > v_cap THEN
      RAISE EXCEPTION 'Current price (%) exceeds cap (%) for duration %, occupancy_mode %, category %', NEW.current_price_usd, v_cap, NEW.duration_days, NEW.occupancy_mode, COALESCE(v_category::text, 'default');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER trg_enforce_price_caps
BEFORE INSERT OR UPDATE ON public.availability_packages
FOR EACH ROW
EXECUTE FUNCTION public.enforce_price_caps();

CREATE TRIGGER trg_validate_pkg_weekday
BEFORE INSERT OR UPDATE ON public.availability_packages
FOR EACH ROW
EXECUTE FUNCTION public.validate_package_checkin_weekday();

-- Ensure booking guest_count validation uses occupancy_mode
CREATE OR REPLACE FUNCTION public.validate_guest_count_vs_occupancy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_occupancy smallint;
  v_mode text;
BEGIN
  IF NEW.package_id IS NULL THEN RETURN NEW; END IF;
  SELECT ap.occupancy_mode INTO v_mode FROM public.availability_packages ap WHERE ap.id = NEW.package_id;
  v_occupancy := CASE WHEN v_mode = 'double' THEN 2 ELSE 1 END;
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