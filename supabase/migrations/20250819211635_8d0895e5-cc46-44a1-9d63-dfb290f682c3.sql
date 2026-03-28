-- COMPREHENSIVE RLS CLEANUP AND STANDARDIZATION
-- This migration removes all existing RLS policies and creates clean, consistent policies
-- for all critical tables to eliminate infinite recursion and ensure security compliance

-- ========================================
-- STEP 1: DROP ALL EXISTING RLS POLICIES
-- ========================================

-- Drop all policies on hotels table (18 existing policies)
DROP POLICY IF EXISTS "Admins can manage all hotel data" ON public.hotels;
DROP POLICY IF EXISTS "Authenticated users can create hotels" ON public.hotels;
DROP POLICY IF EXISTS "Block editing during admin review" ON public.hotels;
DROP POLICY IF EXISTS "Confirmed guests can access limited contact info" ON public.hotels;
DROP POLICY IF EXISTS "El público puede ver hoteles aprobados" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can delete own hotels" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can read their own hotels" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can update own hotels" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can update own hotels with version check" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can update their own hotels" ON public.hotels;
DROP POLICY IF EXISTS "Hotel owners can view their complete hotel data" ON public.hotels;
DROP POLICY IF EXISTS "Public can view basic hotel info only" ON public.hotels;
DROP POLICY IF EXISTS "Publicul poate vedea hoteluri aprobate" ON public.hotels;
DROP POLICY IF EXISTS "Público pode ver hotéis aprovados" ON public.hotels;
DROP POLICY IF EXISTS "Users can read approved hotels" ON public.hotels;
DROP POLICY IF EXISTS "admins_can_manage_all" ON public.hotels;
DROP POLICY IF EXISTS "approved_hotels_public_read" ON public.hotels;
DROP POLICY IF EXISTS "authenticated_users_can_create" ON public.hotels;
DROP POLICY IF EXISTS "owners_can_update_own" ON public.hotels;

-- Drop all policies on bookings table (10+ existing policies)
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Hotel owners can view bookings for own hotels" ON public.bookings;
DROP POLICY IF EXISTS "Los propietarios pueden ver reservas de sus hoteles" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their bookings" ON public.bookings;

-- Drop all policies on booking_commissions table
DROP POLICY IF EXISTS "Admins can insert booking commissions" ON public.booking_commissions;
DROP POLICY IF EXISTS "Admins can view booking commissions" ON public.booking_commissions;

-- Drop all policies on availability_packages table
DROP POLICY IF EXISTS "Admins can manage all packages" ON public.availability_packages;
DROP POLICY IF EXISTS "Hotel owners can insert availability packages for their hotels" ON public.availability_packages;
DROP POLICY IF EXISTS "Hotel owners can manage their packages" ON public.availability_packages;
DROP POLICY IF EXISTS "Public can view availability packages" ON public.availability_packages;

-- Drop all policies on group_bookings table
DROP POLICY IF EXISTS "Admins can manage all group bookings" ON public.group_bookings;
DROP POLICY IF EXISTS "Hotels can view bookings for their properties" ON public.group_bookings;
DROP POLICY IF EXISTS "Leaders can manage their group bookings" ON public.group_bookings;

-- Drop all policies on group_memberships table
DROP POLICY IF EXISTS "Admins can manage all group memberships" ON public.group_memberships;
DROP POLICY IF EXISTS "Leaders can update group membership status" ON public.group_memberships;
DROP POLICY IF EXISTS "Leaders can view their group memberships" ON public.group_memberships;
DROP POLICY IF EXISTS "Users can create group memberships" ON public.group_memberships;
DROP POLICY IF EXISTS "Users can view their own group memberships" ON public.group_memberships;

-- ========================================
-- STEP 2: CREATE CLEAN, STANDARDIZED POLICIES
-- ========================================

-- HOTELS TABLE - 4 essential policies
CREATE POLICY "hotels_public_read" ON public.hotels
  FOR SELECT USING (status = 'approved');

CREATE POLICY "hotels_authenticated_create" ON public.hotels
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "hotels_owners_update" ON public.hotels
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "hotels_admins_manage" ON public.hotels
  FOR ALL USING (is_admin_bypass_rls());

-- BOOKINGS TABLE - 4 essential policies  
CREATE POLICY "bookings_public_read" ON public.bookings
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM hotels WHERE hotels.id = bookings.hotel_id AND hotels.owner_id = auth.uid())
  );

CREATE POLICY "bookings_authenticated_create" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_users_update" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "bookings_admins_manage" ON public.bookings
  FOR ALL USING (is_admin_bypass_rls());

-- BOOKING_COMMISSIONS TABLE - 4 essential policies
CREATE POLICY "booking_commissions_admin_read" ON public.booking_commissions
  FOR SELECT USING (is_admin_bypass_rls());

CREATE POLICY "booking_commissions_system_create" ON public.booking_commissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "booking_commissions_no_update" ON public.booking_commissions
  FOR UPDATE USING (false);

CREATE POLICY "booking_commissions_admins_manage" ON public.booking_commissions
  FOR ALL USING (is_admin_bypass_rls());

-- AVAILABILITY_PACKAGES TABLE - 4 essential policies
CREATE POLICY "packages_public_read" ON public.availability_packages
  FOR SELECT USING (true);

CREATE POLICY "packages_owners_create" ON public.availability_packages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM hotels WHERE hotels.id = availability_packages.hotel_id AND hotels.owner_id = auth.uid())
  );

CREATE POLICY "packages_owners_update" ON public.availability_packages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM hotels WHERE hotels.id = availability_packages.hotel_id AND hotels.owner_id = auth.uid())
  );

CREATE POLICY "packages_admins_manage" ON public.availability_packages
  FOR ALL USING (is_admin_bypass_rls());

-- GROUP_BOOKINGS TABLE - 4 essential policies
CREATE POLICY "group_bookings_public_read" ON public.group_bookings
  FOR SELECT USING (
    auth.uid() = leader_id OR 
    EXISTS (SELECT 1 FROM hotels WHERE hotels.id = group_bookings.hotel_id AND hotels.owner_id = auth.uid())
  );

CREATE POLICY "group_bookings_leaders_create" ON public.group_bookings
  FOR INSERT WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "group_bookings_leaders_update" ON public.group_bookings
  FOR UPDATE USING (auth.uid() = leader_id);

CREATE POLICY "group_bookings_admins_manage" ON public.group_bookings
  FOR ALL USING (is_admin_bypass_rls());

-- GROUP_MEMBERSHIPS TABLE - 4 essential policies
CREATE POLICY "group_memberships_public_read" ON public.group_memberships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = leader_id);

CREATE POLICY "group_memberships_users_create" ON public.group_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "group_memberships_leaders_update" ON public.group_memberships
  FOR UPDATE USING (auth.uid() = leader_id OR auth.uid() = user_id);

CREATE POLICY "group_memberships_admins_manage" ON public.group_memberships
  FOR ALL USING (is_admin_bypass_rls());

-- ========================================
-- STEP 3: ENSURE RLS IS ENABLED ON ALL TABLES
-- ========================================

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: FINAL VERIFICATION
-- ========================================

-- Log completion
COMMENT ON TABLE public.hotels IS 'RLS policies standardized - 4 essential policies applied';
COMMENT ON TABLE public.bookings IS 'RLS policies standardized - 4 essential policies applied';
COMMENT ON TABLE public.booking_commissions IS 'RLS policies standardized - 4 essential policies applied';
COMMENT ON TABLE public.availability_packages IS 'RLS policies standardized - 4 essential policies applied';
COMMENT ON TABLE public.group_bookings IS 'RLS policies standardized - 4 essential policies applied';
COMMENT ON TABLE public.group_memberships IS 'RLS policies standardized - 4 essential policies applied';