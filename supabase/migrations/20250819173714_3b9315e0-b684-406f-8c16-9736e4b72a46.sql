-- CRITICAL SECURITY FIX #2: Add secure search_path to functions (Part 3 - Corrected)
-- Fix only the functions that actually exist

-- Fix create_booking_commission with correct signature
ALTER FUNCTION public.create_booking_commission(uuid,text,uuid,numeric,numeric,text) SET search_path = 'public';

-- Fix trigger functions
ALTER FUNCTION public.auto_apply_commission_on_confirm() SET search_path = 'public';
ALTER FUNCTION public.calculate_leader_commission() SET search_path = 'public';
ALTER FUNCTION public.check_email_role_exists(text) SET search_path = 'public';
ALTER FUNCTION public.cleanup_stale_hotel_locks() SET search_path = 'public';

-- Fix hotel management functions
ALTER FUNCTION public.create_hotel_free_nights_reward() SET search_path = 'public';
ALTER FUNCTION public.create_user_referral_reward() SET search_path = 'public';
ALTER FUNCTION public.delete_auth_user_by_email(text) SET search_path = 'public';

-- Fix utility functions
ALTER FUNCTION public.generate_agent_code(text,text) SET search_path = 'public';
ALTER FUNCTION public.generate_association_code(text) SET search_path = 'public';