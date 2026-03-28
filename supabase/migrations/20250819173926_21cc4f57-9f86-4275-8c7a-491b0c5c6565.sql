-- CRITICAL SECURITY FIX #2: Add secure search_path to functions (Part 4 - Corrected)
-- Fix remaining functions with correct signatures only

-- Fix functions that exist with proper signatures
ALTER FUNCTION public.can_access_sensitive_hotel_data(uuid) SET search_path = 'public';
ALTER FUNCTION public.cleanup_expired_idempotency_keys() SET search_path = 'public';
ALTER FUNCTION public.cleanup_old_audit_logs() SET search_path = 'public';
ALTER FUNCTION public.cleanup_stuck_accounts() SET search_path = 'public';
ALTER FUNCTION public.check_version_conflict(uuid,integer) SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.increment_hotel_version() SET search_path = 'public';
ALTER FUNCTION public.resend_hotel_admin_notification(uuid) SET search_path = 'public';