-- Step 4: Recreate essential admin policies for hotels and bookings

-- Recreate admin policy for hotels table (critical for admin dashboard)
CREATE POLICY "hotels_admins_manage" 
ON public.hotels 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

-- Recreate admin policy for bookings table (critical for admin dashboard)  
CREATE POLICY "bookings_admins_manage" 
ON public.bookings 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

-- Recreate other critical admin policies
CREATE POLICY "booking_commissions_admins_manage" 
ON public.booking_commissions 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

CREATE POLICY "packages_admins_manage" 
ON public.availability_packages 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

CREATE POLICY "group_bookings_admins_manage" 
ON public.group_bookings 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

CREATE POLICY "group_memberships_admins_manage" 
ON public.group_memberships 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

CREATE POLICY "admin_notification_events_admin_read" 
ON public.admin_notification_events 
FOR SELECT 
TO public
USING (public.is_admin_bypass_rls());

CREATE POLICY "diagram_admin_manage" 
ON public."DIAGRAM HOTEL-LIVING" 
FOR ALL 
TO public
USING (public.is_admin_bypass_rls())
WITH CHECK (public.is_admin_bypass_rls());

-- Grant execute permissions to ensure the function works
GRANT EXECUTE ON FUNCTION public.is_admin_bypass_rls() TO public;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO public;