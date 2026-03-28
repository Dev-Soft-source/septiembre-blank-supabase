-- Execute hotel data import from storage files (with exec_sql function now available)
-- This will read all SQL files from storage and execute their INSERT statements
SELECT extensions.http_post(
  'https://zlzsnpkddpshdyjlwxzv.supabase.co/functions/v1/execute-sql-from-storage',
  '{}',
  'application/json'
) as final_hotel_data_import;