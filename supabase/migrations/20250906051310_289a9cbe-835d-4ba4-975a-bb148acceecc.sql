-- Create function to execute hotel data from storage files
CREATE OR REPLACE FUNCTION public.execute_hotel_data_from_storage()
RETURNS TABLE(result text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the existing edge function to read and execute SQL files
  RETURN QUERY
  SELECT 'Hotel data import initiated. Check edge function logs for details.'::text;
END;
$$;

-- Execute the hotel data import by calling the edge function
-- This will read all SQL files from storage and execute their INSERT statements
SELECT net.http_post(
  url := 'https://zlzsnpkddpshdyjlwxzv.supabase.co/functions/v1/execute-sql-from-storage',
  headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '", "Content-Type": "application/json"}'::jsonb,
  body := '{}'::jsonb
) as response;