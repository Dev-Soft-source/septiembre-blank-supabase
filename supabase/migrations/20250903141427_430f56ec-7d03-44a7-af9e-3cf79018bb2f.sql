-- Test if admin function works and recreate missing policies only

-- Test the admin function first
SELECT public.is_admin_bypass_rls() as admin_test;

-- Drop and recreate only the policies that are needed for admin access
DROP POLICY IF EXISTS "hotels_admins_manage" ON public.hotels;
DROP POLICY IF EXISTS "bookings_admins_manage" ON public.bookings;

-- Recreate clean admin policies
CREATE POLICY "hotels_admins_manage" 
ON public.hotels 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

CREATE POLICY "bookings_admins_manage" 
ON public.bookings 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());