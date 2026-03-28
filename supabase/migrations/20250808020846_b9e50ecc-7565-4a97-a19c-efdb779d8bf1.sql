
-- 1) Ensure referred_by exists (idempotent) on hotels
ALTER TABLE public.hotels
  ADD COLUMN IF NOT EXISTS referred_by text;

-- 2) Create booking_commissions table
CREATE TABLE IF NOT EXISTS public.booking_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  referred_by text NOT NULL,
  commission_usd numeric(12,2) NOT NULL,
  commission_percent numeric(8,6) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and keep table private (only inserts via trigger are needed)
ALTER TABLE public.booking_commissions ENABLE ROW LEVEL SECURITY;

-- Allow admins to view commissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'booking_commissions'
      AND policyname = 'Admins can view booking commissions'
  ) THEN
    CREATE POLICY "Admins can view booking commissions"
      ON public.booking_commissions
      FOR SELECT
      USING (public.is_admin_user());
  END IF;
END$$;

-- Allow inserts (trigger will run under the user session; keep it permissive but scoped to this table)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'booking_commissions'
      AND policyname = 'Allow inserts into booking_commissions'
  ) THEN
    CREATE POLICY "Allow inserts into booking_commissions"
      ON public.booking_commissions
      FOR INSERT
      WITH CHECK (true);
  END IF;
END$$;

-- 3) BEFORE UPDATE trigger to lock hotels.referred_by unless admin
CREATE OR REPLACE FUNCTION public.enforce_referred_by_readonly()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.referred_by IS DISTINCT FROM OLD.referred_by
     AND NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'referred_by is read-only and may only be modified by an administrator';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_referred_by_readonly ON public.hotels;
CREATE TRIGGER trg_enforce_referred_by_readonly
BEFORE UPDATE OF referred_by ON public.hotels
FOR EACH ROW
EXECUTE FUNCTION public.enforce_referred_by_readonly();

-- 4) AFTER INSERT ON bookings: calculate and insert commission row
CREATE OR REPLACE FUNCTION public.calculate_booking_commission_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_referred_by text;
  v_hotel_created_at timestamptz;
  v_months_since integer;
  v_percent numeric(8,6);
  v_commission numeric(12,2);
BEGIN
  -- Pull the canonical referral code and anchor date from hotels
  SELECT h.referred_by, h.created_at
  INTO v_referred_by, v_hotel_created_at
  FROM public.hotels h
  WHERE h.id = NEW.hotel_id;

  -- If no referral code, exit without creating commission
  IF v_referred_by IS NULL OR v_referred_by = '' THEN
    RETURN NEW;
  END IF;

  -- Months since the hotel creation, anchored to hotels.created_at vs booking creation time
  v_months_since :=
    GREATEST(
      0,
      (date_part('year', age(NEW.created_at, v_hotel_created_at))::int * 12)
      + date_part('month', age(NEW.created_at, v_hotel_created_at))::int
    );

  -- Determine commission percent strictly by prefix rules
  IF v_referred_by LIKE 'A\_%' ESCAPE '\' THEN
    v_percent := 0.04; -- Associations
  ELSIF v_referred_by LIKE 'PROMO\_%' ESCAPE '\' THEN
    IF v_months_since < 18 THEN
      v_percent := 0.005; -- First 18 months (0–17)
    ELSE
      v_percent := 0.0025; -- From month 18 onwards permanently
    END IF;
  ELSIF v_referred_by LIKE 'AGENT\_%' ESCAPE '\' THEN
    v_percent := 0.0025; -- Agents
  ELSE
    -- Unknown prefix => do not create a commission
    RETURN NEW;
  END IF;

  -- Compute commission based on bookings.total_price (USD)
  v_commission := ROUND((NEW.total_price::numeric * v_percent), 2);

  -- Insert commission row
  INSERT INTO public.booking_commissions (booking_id, referred_by, commission_usd, commission_percent)
  VALUES (NEW.id, v_referred_by, v_commission, v_percent);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calculate_booking_commission_after_insert ON public.bookings;
CREATE TRIGGER trg_calculate_booking_commission_after_insert
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.calculate_booking_commission_after_insert();

-- 5) Minimal logs table for commission notification attempts (isolated)
CREATE TABLE IF NOT EXISTS public.commission_notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_commission_id uuid NOT NULL REFERENCES public.booking_commissions(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  referred_by text NOT NULL,
  recipient_email text NOT NULL,
  commission_usd numeric(12,2) NOT NULL,
  status_code integer,
  response_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_notification_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='commission_notification_logs'
      AND policyname='Admins can view commission notification logs'
  ) THEN
    CREATE POLICY "Admins can view commission notification logs"
      ON public.commission_notification_logs
      FOR SELECT
      USING (public.is_admin_user());
  END IF;
END$$;

-- 6) AFTER INSERT ON booking_commissions: invoke edge function to email admin
CREATE OR REPLACE FUNCTION public.notify_admin_on_booking_commission_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_headers jsonb := '{
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"
  }'::jsonb;
  v_url text := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-commission-created';
  v_payload jsonb;
BEGIN
  -- Prepare payload (edge function will send the email and write a log)
  v_payload := jsonb_build_object(
    'booking_commission_id', NEW.id,
    'booking_id', NEW.booking_id,
    'referred_by', NEW.referred_by,
    'commission_usd', NEW.commission_usd,
    'commission_percent', NEW.commission_percent,
    'admin_email', 'grand_soiree@yahoo.com'
  );

  PERFORM
    net.http_post(
      url := v_url,
      headers := v_headers,
      body := v_payload
    );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admin_on_booking_commission_after_insert ON public.booking_commissions;
CREATE TRIGGER trg_notify_admin_on_booking_commission_after_insert
AFTER INSERT ON public.booking_commissions
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_booking_commission_after_insert();
