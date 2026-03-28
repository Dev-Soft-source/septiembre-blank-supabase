
-- First, drop the problematic RLS policy that's causing infinite recursion
DROP POLICY IF EXISTS "Only admins can access admin data" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated users can read admin_users" ON public.admin_users;

-- Create a simple policy that allows any authenticated user to read admin_users
-- This prevents infinite recursion since it doesn't reference back to admin checks
CREATE POLICY "Allow admin verification" 
  ON public.admin_users 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Ensure the is_admin function works correctly without RLS issues
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = user_id
  );
$$;
