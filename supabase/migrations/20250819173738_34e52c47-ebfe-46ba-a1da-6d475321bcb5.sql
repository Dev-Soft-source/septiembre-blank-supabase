-- CRITICAL SECURITY FIX #2: Add secure search_path to functions (Part 4)
-- Fix remaining functions that need search_path from the query results

-- Fix functions that are in the query results and still need search_path
ALTER FUNCTION public.can_access_sensitive_hotel_data(uuid) SET search_path = 'public';
ALTER FUNCTION public.cleanup_expired_idempotency_keys() SET search_path = 'public';
ALTER FUNCTION public.cleanup_old_audit_logs() SET search_path = 'public';
ALTER FUNCTION public.cleanup_stuck_accounts() SET search_path = 'public';
ALTER FUNCTION public.check_version_conflict(uuid,integer) SET search_path = 'public';

-- Fix more critical security functions
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.increment_hotel_version() SET search_path = 'public';
ALTER FUNCTION public.lock_hotel_for_editing(uuid,uuid) SET search_path = 'public';
ALTER FUNCTION public.submit_hotel_registration(jsonb,jsonb[],jsonb[],text[],text[]) SET search_path = 'public';

-- Fix notification and audit functions  
ALTER FUNCTION public.resend_hotel_admin_notification(uuid) SET search_path = 'public';