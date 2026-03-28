-- Phase 4: Performance & Scalability - Database optimization (Fixed)

-- CRITICAL FIX: Remove ALL existing policies on hotels table to fix infinite recursion
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT p.policyname 
        FROM pg_policies p 
        WHERE p.tablename = 'hotels' AND p.schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.hotels', policy_name);
    END LOOP;
END $$;

-- Create simplified, non-recursive RLS policies for hotels table
CREATE POLICY "Public can view approved hotels" ON public.hotels
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Hotel owners can view own hotels" ON public.hotels
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Hotel owners can update own hotels" ON public.hotels
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Hotel owners can insert hotels" ON public.hotels
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can manage all hotels" ON public.hotels
  FOR ALL USING (is_admin_simple());

-- Performance indexes for frequently queried tables
-- Hotels table optimization
CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels(status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_hotels_country_status ON public.hotels(country, status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_hotels_city_status ON public.hotels(city, status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_hotels_owner_id ON public.hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON public.hotels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hotels_price_range ON public.hotels(price_per_month) WHERE price_per_month > 0;
CREATE INDEX IF NOT EXISTS idx_hotels_featured ON public.hotels(is_featured) WHERE is_featured = true;

-- Activities table optimization
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_level_sort ON public.activities(level, sort_order);
CREATE INDEX IF NOT EXISTS idx_activities_parent_id ON public.activities(parent_id) WHERE parent_id IS NOT NULL;

-- Hotel activities join optimization
CREATE INDEX IF NOT EXISTS idx_hotel_activities_hotel_id ON public.hotel_activities(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_activities_activity_id ON public.hotel_activities(activity_id);

-- Hotel themes join optimization  
CREATE INDEX IF NOT EXISTS idx_hotel_themes_hotel_id ON public.hotel_themes(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_themes_theme_id ON public.hotel_themes(theme_id);

-- Bookings optimization
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_status ON public.bookings(hotel_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON public.bookings(package_id);

-- Availability packages optimization
CREATE INDEX IF NOT EXISTS idx_availability_hotel_dates ON public.availability_packages(hotel_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_availability_available_rooms ON public.availability_packages(available_rooms) WHERE available_rooms > 0;
CREATE INDEX IF NOT EXISTS idx_availability_start_date ON public.availability_packages(start_date) WHERE start_date >= CURRENT_DATE;

-- Profiles optimization
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_hotel_owner ON public.profiles(is_hotel_owner) WHERE is_hotel_owner = true;

-- Hotel referrals optimization
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_user_id ON public.hotel_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_created_at ON public.hotel_referrals(created_at DESC);

-- Hotel referrals submissions optimization  
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_submissions_user_id ON public.hotel_referrals_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_submissions_status ON public.hotel_referrals_submissions(status);

-- Favorites optimization
CREATE INDEX IF NOT EXISTS idx_favorites_user_hotel ON public.favorites(user_id, hotel_id);

-- Commission tracking optimization
CREATE INDEX IF NOT EXISTS idx_booking_commissions_booking_id ON public.booking_commissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_commissions_referred_by ON public.booking_commissions(referred_by);

-- Hotel images optimization
CREATE INDEX IF NOT EXISTS idx_hotel_images_hotel_main ON public.hotel_images(hotel_id, is_main);

-- User roles optimization
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON public.user_roles(email);

-- Admin users optimization
CREATE INDEX IF NOT EXISTS idx_admin_users_id ON public.admin_users(id);

-- Free nights rewards optimization
CREATE INDEX IF NOT EXISTS idx_free_nights_owner_status ON public.free_nights_rewards(owner_id, status);

-- Hotel translations optimization
CREATE INDEX IF NOT EXISTS idx_hotel_translations_hotel_lang ON public.hotel_translations(hotel_id, language_code);
CREATE INDEX IF NOT EXISTS idx_hotel_translations_status ON public.hotel_translations(translation_status);

-- Create composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_hotels_search_composite ON public.hotels(country, city, status, price_per_month) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_bookings_user_date_range ON public.bookings(user_id, check_in, check_out, status);
CREATE INDEX IF NOT EXISTS idx_availability_search ON public.availability_packages(hotel_id, start_date, available_rooms) WHERE available_rooms > 0;