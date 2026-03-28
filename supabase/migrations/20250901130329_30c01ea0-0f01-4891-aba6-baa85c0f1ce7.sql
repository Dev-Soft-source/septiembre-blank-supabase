-- Create trigger for hotel submissions to send admin notifications
CREATE OR REPLACE FUNCTION public.notify_admin_on_hotel_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only trigger for INSERT operations (new hotel submissions)
  IF TG_OP = 'INSERT' THEN
    -- Call the notify-admin-on-hotel-submission edge function
    PERFORM
      net.http_post(
        url := 'https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/notify-admin-on-hotel-submission',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.O7F1kRfZE4As7I5d22BCxkUjf5PDmIZdW_PMOCo7GQM'
        ),
        body := jsonb_build_object(
          'type', 'INSERT',
          'table', 'hotels',
          'record', row_to_json(NEW)
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_admin_on_hotel_submission ON public.hotels;

-- Create trigger for hotel submissions
CREATE TRIGGER trigger_notify_admin_on_hotel_submission
  AFTER INSERT ON public.hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_hotel_submission();