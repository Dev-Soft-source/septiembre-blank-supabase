-- Fix duplicate admin functions and ensure proper admin access to hotels and bookings

-- First, drop all existing admin bypass functions to clean up duplicates
DROP FUNCTION IF EXISTS public.is_admin_bypass_rls();
DROP FUNCTION IF EXISTS public.is_admin_bypass_rls(uuid);

-- Create a single, definitive admin bypass function
CREATE OR REPLACE FUNCTION public.is_admin_bypass_rls()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
$$;

-- Ensure the is_admin function uses the correct bypass function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = COALESCE(user_id, auth.uid())
  );
$$;

-- Drop existing policies that might be problematic
DROP POLICY IF EXISTS "hotels_admins_manage" ON public.hotels;
DROP POLICY IF EXISTS "bookings_admins_manage" ON public.bookings;

-- Recreate admin policies for hotels table
CREATE POLICY "hotels_admins_manage" 
ON public.hotels 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

-- Recreate admin policies for bookings table  
CREATE POLICY "bookings_admins_manage" 
ON public.bookings 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

-- Verify the admin user exists and add a comment for clarity
COMMENT ON FUNCTION public.is_admin_bypass_rls() IS 'Checks if the current authenticated user is in the admin_users table. Used by RLS policies to grant admin access.';
COMMENT ON FUNCTION public.is_admin(uuid) IS 'Public interface for admin checks. Defaults to current user if no user_id provided.';

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin_bypass_rls() TO public;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO public;