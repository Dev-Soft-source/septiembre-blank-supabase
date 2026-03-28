-- Update the trigger function to use the proper service role key
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
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.O7F1kRfZE4As7I5d22BCxkUjf5PDmIZdW_PMOCo7GQM'
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