-- Fix the profiles_role_check constraint to allow 'hotel' role
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;

-- Add the updated constraint with 'hotel' included
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['guest'::text, 'hotel'::text, 'hotel_owner'::text, 'admin'::text, 'association'::text, 'promoter'::text]));