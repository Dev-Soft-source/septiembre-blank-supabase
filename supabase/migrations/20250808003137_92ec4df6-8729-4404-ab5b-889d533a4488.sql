-- 1) Create deduplication table
CREATE TABLE IF NOT EXISTS public.admin_notification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, event)
);

-- Enable RLS (service role bypasses it; no public policies by default)
ALTER TABLE public.admin_notification_events ENABLE ROW LEVEL SECURITY;

-- 2) Post-verification notification trigger on auth.users
CREATE OR REPLACE FUNCTION public.handle_user_email_verified_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only proceed when email just got confirmed
  IF (TG_OP = 'UPDATE') AND (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) THEN
    RAISE LOG 'Triggering admin notification after email verification - User ID: %, Email: %', NEW.id, NEW.email;

    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
        body := json_build_object(
          'user', json_build_object(
            'id', NEW.id,
            'email', NEW.email
          ),
          'userData', json_build_object(
            'registration_source', 'email_verification'
          )
        )::jsonb
      );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_user_email_verified_notify ON auth.users;
CREATE TRIGGER trigger_user_email_verified_notify
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_user_email_verified_notify();

-- 3) Hotel submission notification (AFTER INSERT on public.hotels)
CREATE OR REPLACE FUNCTION public.handle_hotel_submission_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE LOG 'Triggering admin notification for hotel submission - Hotel ID: %, Owner: %', NEW.id, NEW.owner_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-hotel-submission',
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

DROP TRIGGER IF EXISTS trigger_hotel_submission_notify ON public.hotels;
CREATE TRIGGER trigger_hotel_submission_notify
AFTER INSERT ON public.hotels
FOR EACH ROW
EXECUTE PROCEDURE public.handle_hotel_submission_notify();

-- 4) Hotel edit notification (AFTER UPDATE on public.hotels)
CREATE OR REPLACE FUNCTION public.handle_hotel_edit_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE LOG 'Triggering admin notification for hotel edit - Hotel ID: %, Owner: %', NEW.id, NEW.owner_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-hotel-edit',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
      body := json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD)
      )::jsonb
    );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_hotel_edit_notify ON public.hotels;
CREATE TRIGGER trigger_hotel_edit_notify
AFTER UPDATE ON public.hotels
FOR EACH ROW
EXECUTE PROCEDURE public.handle_hotel_edit_notify();

-- 5) Hotel recommendation notification (AFTER INSERT on public.hotel_referrals)
CREATE OR REPLACE FUNCTION public.handle_hotel_recommendation_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE LOG 'Triggering admin notification for hotel recommendation - Referral ID: %, User: %', NEW.id, NEW.user_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-recommendation',
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

DROP TRIGGER IF EXISTS trigger_hotel_recommendation_notify ON public.hotel_referrals;
CREATE TRIGGER trigger_hotel_recommendation_notify
AFTER INSERT ON public.hotel_referrals
FOR EACH ROW
EXECUTE PROCEDURE public.handle_hotel_recommendation_notify();