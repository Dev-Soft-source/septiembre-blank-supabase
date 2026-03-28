-- Add room_type to availability_packages for per-room-type caps
ALTER TABLE public.availability_packages
ADD COLUMN IF NOT EXISTS room_type text;

-- Update enforce_price_caps to require specific room_type and apply exact cap with category-aware fallback
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

  -- Require room_type explicitly
  IF NEW.room_type IS NULL OR NEW.room_type NOT IN ('single','double') THEN
    RAISE EXCEPTION 'room_type is required and must be one of (single, double)';
  END IF;

  -- Determine hotel's category for this package
  SELECT h.category INTO v_category
  FROM public.hotels h
  WHERE h.id = NEW.hotel_id;

  -- Prefer exact category row; fallback to NULL category row for this duration and room_type
  SELECT pc.max_price_usd INTO v_cap
  FROM public.price_caps pc
  WHERE pc.duration_days = NEW.duration_days
    AND pc.room_type = NEW.room_type
    AND (pc.category = v_category OR pc.category IS NULL)
  ORDER BY (pc.category IS NULL) ASC
  LIMIT 1;

  -- If no cap found, block to avoid silent misconfiguration
  IF v_cap IS NULL THEN
    RAISE EXCEPTION 'No price cap configured for duration %, room_type %, category %', NEW.duration_days, NEW.room_type, COALESCE(v_category::text, 'default');
  END IF;

  -- On INSERT: base and current must both be <= cap
  IF TG_OP = 'INSERT' THEN
    IF NEW.base_price_usd > v_cap THEN
      RAISE EXCEPTION 'Base price (%) exceeds cap (%) for duration %, room_type %, category %', NEW.base_price_usd, v_cap, NEW.duration_days, NEW.room_type, COALESCE(v_category::text, 'default');
    END IF;
    IF NEW.current_price_usd > v_cap THEN
      RAISE EXCEPTION 'Current price (%) exceeds cap (%) for duration %, room_type %, category %', NEW.current_price_usd, v_cap, NEW.duration_days, NEW.room_type, COALESCE(v_category::text, 'default');
    END IF;
  ELSE
    -- On UPDATE: enforce only when fields are being edited (not during dynamic increase, already skipped above)
    IF NEW.base_price_usd IS DISTINCT FROM OLD.base_price_usd AND NEW.base_price_usd > v_cap THEN
      RAISE EXCEPTION 'Base price (%) exceeds cap (%) for duration %, room_type %, category %', NEW.base_price_usd, v_cap, NEW.duration_days, NEW.room_type, COALESCE(v_category::text, 'default');
    END IF;
    IF NEW.current_price_usd IS DISTINCT FROM OLD.current_price_usd AND NEW.current_price_usd > v_cap THEN
      RAISE EXCEPTION 'Current price (%) exceeds cap (%) for duration %, room_type %, category %', NEW.current_price_usd, v_cap, NEW.duration_days, NEW.room_type, COALESCE(v_category::text, 'default');
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