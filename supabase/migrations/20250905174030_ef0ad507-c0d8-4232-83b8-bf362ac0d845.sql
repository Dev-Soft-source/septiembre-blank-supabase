-- Update function to use correct schema for http extension
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  -- Determine role from raw_user_meta_data, default to traveler
  DECLARE
    user_role text := COALESCE(NEW.raw_user_meta_data->>'role', 'traveler');
    user_name text := COALESCE(NEW.raw_user_meta_data->>'name', 'User');
    role_display text;
  BEGIN
    -- Determine role display name for notifications
    CASE user_role
      WHEN 'hotel_owner' THEN role_display := 'Hotel Owner';
      WHEN 'association' THEN role_display := 'Association';
      WHEN 'promoter' THEN role_display := 'Promoter';
      WHEN 'leader' THEN role_display := 'Leader';
      ELSE role_display := 'Traveler';
    END CASE;

    -- Insert profile with correct role
    INSERT INTO public.profiles (user_id, role, code, name, email)
    VALUES (
      NEW.id,
      user_role::user_role,
      CASE 
        WHEN user_role = 'hotel_owner' THEN 'HOTEL_' || substr(NEW.id::text, 1, 8)
        WHEN user_role = 'association' THEN 'ASSOC_' || substr(NEW.id::text, 1, 8)
        WHEN user_role = 'promoter' THEN 'PROMO_' || substr(NEW.id::text, 1, 8)
        WHEN user_role = 'leader' THEN 'LEAD_' || substr(NEW.id::text, 1, 8)
        ELSE 'USER_' || substr(NEW.id::text, 1, 8)
      END,
      user_name,
      NEW.email
    );
    
    -- Insert admin notification with correct role information
    INSERT INTO public.admin_notifications (event_type, entity_id, details)
    VALUES (
      'new_user_registration', 
      NEW.id, 
      jsonb_build_object(
        'email', NEW.email,
        'role', user_role,
        'name', user_name,
        'timestamp', NEW.created_at
      )
    );
    
    -- Call admin notification edge function directly using extensions schema
    PERFORM
      extensions.http_post(
        'https://zlzsnpkddpshdyjlwxzv.supabase.co/functions/v1/notify-admin-registration',
        jsonb_build_object(
          'userEmail', NEW.email,
          'role', user_role,
          'userData', NEW.raw_user_meta_data
        )::text,
        'application/json',
        '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsenNucGtkZHBzaGR5amx3eHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgzNTIxOCwiZXhwIjoyMDcyNDExMjE4fQ.BE-7rCg3jP_06AtJY6OBEQ7xH-Yx9JJLmJutgNyDJH0"}'::jsonb
      );
    
    RETURN NEW;
  END;
END;
$$;