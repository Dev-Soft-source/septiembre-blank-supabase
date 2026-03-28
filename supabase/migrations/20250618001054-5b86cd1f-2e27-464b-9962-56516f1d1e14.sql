
-- First, let's check and fix the admin_users table policies
-- Drop any existing problematic policies on admin_users
DROP POLICY IF EXISTS "Admin users can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Enable RLS on admin_users table if not already enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows any authenticated user to read admin_users
-- This prevents infinite recursion since it doesn't reference back to admin checks
CREATE POLICY "Authenticated users can read admin_users" 
  ON public.admin_users 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Also ensure the is_admin function works correctly without RLS issues
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
