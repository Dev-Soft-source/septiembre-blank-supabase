
-- Create a function that will be triggered when a new submission is inserted
CREATE OR REPLACE FUNCTION public.handle_join_us_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to send notification
  PERFORM
    net.http_post(
      url:='https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/send-join-us-notification',
      body:=json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW),
        'old_record', null
      )::jsonb
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to call the function when a new submission is inserted
DROP TRIGGER IF EXISTS on_join_us_submission_inserted ON public.join_us_submissions;
CREATE TRIGGER on_join_us_submission_inserted
  AFTER INSERT ON public.join_us_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_join_us_submission();

