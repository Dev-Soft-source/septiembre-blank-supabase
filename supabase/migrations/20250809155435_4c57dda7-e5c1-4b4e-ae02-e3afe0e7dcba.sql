-- 1) Explicit unique start date per hotel
ALTER TABLE public.availability_packages
ADD CONSTRAINT availability_packages_hotel_start_unique UNIQUE (hotel_id, start_date);

-- 2) Weekday enforcement (UTC, canonical English names)
CREATE OR REPLACE FUNCTION public.validate_package_checkin_weekday()
RETURNS trigger AS $$
DECLARE
  v_hotel_weekday TEXT;
  v_start_weekday TEXT;
BEGIN
  -- Fetch hotel's configured weekday (canonical English stored in hotels.check_in_weekday)
  SELECT check_in_weekday INTO v_hotel_weekday FROM public.hotels WHERE id = NEW.hotel_id;
  
  IF v_hotel_weekday IS NULL THEN
    RETURN NEW; -- No constraint if not configured
  END IF;

  -- Compute weekday name in UTC and trim spaces to canonical form (e.g., 'Monday')
  v_start_weekday := trim(to_char((NEW.start_date::timestamp AT TIME ZONE 'UTC'), 'Day'));

  IF v_start_weekday <> v_hotel_weekday THEN
    RAISE EXCEPTION 'Start date weekday (%) must match hotel check-in weekday (%)', v_start_weekday, v_hotel_weekday;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_validate_package_weekday ON public.availability_packages;
CREATE TRIGGER trg_validate_package_weekday
BEFORE INSERT OR UPDATE OF start_date, hotel_id
ON public.availability_packages
FOR EACH ROW
EXECUTE FUNCTION public.validate_package_checkin_weekday();

-- 3) Migrate commissions to INTEGER USD
ALTER TABLE public.booking_commissions ADD COLUMN commission_usd_int INTEGER;
-- Backfill by rounding up to next integer (safety)
UPDATE public.booking_commissions SET commission_usd_int = CEIL(commission_usd)::int;
ALTER TABLE public.booking_commissions DROP COLUMN commission_usd;
ALTER TABLE public.booking_commissions RENAME COLUMN commission_usd_int TO commission_usd;

-- 4) Deprecate legacy commission trigger; replace with unified path tied to confirmation and package->hotel resolution
DROP TRIGGER IF EXISTS trg_calculate_booking_commission_after_insert ON public.bookings;
DROP FUNCTION IF EXISTS public.calculate_booking_commission_after_insert();

CREATE OR REPLACE FUNCTION public.auto_apply_commission_on_confirm()
RETURNS trigger AS $$
DECLARE
  v_package_hotel_id uuid;
  v_referred_by text;
  v_hotel_created_at timestamptz;
  v_months_since integer;
  v_percent numeric(8,6);
  v_commission_int integer;
BEGIN
  -- Only act on transition to confirmed
  IF TG_OP = 'UPDATE' AND NOT (OLD.status IS DISTINCT FROM NEW.status) THEN
    RETURN NEW;
  END IF;
  IF NEW.status IS DISTINCT FROM 'confirmed' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND (OLD.status = 'confirmed') THEN
    RETURN NEW;
  END IF;

  -- Resolve hotel via package (preferred); fallback to booking.hotel_id if present
  SELECT ap.hotel_id INTO v_package_hotel_id FROM public.availability_packages ap WHERE ap.id = NEW.package_id;
  IF v_package_hotel_id IS NULL THEN
    v_package_hotel_id := NEW.hotel_id; -- legacy fallback
  END IF;

  -- Pull referral anchor
  SELECT h.referred_by, h.created_at INTO v_referred_by, v_hotel_created_at
  FROM public.hotels h WHERE h.id = v_package_hotel_id;

  IF v_referred_by IS NULL OR v_referred_by = '' THEN
    RETURN NEW; -- no commission source
  END IF;

  -- Months since hotel creation
  v_months_since := GREATEST(
    0,
    (date_part('year', age(NEW.created_at, v_hotel_created_at))::int * 12)
    + date_part('month', age(NEW.created_at, v_hotel_created_at))::int
  );

  -- Determine percent by code family and time windows
  v_percent := NULL;
  IF v_referred_by LIKE 'A\_%' ESCAPE '\\' THEN
    -- Association: 4% for first 18 months, then 2% next 12 months (months 0-17, 18-29)
    IF v_months_since < 18 THEN v_percent := 0.04; ELSIF v_months_since < 30 THEN v_percent := 0.02; END IF;
  ELSIF v_referred_by LIKE 'PROMO\_%' ESCAPE '\\' THEN
    -- Local promoter: 0.5% for first 18 months, 0.25% next 12 months
    IF v_months_since < 18 THEN v_percent := 0.005; ELSIF v_months_since < 30 THEN v_percent := 0.0025; END IF;
  ELSIF v_referred_by LIKE 'HOTEL\_%' ESCAPE '\\' THEN
    -- Hotel→Hotel: 4% then 2% within windows; eligibility of referred hotel joining within 1 month is assumed encoded in code issuance
    IF v_months_since < 18 THEN v_percent := 0.04; ELSIF v_months_since < 30 THEN v_percent := 0.02; END IF;
  ELSE
    RETURN NEW; -- Unknown code family → no commission
  END IF;

  IF v_percent IS NULL THEN
    RETURN NEW; -- Outside windows: no commission
  END IF;

  -- Compute integer commission from total_price
  v_commission_int := CEIL((NEW.total_price::numeric * v_percent))::int;

  -- Use unified path with idempotency
  PERFORM public.create_booking_commission(
    NEW.id,
    CASE 
      WHEN v_referred_by LIKE 'A\_%' ESCAPE '\\' THEN 'association'
      WHEN v_referred_by LIKE 'PROMO\_%' ESCAPE '\\' THEN 'promoter'
      WHEN v_referred_by LIKE 'HOTEL\_%' ESCAPE '\\' THEN 'hotel_referrer'
    END,
    NULL, -- source_id to be resolved canonically in app layer; leaving NULL keeps pair constraint satisfied (both NULL)
    v_commission_int,
    (v_percent * 100.0),
    v_referred_by
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_apply_commission_on_confirm ON public.bookings;
CREATE TRIGGER trigger_auto_apply_commission_on_confirm
AFTER INSERT OR UPDATE OF status ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.auto_apply_commission_on_confirm();