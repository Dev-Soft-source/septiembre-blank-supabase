-- Phase 4: Performance & Scalability - Simple indexing optimization

-- Performance indexes for frequently queried tables (without function predicates)
-- Hotels table optimization
CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_country ON public.hotels(country);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON public.hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_owner_id ON public.hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON public.hotels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hotels_price_per_month ON public.hotels(price_per_month);
CREATE INDEX IF NOT EXISTS idx_hotels_is_featured ON public.hotels(is_featured);

-- Activities table optimization
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_level ON public.activities(level);
CREATE INDEX IF NOT EXISTS idx_activities_sort_order ON public.activities(sort_order);
CREATE INDEX IF NOT EXISTS idx_activities_parent_id ON public.activities(parent_id);

-- Hotel activities join optimization
CREATE INDEX IF NOT EXISTS idx_hotel_activities_hotel_id ON public.hotel_activities(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_activities_activity_id ON public.hotel_activities(activity_id);

-- Hotel themes join optimization  
CREATE INDEX IF NOT EXISTS idx_hotel_themes_hotel_id ON public.hotel_themes(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_themes_theme_id ON public.hotel_themes(theme_id);

-- Bookings optimization
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON public.bookings(package_id);

-- Availability packages optimization
CREATE INDEX IF NOT EXISTS idx_availability_hotel_id ON public.availability_packages(hotel_id);
CREATE INDEX IF NOT EXISTS idx_availability_start_date ON public.availability_packages(start_date);
CREATE INDEX IF NOT EXISTS idx_availability_end_date ON public.availability_packages(end_date);
CREATE INDEX IF NOT EXISTS idx_availability_available_rooms ON public.availability_packages(available_rooms);

-- Profiles optimization
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_hotel_owner ON public.profiles(is_hotel_owner);

-- Hotel referrals optimization
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_user_id ON public.hotel_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_created_at ON public.hotel_referrals(created_at DESC);

-- Hotel referrals submissions optimization  
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_submissions_user_id ON public.hotel_referrals_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_referrals_submissions_status ON public.hotel_referrals_submissions(status);

-- Favorites optimization
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_hotel_id ON public.favorites(hotel_id);

-- Commission tracking optimization
CREATE INDEX IF NOT EXISTS idx_booking_commissions_booking_id ON public.booking_commissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_commissions_referred_by ON public.booking_commissions(referred_by);

-- Hotel images optimization
CREATE INDEX IF NOT EXISTS idx_hotel_images_hotel_id ON public.hotel_images(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_images_is_main ON public.hotel_images(is_main);

-- User roles optimization
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON public.user_roles(email);

-- Free nights rewards optimization
CREATE INDEX IF NOT EXISTS idx_free_nights_owner_id ON public.free_nights_rewards(owner_id);
CREATE INDEX IF NOT EXISTS idx_free_nights_status ON public.free_nights_rewards(status);

-- Hotel translations optimization
CREATE INDEX IF NOT EXISTS idx_hotel_translations_hotel_id ON public.hotel_translations(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_translations_language_code ON public.hotel_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_hotel_translations_status ON public.hotel_translations(translation_status);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_hotels_country_city_status ON public.hotels(country, city, status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_availability_hotel_dates ON public.availability_packages(hotel_id, start_date, end_date);