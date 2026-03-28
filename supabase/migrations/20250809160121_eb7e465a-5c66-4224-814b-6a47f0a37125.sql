-- Pricing columns on hotels
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='hotels' AND column_name='price_increase_pct'
  ) THEN
    ALTER TABLE public.hotels 
      ADD COLUMN price_increase_pct SMALLINT NOT NULL DEFAULT 0,
      ADD CONSTRAINT hotels_price_increase_pct_check CHECK (price_increase_pct BETWEEN 0 AND 100);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='hotels' AND column_name='round_step'
  ) THEN
    ALTER TABLE public.hotels 
      ADD COLUMN round_step SMALLINT NOT NULL DEFAULT 5,
      ADD CONSTRAINT hotels_round_step_check CHECK (round_step IN (1,5,10));
  END IF;
  -- Ensure price_increase_cap constraint exists and bounds
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='hotels_price_increase_cap_check'
  ) THEN
    ALTER TABLE public.hotels 
      ADD CONSTRAINT hotels_price_increase_cap_check CHECK (price_increase_cap BETWEEN 0 AND 50);
  END IF;
END$$;

-- Pricing fields on availability_packages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='availability_packages' AND column_name='base_price_usd'
  ) THEN
    ALTER TABLE public.availability_packages ADD COLUMN base_price_usd INTEGER;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='availability_packages' AND column_name='current_price_usd'
  ) THEN
    ALTER TABLE public.availability_packages ADD COLUMN current_price_usd INTEGER;
  END IF;
END$$;

-- Backfill base/current prices from hotels.price_per_month
UPDATE public.availability_packages ap
SET base_price_usd = COALESCE(h.price_per_month, 0)
FROM public.hotels h
WHERE h.id = ap.hotel_id AND (ap.base_price_usd IS NULL);

UPDATE public.availability_packages ap
SET current_price_usd = ap.base_price_usd
WHERE ap.current_price_usd IS NULL;

-- Enforce NOT NULL after backfill
ALTER TABLE public.availability_packages ALTER COLUMN base_price_usd SET NOT NULL;
ALTER TABLE public.availability_packages ALTER COLUMN current_price_usd SET NOT NULL;

-- Trigger to set current_price_usd = base_price_usd on insert
CREATE OR REPLACE FUNCTION public.set_package_current_price_on_insert()
RETURNS trigger AS $$
BEGIN
  IF NEW.current_price_usd IS NULL THEN
    NEW.current_price_usd := NEW.base_price_usd;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_package_current_price ON public.availability_packages;
CREATE TRIGGER trg_set_package_current_price
BEFORE INSERT ON public.availability_packages
FOR EACH ROW EXECUTE FUNCTION public.set_package_current_price_on_insert();

-- Canonical commission source: Option A
CREATE TABLE IF NOT EXISTS public.hotel_commission_link (
  hotel_id UUID PRIMARY KEY REFERENCES public.hotels(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('association','promoter','hotel_referrer')),
  source_id UUID NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_hcl_source ON public.hotel_commission_link (source_type, source_id);

-- Replace auto_apply_commission_on_confirm to use canonical link and update dynamic pricing with rounding/cap
CREATE OR REPLACE FUNCTION public.auto_apply_commission_on_confirm()
RETURNS trigger AS $$
DECLARE
  v_hotel_id uuid;
  v_hotel_created_at timestamptz;
  v_enable_increase boolean;
  v_pct smallint;
  v_round smallint;
  v_cap integer;
  v_curr int;
  v_base int;
  v_new int;
  v_capmax int;
  v_link record;
  v_months_since integer;
  v_percent numeric(8,6);
  v_commission_int integer;
BEGIN
  -- Only on transition to confirmed
  IF TG_OP = 'UPDATE' AND NOT (OLD.status IS DISTINCT FROM NEW.status) THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM 'confirmed' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' THEN RETURN NEW; END IF;

  -- Resolve hotel via package
  SELECT ap.hotel_id INTO v_hotel_id FROM public.availability_packages ap WHERE ap.id = NEW.package_id;
  IF v_hotel_id IS NULL THEN RETURN NEW; END IF;

  -- Dynamic pricing update with row lock on the package
  SELECT ap.current_price_usd, ap.base_price_usd INTO v_curr, v_base
  FROM public.availability_packages ap
  WHERE ap.id = NEW.package_id
  FOR UPDATE;

  SELECT h.created_at, COALESCE(h.enable_price_increase,false), COALESCE(h.price_increase_pct,0), COALESCE(h.round_step,5), COALESCE(h.price_increase_cap,20)
    INTO v_hotel_created_at, v_enable_increase, v_pct, v_round, v_cap
  FROM public.hotels h WHERE h.id = v_hotel_id;

  IF v_enable_increase THEN
    -- new_price = ceil( current * (1 + pct/100) / round_step ) * round_step
    v_new := CEIL((v_curr * (1 + (v_pct::numeric/100.0))) / v_round::numeric)::int * v_round;
    -- capped_max = ceil( base * (1 + cap/100) / round_step ) * round_step
    v_capmax := CEIL((v_base * (1 + (v_cap::numeric/100.0))) / v_round::numeric)::int * v_round;
    UPDATE public.availability_packages SET current_price_usd = LEAST(v_new, v_capmax) WHERE id = NEW.package_id;
  END IF;

  -- Commission via canonical link (single active source)
  SELECT * INTO v_link FROM public.hotel_commission_link l 
  WHERE l.hotel_id = v_hotel_id
    AND (l.starts_at IS NULL OR l.starts_at <= NEW.created_at)
    AND (l.ends_at IS NULL OR NEW.created_at <= l.ends_at);

  IF NOT FOUND THEN RETURN NEW; END IF;

  -- Time windows by hotel age
  v_months_since := GREATEST(0,
    (date_part('year', age(NEW.created_at, v_hotel_created_at))::int * 12)
    + date_part('month', age(NEW.created_at, v_hotel_created_at))::int);

  v_percent := NULL;
  IF v_link.source_type = 'association' THEN
    IF v_months_since < 18 THEN v_percent := 0.04; ELSIF v_months_since < 30 THEN v_percent := 0.02; END IF;
  ELSIF v_link.source_type = 'promoter' THEN
    IF v_months_since < 18 THEN v_percent := 0.005; ELSIF v_months_since < 30 THEN v_percent := 0.0025; END IF;
  ELSIF v_link.source_type = 'hotel_referrer' THEN
    -- Apply only if hotel joined within 1 month of recommendation (approx using link.starts_at)
    IF (v_hotel_created_at - v_link.starts_at) <= interval '1 month' THEN
      IF v_months_since < 18 THEN v_percent := 0.04; ELSIF v_months_since < 30 THEN v_percent := 0.02; END IF;
    END IF;
  END IF;

  IF v_percent IS NULL THEN RETURN NEW; END IF;

  v_commission_int := CEIL((NEW.total_price::numeric * v_percent))::int;

  PERFORM public.create_booking_commission(
    NEW.id,
    v_link.source_type,
    v_link.source_id,
    v_commission_int,
    (v_percent * 100.0),
    NULL
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;