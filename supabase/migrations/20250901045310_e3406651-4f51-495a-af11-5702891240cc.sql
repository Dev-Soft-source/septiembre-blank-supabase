-- First, let's check if the trigger exists but wasn't caught by the previous query
SELECT 
  pg_trigger.tgname as trigger_name,
  pg_class.relname as table_name,
  pg_proc.proname as function_name
FROM pg_trigger 
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE pg_class.relname = 'users' AND pg_class.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth');