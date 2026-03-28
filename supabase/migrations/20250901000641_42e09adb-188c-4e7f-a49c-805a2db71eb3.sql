-- Fix the missing association record for the existing user
INSERT INTO hotel_associations (
  user_id,
  association_name,
  responsible_person,
  email,
  country,
  status
) VALUES (
  'eebd642b-3ad6-4750-ab8d-b31ba8faec75',
  'ANTES DE LANZARNOS',
  'ANTES DE LANZARNOS',
  'gaxo9j84mo@illubd.com',
  'España',
  'pending'
);

-- Create or update the admin notification trigger for association email confirmations  
CREATE OR REPLACE FUNCTION public.handle_association_email_verified_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only proceed when email just got confirmed and user has association role
  IF (TG_OP = 'UPDATE') AND 
     (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) AND
     (NEW.raw_user_meta_data ->> 'role' = 'association') THEN
    
    RAISE LOG 'Triggering admin notification for association email verification - User ID: %, Email: %', NEW.id, NEW.email;

    -- Call the admin notification edge function
    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := json_build_object(
          'user', json_build_object(
            'id', NEW.id,
            'email', NEW.email,
            'raw_user_meta_data', NEW.raw_user_meta_data
          ),
          'userData', json_build_object(
            'registration_source', 'association_email_verification',
            'association_name', NEW.raw_user_meta_data ->> 'association_name',
            'responsible_person', NEW.raw_user_meta_data ->> 'full_name',
            'country', NEW.raw_user_meta_data ->> 'country'
          )
        )::jsonb
      );
  END IF;
  RETURN NEW;
END;
$function$;

-- Create the trigger (will replace if exists)
DROP TRIGGER IF EXISTS association_email_verified_notify ON auth.users;
CREATE TRIGGER association_email_verified_notify
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_association_email_verified_notify();