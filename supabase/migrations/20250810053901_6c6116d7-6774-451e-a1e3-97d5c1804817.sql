-- Phase 1: Security fixes

-- 1) Tighten hotels public read policies (remove permissive ones)
DROP POLICY IF EXISTS "Public can view hotels" ON public.hotels;
DROP POLICY IF EXISTS "Todos pueden ver hoteles" ON public.hotels;

-- 2) booking_commissions: restrict direct inserts
DROP POLICY IF EXISTS "Allow inserts into booking_commissions" ON public.booking_commissions;

-- Allow only admins to insert (manual admin ops); client apps should use SECURITY DEFINER RPC
CREATE POLICY "Admins can insert booking commissions"
ON public.booking_commissions
FOR INSERT
TO authenticated
WITH CHECK (is_admin_user());

-- 3) hotel_commission_link: enable RLS and restrict visibility to admins
ALTER TABLE public.hotel_commission_link ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view hotel commission link" ON public.hotel_commission_link;
CREATE POLICY "Admins can view hotel commission link"
ON public.hotel_commission_link
FOR SELECT
TO authenticated
USING (has_role('admin'));

-- 4) Replace hardcoded service role tokens in SQL functions with dynamic current_setting

-- trigger_batch_hotel_translations
CREATE OR REPLACE FUNCTION public.trigger_batch_hotel_translations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/batch-translate-hotels',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
      body := json_build_object(
        'languages', ARRAY[''es'', ''pt'', ''ro'']
      )::jsonb
    );
  RAISE LOG 'Batch hotel translation triggered successfully';
END;
$function$;

-- resend_hotel_admin_notification
CREATE OR REPLACE FUNCTION public.resend_hotel_admin_notification(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  profile_record RECORD;
  user_email TEXT;
BEGIN
  SELECT * INTO profile_record 
  FROM public.profiles 
  WHERE id = user_id AND (is_hotel_owner = true OR role = 'hotel_owner');
  IF profile_record IS NULL THEN
    RAISE LOG 'No hotel profile found for user: %', user_id;
    RETURN false;
  END IF;
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
      body := json_build_object(
        'user', json_build_object(
          'id', profile_record.id,
          'email', user_email
        ),
        'userData', json_build_object(
          'first_name', profile_record.first_name,
          'last_name', profile_record.last_name,
          'user_type', 'hotel',
          'registration_source', 'manual_resend',
          'is_hotel_owner', profile_record.is_hotel_owner,
          'role', profile_record.role
        )
      )::jsonb
    );
  RAISE LOG 'Manual admin notification sent for user: %', user_id;
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in resend_hotel_admin_notification: % for user: %', SQLERRM, user_id;
  RETURN false;
END;
$function$;

-- handle_user_email_verified_notify
CREATE OR REPLACE FUNCTION public.handle_user_email_verified_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) THEN
    RAISE LOG 'Triggering admin notification after email verification - User ID: %, Email: %', NEW.id, NEW.email;
    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
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
$function$;

-- handle_hotel_submission_notify
CREATE OR REPLACE FUNCTION public.handle_hotel_submission_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RAISE LOG 'Triggering admin notification for hotel submission - Hotel ID: %, Owner: %', NEW.id, NEW.owner_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-hotel-submission',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
      body := json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)
      )::jsonb
    );
  RETURN NEW;
END;
$function$;

-- handle_hotel_edit_notify
CREATE OR REPLACE FUNCTION public.handle_hotel_edit_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RAISE LOG 'Triggering admin notification for hotel edit - Hotel ID: %, Owner: %', NEW.id, NEW.owner_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-hotel-edit',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
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
$function$;

-- handle_hotel_recommendation_notify
CREATE OR REPLACE FUNCTION public.handle_hotel_recommendation_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RAISE LOG 'Triggering admin notification for hotel recommendation - Referral ID: %, User: %', NEW.id, NEW.user_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-recommendation',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
      body := json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)
      )::jsonb
    );
  RETURN NEW;
END;
$function$;

-- handle_booking_created_notify
CREATE OR REPLACE FUNCTION public.handle_booking_created_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RAISE LOG 'Triggering admin notification for booking created - Booking ID: %, User: %', NEW.id, NEW.user_id;
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-booking-created',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
      body := json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)
      )::jsonb
    );
  RETURN NEW;
END;
$function$;

-- handle_booking_cancelled_notify
CREATE OR REPLACE FUNCTION public.handle_booking_cancelled_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.status IS DISTINCT FROM NEW.status) AND (NEW.status = 'cancelled') THEN
    RAISE LOG 'Triggering admin notification for booking cancelled - Booking ID: %, User: %', NEW.id, NEW.user_id;
    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-booking-cancelled',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
        body := json_build_object(
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA,
          'record', row_to_json(NEW),
          'old_record', row_to_json(OLD)
        )::jsonb
      );
  END IF;
  RETURN NEW;
END;
$function$;

-- handle_join_us_submission
CREATE OR REPLACE FUNCTION public.handle_join_us_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RAISE LOG 'Join us submission trigger fired for submission ID: %', NEW.id;
  PERFORM
    net.http_post(
      url:='https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/send-join-us-notification',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting(''app.settings.service_role_key'', true) || '"}'::jsonb,
      body:=json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW),
        'old_record', null
      )::jsonb
    );
  RAISE LOG 'HTTP post to edge function completed for submission ID: %', NEW.id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_join_us_submission trigger: %', SQLERRM;
  RETURN NEW;
END;
$function$;