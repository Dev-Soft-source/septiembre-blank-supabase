-- Create a function to manually trigger admin notifications for existing associations
CREATE OR REPLACE FUNCTION public.trigger_missed_association_notifications()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  assoc_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  -- Loop through all associations created in the last 48 hours
  FOR assoc_record IN 
    SELECT a.*, au.email, au.raw_user_meta_data
    FROM public.associations a
    JOIN auth.users au ON a.user_id = au.id
    WHERE a.created_at > now() - interval '48 hours'
    AND au.raw_user_meta_data ->> 'role' = 'association'
  LOOP
    -- Call the admin notification edge function for each association
    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-registration',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.O7F1kRfZE4As7I5d22BCxkUjf5PDmIZdW_PMOCo7GQM'
        ),
        body := jsonb_build_object(
          'user', jsonb_build_object(
            'id', assoc_record.user_id,
            'email', assoc_record.email,
            'raw_user_meta_data', assoc_record.raw_user_meta_data
          ),
          'userData', jsonb_build_object(
            'registration_source', 'missed_association_notification',
            'association_name', assoc_record.association_name,
            'responsible_person', assoc_record.responsible_person,
            'country', assoc_record.country,
            'referral_code', assoc_record.referral_code
          )
        )
      );
    
    notification_count := notification_count + 1;
    
    RAISE LOG 'Triggered missed admin notification for association: % (%) - User ID: %', 
      assoc_record.association_name, assoc_record.email, assoc_record.user_id;
  END LOOP;
  
  RETURN format('Triggered %s admin notifications for missed associations', notification_count);
END;
$$;

-- Execute the function to send notifications for existing associations
SELECT public.trigger_missed_association_notifications();