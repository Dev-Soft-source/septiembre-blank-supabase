-- Remove JotForm-related database elements

-- Drop JotForm-related tables
DROP TABLE IF EXISTS public.jotform_raw;
DROP TABLE IF EXISTS public.jotform_sync_logs;

-- Remove jotform_token column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS jotform_token;

-- Remove jotform_field_id column from filters table  
ALTER TABLE public.filters DROP COLUMN IF EXISTS jotform_field_id;

-- Drop JotForm-related functions
DROP FUNCTION IF EXISTS public.generate_jotform_token(uuid);
DROP FUNCTION IF EXISTS public.get_user_from_jotform_token(text);