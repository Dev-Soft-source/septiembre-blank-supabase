-- CRITICAL SECURITY FIX #2: Add secure search_path to functions (Part 2)
-- Continue fixing functions missing secure search_path

-- Fix more critical functions
ALTER FUNCTION public.assign_dual_roles_to_user(text) SET search_path = 'public';
ALTER FUNCTION public.assign_user_role(uuid,text,text) SET search_path = 'public';

-- Fix booking and package functions that need secure search_path
ALTER FUNCTION public.check_package_availability(uuid,integer) SET search_path = 'public';
ALTER FUNCTION public.check_package_availability_enhanced(uuid,integer) SET search_path = 'public';
ALTER FUNCTION public.reserve_package_rooms_enhanced(uuid,integer) SET search_path = 'public';
ALTER FUNCTION public.restore_package_availability_enhanced(uuid,integer) SET search_path = 'public';

-- Fix commission and audit functions
ALTER FUNCTION public.create_booking_commission(uuid,text,numeric,numeric) SET search_path = 'public';
ALTER FUNCTION public.check_rate_limit(text,text,integer,integer) SET search_path = 'public';

-- Fix user and role management functions
ALTER FUNCTION public.has_role(text) SET search_path = 'public';
ALTER FUNCTION public.get_my_roles() SET search_path = 'public';
ALTER FUNCTION public.is_admin(uuid) SET search_path = 'public';
ALTER FUNCTION public.is_admin_simple() SET search_path = 'public';
ALTER FUNCTION public.is_admin_user() SET search_path = 'public';