-- Execute hotel data import from storage files (now public function)
-- This will read all SQL files from storage and execute their INSERT statements
SELECT extensions.http_post(
  'https://zlzsnpkddpshdyjlwxzv.supabase.co/functions/v1/execute-sql-from-storage',
  '{}',
  'application/json'
) as hotel_data_import_final_result;