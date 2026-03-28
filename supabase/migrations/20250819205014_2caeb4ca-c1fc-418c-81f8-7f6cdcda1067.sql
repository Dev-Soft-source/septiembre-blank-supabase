-- Fix infinite recursion in hotels RLS policies
-- Replace the existing is_admin function without dropping it to avoid dependency issues

-- Step 1: Create a security definer function that bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_admin_status(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Use a direct query to admin_users without going through profiles
  -- This breaks the circular dependency that causes infinite recursion
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = user_id
  );
$$;

-- Step 2: Replace the existing is_admin function to use the security definer function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  -- Use the security definer function to avoid recursion
  SELECT public.get_user_admin_status(user_id);
$$;

-- Step 3: Fix the specific hotels table policies that are causing recursion
-- Drop and recreate only the problematic hotel policies

DROP POLICY IF EXISTS "Hotel owners can view their complete hotel data" ON public.hotels;
DROP POLICY IF EXISTS "Admins can manage all hotel data" ON public.hotels;

-- Create new simplified policies for hotels that don't cause recursion
CREATE POLICY "Hotel owners can view their complete hotel data" ON public.hotels
  FOR SELECT USING (
    -- Owner can see their hotels OR it's an approved hotel (public)
    owner_id = auth.uid() OR status = 'approved'
  );

CREATE POLICY "Admins can manage all hotel data" ON public.hotels
  FOR ALL USING (
    -- Use the security definer function to avoid recursion
    public.get_user_admin_status()
  );

-- Step 4: Ensure hotels SELECT policy allows public viewing of approved hotels
DROP POLICY IF EXISTS "Hotels are viewable by everyone" ON public.hotels;
CREATE POLICY "Public can view approved hotels" ON public.hotels
  FOR SELECT USING (
    status = 'approved' OR 
    owner_id = auth.uid() OR 
    public.get_user_admin_status()
  );