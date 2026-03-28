-- Fix infinite recursion in hotels RLS policies
-- The issue is caused by circular dependencies in the is_admin function

-- Step 1: Drop the existing problematic function
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Step 2: Create a new security definer function that bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_admin_status(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Use a direct query to admin_users without going through profiles
  -- This breaks the circular dependency
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = user_id
  );
$$;

-- Step 3: Create a simple admin check function that uses the security definer function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT public.get_user_admin_status(user_id);
$$;

-- Step 4: Update any problematic RLS policies on hotels table
-- First drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Hotels are viewable by everyone" ON public.hotels;
DROP POLICY IF EXISTS "Hotels can be inserted by authenticated users" ON public.hotels;
DROP POLICY IF EXISTS "Hotels can be updated by owner or admin" ON public.hotels;
DROP POLICY IF EXISTS "Hotels can be deleted by admin" ON public.hotels;

-- Create new simplified policies that don't cause recursion
CREATE POLICY "Hotels are viewable by everyone" ON public.hotels
  FOR SELECT USING (true);

CREATE POLICY "Hotels can be inserted by authenticated users" ON public.hotels
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Hotels can be updated by owner" ON public.hotels
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Admins can update all hotels" ON public.hotels
  FOR UPDATE USING (public.get_user_admin_status());

CREATE POLICY "Admins can delete hotels" ON public.hotels
  FOR DELETE USING (public.get_user_admin_status());