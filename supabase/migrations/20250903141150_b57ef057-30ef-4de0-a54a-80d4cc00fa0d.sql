-- Step 1: Drop all policies that depend on the duplicate admin functions
DROP POLICY IF EXISTS "hotels_admins_manage" ON public.hotels;
DROP POLICY IF EXISTS "bookings_admins_manage" ON public.bookings;
DROP POLICY IF EXISTS "booking_commissions_admin_read" ON public.booking_commissions;
DROP POLICY IF EXISTS "booking_commissions_admins_manage" ON public.booking_commissions;
DROP POLICY IF EXISTS "packages_admins_manage" ON public.availability_packages;
DROP POLICY IF EXISTS "group_bookings_admins_manage" ON public.group_bookings;
DROP POLICY IF EXISTS "group_memberships_admins_manage" ON public.group_memberships;
DROP POLICY IF EXISTS "admin_notification_events_admin_read" ON public.admin_notification_events;
DROP POLICY IF EXISTS "diagram_admin_manage" ON public."DIAGRAM HOTEL-LIVING";

-- Step 2: Now drop the duplicate functions
DROP FUNCTION IF EXISTS public.is_admin_bypass_rls() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_bypass_rls(uuid) CASCADE;

-- Step 3: Create a single, clean admin bypass function
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