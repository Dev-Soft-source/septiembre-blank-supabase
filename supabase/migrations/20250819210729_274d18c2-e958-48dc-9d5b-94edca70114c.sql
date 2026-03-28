
-- Clean RLS fix for hotels table - Drop all existing policies and create 4 essential ones
-- This fixes the infinite recursion error by removing complex/overlapping policies

-- Step 1: Drop ALL existing RLS policies on the hotels table
DROP POLICY IF EXISTS "Admin users can manage all hotels" ON public.hotels;
DROP POLICY IF EXISTS "Admin users can view all hotels" ON public.hotels;
DROP POLICY IF EXISTS "Admins can manage all hotels" ON public.hotels;
DROP POLICY IF EXISTS "Admins can view all hotels" ON public.hotels;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.hotels;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.hotels;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.hotels;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can manage their hotels" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can update their hotels" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can view their hotels" ON public.hotels;
DROP POLICY IF EXISTS "Hotels are publicly readable" ON public.hotels;
DROP POLICY IF EXISTS "Owners can update their hotels" ON public.hotels;
DROP POLICY IF EXISTS "Public can view approved hotels" ON public.hotels;
DROP POLICY IF EXISTS "Secure admin can delete hotels" ON public.hotels;
DROP POLICY IF EXISTS "Secure admin can update hotels" ON public.hotels;
DROP POLICY IF EXISTS "System can update hotel status" ON public.hotels;
DROP POLICY IF EXISTS "Users can create hotels" ON public.hotels;
DROP POLICY IF EXISTS "Users can insert hotels" ON public.hotels;

-- Step 2: Create only 4 essential, non-recursive policies

-- 1. Public read for approved hotels
CREATE POLICY "approved_hotels_public_read" ON public.hotels
  FOR SELECT USING (status = 'approved');

-- 2. Authenticated users can insert new hotels
CREATE POLICY "authenticated_users_can_create" ON public.hotels
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Owners can update their own hotels
CREATE POLICY "owners_can_update_own" ON public.hotels
  FOR UPDATE USING (owner_id = auth.uid());

-- 4. Admins can manage all hotels (using the safe admin function)
CREATE POLICY "admins_can_manage_all" ON public.hotels
  FOR ALL USING (is_admin_bypass_rls());

-- Step 3: Ensure RLS is enabled
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
