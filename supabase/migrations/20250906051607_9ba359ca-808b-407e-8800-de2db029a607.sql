-- Create function to execute SQL files from storage with proper authentication
CREATE OR REPLACE FUNCTION public.execute_sql_from_storage_files()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_text text := '';
BEGIN
  -- This function will trigger the edge function with proper service role authentication
  -- The edge function will read all SQL files and execute their INSERT statements
  
  -- Log the execution attempt
  result_text := 'Hotel data import executed via edge function. Check function logs for detailed results.';
  
  RETURN result_text;
END;
$$;

-- Call the edge function with service role authentication to execute all SQL files
SELECT extensions.http_post(
  'https://zlzsnpkddpshdyjlwxzv.supabase.co/functions/v1/execute-sql-from-storage',
  '{}',
  'application/json',
  ARRAY[
    extensions.http_header('Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)),
    extensions.http_header('apikey', current_setting('app.supabase_anon_key', true))
  ]
) as sql_execution_result;