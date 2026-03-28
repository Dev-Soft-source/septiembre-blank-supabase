-- 1) Create price_caps table (per-room, all-in, INTEGER USD)
CREATE TABLE IF NOT EXISTS public.price_caps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category integer NULL, -- hotel category; NULL acts as default fallback
  duration_days integer NOT NULL CHECK (duration_days IN (8,15,22,29)),
  room_type text NOT NULL, -- e.g., 'single', 'double'; not stored in packages, used for policy rows
  max_price_usd integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, duration_days, room_type)
);

-- 2) Enforce initial price caps at package creation/edit only
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
  -- Skip during booking-driven dynamic price updates
  v_skip := current_setting('app.skip_cap_enforcement', true);
  IF v_skip = '1' THEN
    RETURN NEW;
  END IF;

  -- Determine hotel's category for this package
  SELECT h.category INTO v_category
  FROM public.hotels h
  WHERE h.id = NEW.hotel_id;

  -- Find the strictest cap for this duration (prefer exact category; fallback to NULL category rows),
  -- and take the minimum across room types when unknown
  SELECT MIN(pc.max_price_usd) INTO v_cap
  FROM public.price_caps pc
  WHERE pc.duration_days = NEW.duration_days
    AND (pc.category = v_category OR pc.category IS NULL);

  -- If no cap found, allow insert/update (policy not configured)
  IF v_cap IS NULL THEN
    RETURN NEW;
  END IF;

  -- On INSERT: base and current must both be <= cap
  IF TG_OP = 'INSERT' THEN
    IF NEW.base_price_usd > v_cap THEN
      RAISE EXCEPTION 'Base price (%) exceeds initial cap (%) for duration % and category %', NEW.base_price_usd, v_cap, NEW.duration_days, COALESCE(v_category, -1);
    END IF;
    IF NEW.current_price_usd > v_cap THEN
      RAISE EXCEPTION 'Current price (%) exceeds initial cap (%) for duration % and category %', NEW.current_price_usd, v_cap, NEW.duration_days, COALESCE(v_category, -1);
    END IF;
  ELSE
    -- On UPDATE: enforce only when fields are being edited (not during dynamic increase, already skipped above)
    IF NEW.base_price_usd IS DISTINCT FROM OLD.base_price_usd AND NEW.base_price_usd > v_cap THEN
      RAISE EXCEPTION 'Base price (%) exceeds initial cap (%) for duration % and category %', NEW.base_price_usd, v_cap, NEW.duration_days, COALESCE(v_category, -1);
    END IF;
    IF NEW.current_price_usd IS DISTINCT FROM OLD.current_price_usd AND NEW.current_price_usd > v_cap THEN
      RAISE EXCEPTION 'Current price (%) exceeds initial cap (%) for duration % and category %', NEW.current_price_usd, v_cap, NEW.duration_days, COALESCE(v_category, -1);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_price_caps ON public.availability_packages;
CREATE TRIGGER trg_enforce_price_caps
BEFORE INSERT OR UPDATE ON public.availability_packages
FOR EACH ROW
EXECUTE FUNCTION public.enforce_price_caps();

-- 3) Attach weekday validation trigger (function already exists)
DROP TRIGGER IF EXISTS trg_validate_pkg_weekday ON public.availability_packages;
CREATE TRIGGER trg_validate_pkg_weekday
BEFORE INSERT OR UPDATE ON public.availability_packages
FOR EACH ROW
EXECUTE FUNCTION public.validate_package_checkin_weekday();

-- 4) Dynamic price increase on booking confirmation (bounded only by percentage cap over base)
CREATE OR REPLACE FUNCTION public.auto_apply_commission_on_confirm()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_hotel_id uuid;
  v_enable_increase boolean;
  v_pct smallint;        -- price_increase_pct
  v_round smallint;      -- round_step (1,5,10)
  v_cap smallint;        -- price_increase_cap (% over base)
  v_curr int;
  v_base int;
  v_new int;
  v_capmax int;
BEGIN
  -- Only act on transition to confirmed
  IF TG_OP = 'UPDATE' AND (OLD.status IS NOT DISTINCT FROM NEW.status) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM 'confirmed' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' THEN RETURN NEW; END IF;

  -- Resolve hotel via availability package
  SELECT ap.hotel_id, ap.current_price_usd, ap.base_price_usd
    INTO v_hotel_id, v_curr, v_base
  FROM public.availability_packages ap
  WHERE ap.id = NEW.package_id
  FOR UPDATE;  -- lock package row for concurrency

  IF v_hotel_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Read pricing controls from hotel
  SELECT COALESCE(h.enable_price_increase,false), COALESCE(h.price_increase_pct,0), COALESCE(h.round_step,5), COALESCE(h.price_increase_cap,20)
    INTO v_enable_increase, v_pct, v_round, v_cap
  FROM public.hotels h
  WHERE h.id = v_hotel_id;

  IF v_enable_increase THEN
    -- Bypass initial cap enforcement during booking-driven update
    PERFORM set_config('app.skip_cap_enforcement', '1', true);

    -- new_price = ceil( current * (1 + pct/100) / round_step ) * round_step
    v_new := CEILING( ((v_curr * (1 + (v_pct::numeric/100.0))) / v_round::numeric) )::int * v_round;
    -- capped_max_pct = ceil( base * (1 + cap/100) / round_step ) * round_step
    v_capmax := CEILING( ((v_base * (1 + (v_cap::numeric/100.0))) / v_round::numeric) )::int * v_round;

    UPDATE public.availability_packages
    SET current_price_usd = LEAST(v_new, v_capmax), updated_at = now()
    WHERE id = NEW.package_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to run after insert/update on bookings
DROP TRIGGER IF EXISTS trg_auto_apply_on_confirm ON public.bookings;
CREATE TRIGGER trg_auto_apply_on_confirm
AFTER INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.auto_apply_commission_on_confirm();