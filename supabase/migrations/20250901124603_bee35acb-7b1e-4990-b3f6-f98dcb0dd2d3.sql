-- Create a webhook to trigger auth-hook function on user signup
-- First, ensure we have the HTTP extension for webhooks
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create a trigger function that calls the auth-hook edge function
CREATE OR REPLACE FUNCTION public.trigger_auth_hook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only trigger for INSERT operations (new signups)
  IF TG_OP = 'INSERT' THEN
    -- Call the auth-hook edge function using http extension
    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/auth-hook',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || COALESCE(current_setting('app.settings.service_role_key', true), '')
        ),
        body := jsonb_build_object(
          'type', 'INSERT',
          'table', 'users',
          'record', jsonb_build_object(
            'id', NEW.id,
            'email', NEW.email,
            'email_confirmed_at', NEW.email_confirmed_at,
            'user_metadata', COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
          )
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table to call our function
CREATE TRIGGER trigger_auth_hook_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_auth_hook();

-- Also ensure the handle_association_email_verified_notify trigger exists
CREATE TRIGGER trigger_association_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_association_email_verified_notify();