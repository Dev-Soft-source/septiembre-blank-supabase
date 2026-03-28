-- Execute hotel data import from storage files
-- This calls the existing edge function to read and execute all SQL INSERT statements
SELECT extensions.http_post(
  'https://zlzsnpkddpshdyjlwxzv.supabase.co/functions/v1/execute-sql-from-storage',
  '{}'::text,
  'application/json'::text
) as hotel_data_import_result;