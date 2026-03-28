-- Fix the profiles role constraint to allow all required roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add updated constraint that includes association and promoter roles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('guest', 'hotel_owner', 'admin', 'association', 'promoter'));