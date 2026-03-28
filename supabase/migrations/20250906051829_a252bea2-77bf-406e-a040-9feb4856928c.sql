-- Create exec_sql function to execute SQL queries from the edge function
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Execute the provided SQL query
  EXECUTE sql_query;
  RETURN 'SQL executed successfully';
EXCEPTION
  WHEN OTHERS THEN
    -- Return error message if execution fails
    RETURN 'Error: ' || SQLERRM;
END;
$$;