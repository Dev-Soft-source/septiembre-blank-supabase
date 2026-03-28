-- Fix infinite recursion in RLS policies by creating a non-recursive admin check

-- Step 1: Create a new security definer function that bypasses RLS completely
CREATE OR REPLACE FUNCTION public.is_admin_secure(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Direct query to admin_users without RLS to break recursion
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = COALESCE(user_id, auth.uid())
  );
$$;

-- Step 2: Replace the existing is_admin function to use the secure version
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT public.is_admin_secure(user_id);
$$;

-- Step 3: Create simpler RLS policies for hotels to avoid recursion
-- Drop and recreate the policies that might be causing issues

-- First, let's check if there are problematic policies and replace them
DROP POLICY IF EXISTS "Enable read access for all users" ON public.hotels;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.hotels;  
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.hotels;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.hotels;

-- Create simple, non-recursive policies
CREATE POLICY "Hotels are publicly readable" ON public.hotels
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create hotels" ON public.hotels
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update their hotels" ON public.hotels
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Secure admin can update hotels" ON public.hotels
  FOR UPDATE USING (public.is_admin_secure());

CREATE POLICY "Secure admin can delete hotels" ON public.hotels
  FOR DELETE USING (public.is_admin_secure());