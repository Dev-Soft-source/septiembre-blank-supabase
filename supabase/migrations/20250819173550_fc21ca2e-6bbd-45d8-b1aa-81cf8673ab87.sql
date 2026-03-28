-- CRITICAL SECURITY FIX #2: Add secure search_path to functions (Part 3)
-- Fix the create_booking_commission function and other remaining functions

-- Fix create_booking_commission with correct signature
ALTER FUNCTION public.create_booking_commission(uuid,text,uuid,numeric,numeric,text) SET search_path = 'public';

-- Fix more functions that need search_path
ALTER FUNCTION public.auto_apply_commission_on_confirm() SET search_path = 'public';
ALTER FUNCTION public.calculate_leader_commission() SET search_path = 'public';
ALTER FUNCTION public.can_access_sensitive_hotel_data() SET search_path = 'public';
ALTER FUNCTION public.check_email_role_exists(text) SET search_path = 'public';
ALTER FUNCTION public.check_version_conflict(uuid,integer) SET search_path = 'public';
ALTER FUNCTION public.cleanup_expired_idempotency_keys() SET search_path = 'public';
ALTER FUNCTION public.cleanup_old_audit_logs(interval) SET search_path = 'public';
ALTER FUNCTION public.cleanup_stale_hotel_locks() SET search_path = 'public';
ALTER FUNCTION public.cleanup_stuck_accounts() SET search_path = 'public';