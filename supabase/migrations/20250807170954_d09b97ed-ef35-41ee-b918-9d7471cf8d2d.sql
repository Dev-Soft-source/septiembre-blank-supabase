-- Create a trigger to send admin notifications for hotel registrations
-- This trigger fires after email confirmation when the profile is fully populated

CREATE OR REPLACE FUNCTION public.notify_admin_on_hotel_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
  user_confirmed_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Only proceed for hotel owners or admin users
  IF NEW.is_hotel_owner = true OR NEW.role = 'hotel_owner' THEN
    
    -- Get user email and confirmation status from auth.users
    SELECT au.email, au.email_confirmed_at 
    INTO user_email, user_confirmed_at
    FROM auth.users au 
    WHERE au.id = NEW.id;
    
    -- Only send notification if user is confirmed (or for manual profile updates)
    IF user_confirmed_at IS NOT NULL OR (OLD.id IS NOT NULL AND NEW.first_name IS NOT NULL) THEN
      
      RAISE LOG 'Triggering admin notification for hotel registration - User ID: %, Email: %', NEW.id, user_email;
      
      -- Call the Edge Function to send notification
      PERFORM
        net.http_post(
          url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
          headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
          body := json_build_object(
            'user', json_build_object(
              'id', NEW.id,
              'email', user_email
            ),
            'userData', json_build_object(
              'first_name', NEW.first_name,
              'last_name', NEW.last_name,
              'user_type', 'hotel',
              'registration_source', 'database_trigger',
              'is_hotel_owner', NEW.is_hotel_owner,
              'role', NEW.role
            )
          )::jsonb
        );
      
      RAISE LOG 'Admin notification HTTP post completed for user: %', NEW.id;
      
    END IF;
  END IF;
  
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the profile creation
  RAISE LOG 'Error in notify_admin_on_hotel_registration trigger: % for user: %', SQLERRM, NEW.id;
  RETURN NEW;
END;
$function$;

-- Create the trigger on profiles table
-- This triggers after INSERT or UPDATE when profile data changes
DROP TRIGGER IF EXISTS trigger_notify_admin_hotel_registration ON public.profiles;

CREATE TRIGGER trigger_notify_admin_hotel_registration
  AFTER INSERT OR UPDATE OF first_name, last_name, is_hotel_owner, role
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_hotel_registration();

-- Also create a manual function to resend notifications for existing users if needed
CREATE OR REPLACE FUNCTION public.resend_hotel_admin_notification(user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  profile_record RECORD;
  user_email TEXT;
BEGIN
  -- Get profile data
  SELECT * INTO profile_record 
  FROM public.profiles 
  WHERE id = user_id AND (is_hotel_owner = true OR role = 'hotel_owner');
  
  IF profile_record IS NULL THEN
    RAISE LOG 'No hotel profile found for user: %', user_id;
    RETURN false;
  END IF;
  
  -- Get user email
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  
  -- Send notification
  PERFORM
    net.http_post(
      url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
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