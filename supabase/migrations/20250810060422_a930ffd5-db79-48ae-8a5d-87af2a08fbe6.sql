-- Performance Indexes: Hotels and Related Tables
-- IMPORTANT: For production, during a low-traffic window, prefer running the CONCURRENTLY variants below manually to avoid locks.
-- The executable statements in this migration use IF NOT EXISTS (non-concurrent) for safe, idempotent creation via the migration runner.

-- =============================
-- 1) HOTELS
-- =============================
-- PRODUCTION VARIANTS (commented):
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotels_status_country ON public.hotels(status, country);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotels_status_city ON public.hotels(status, city);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotels_status_property_type ON public.hotels(status, property_type);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotels_status_style ON public.hotels(status, style);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotels_status_price ON public.hotels(status, price_per_month);

-- Executable (non-concurrent) versions
CREATE INDEX IF NOT EXISTS idx_hotels_status_country ON public.hotels(status, country);
CREATE INDEX IF NOT EXISTS idx_hotels_status_city ON public.hotels(status, city);
CREATE INDEX IF NOT EXISTS idx_hotels_status_property_type ON public.hotels(status, property_type);
CREATE INDEX IF NOT EXISTS idx_hotels_status_style ON public.hotels(status, style);
CREATE INDEX IF NOT EXISTS idx_hotels_status_price ON public.hotels(status, price_per_month);

-- =============================
-- 2) HOTEL IMAGES
-- =============================
-- PRODUCTION VARIANTS (commented):
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_images_hotel_id ON public.hotel_images(hotel_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_images_hotel_main ON public.hotel_images(hotel_id) WHERE is_main = true;

-- Executable (non-concurrent) versions
CREATE INDEX IF NOT EXISTS idx_hotel_images_hotel_id ON public.hotel_images(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_images_hotel_main ON public.hotel_images(hotel_id) WHERE is_main = true;

-- =============================
-- 3) HOTEL THEMES
-- =============================
-- PRODUCTION VARIANTS (commented):
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_themes_hotel ON public.hotel_themes(hotel_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_themes_theme_hotel ON public.hotel_themes(theme_id, hotel_id);

-- Executable (non-concurrent) versions
CREATE INDEX IF NOT EXISTS idx_hotel_themes_hotel ON public.hotel_themes(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_themes_theme_hotel ON public.hotel_themes(theme_id, hotel_id);

-- =============================
-- 4) HOTEL ACTIVITIES
-- =============================
-- PRODUCTION VARIANTS (commented):
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_activities_hotel ON public.hotel_activities(hotel_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hotel_activities_activity_hotel ON public.hotel_activities(activity_id, hotel_id);

-- Executable (non-concurrent) versions
CREATE INDEX IF NOT EXISTS idx_hotel_activities_hotel ON public.hotel_activities(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_activities_activity_hotel ON public.hotel_activities(activity_id, hotel_id);

-- =============================
-- 5) BOOKINGS
-- =============================
-- Note: Some indexes on bookings may already exist from earlier phases (e.g., package_id, package_id+status).
-- These IF NOT EXISTS statements are additive and safe.
-- PRODUCTION VARIANTS (commented):
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_status ON public.bookings(status);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);

-- Executable (non-concurrent) versions
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);

-- =============================
-- 6) AVAILABILITY_PACKAGES (SKIPPED IF ALREADY PRESENT)
-- Already created in prior migrations:
--   - idx_availability_packages_hotel_date (hotel_id, start_date, end_date)
--   - idx_availability_packages_hotel_availability (hotel_id, available_rooms) WHERE available_rooms > 0
--   - idx_availability_packages_status_lookup / idx_availability_packages_future_dates
-- If missing in this environment, uncomment the CONCURRENTLY variants and run during the maintenance window.
-- PRODUCTION VARIANTS (commented):
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_availability_packages_hotel_date ON public.availability_packages(hotel_id, start_date, end_date);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_availability_packages_hotel_availability ON public.availability_packages(hotel_id, available_rooms) WHERE available_rooms > 0;
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_availability_packages_future_dates ON public.availability_packages(hotel_id, start_date);
