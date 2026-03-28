-- Fix security warnings - Add missing RLS policies and secure function search paths

-- Fix function search paths for existing functions with mutable search path
ALTER FUNCTION public.is_admin(uuid) SET search_path = public;
ALTER FUNCTION public.can_access_sensitive_hotel_data(uuid) SET search_path = public; 
ALTER FUNCTION public.cleanup_stuck_accounts() SET search_path = public;
ALTER FUNCTION public.reserve_package_rooms(uuid, integer) SET search_path = public;
ALTER FUNCTION public.restore_package_availability(uuid, integer) SET search_path = public;
ALTER FUNCTION public.detect_incomplete_signups() SET search_path = public;
ALTER FUNCTION public.validate_hotel_images() SET search_path = public;
ALTER FUNCTION public.delete_auth_user_by_email(text) SET search_path = public;
ALTER FUNCTION public.cleanup_stale_hotel_locks() SET search_path = public;
ALTER FUNCTION public.update_package_availability_on_booking() SET search_path = public;
ALTER FUNCTION public.generate_agent_code(text, text) SET search_path = public;
ALTER FUNCTION public.check_version_conflict(uuid, integer) SET search_path = public;
ALTER FUNCTION public.lock_hotel_for_editing(uuid, boolean) SET search_path = public;
ALTER FUNCTION public.set_leader_referral_code() SET search_path = public;
ALTER FUNCTION public.create_hotel_free_nights_reward() SET search_path = public;
ALTER FUNCTION public.check_package_overlap() SET search_path = public;
ALTER FUNCTION public.generate_code_suffix() SET search_path = public;
ALTER FUNCTION public.generate_code_digits() SET search_path = public;
ALTER FUNCTION public.code_contains_o(text) SET search_path = public;
ALTER FUNCTION public.set_association_code() SET search_path = public;
ALTER FUNCTION public.generate_commission_entity_code(text) SET search_path = public;
ALTER FUNCTION public.calculate_leader_commission() SET search_path = public;
ALTER FUNCTION public.generate_non_commission_entity_code(text) SET search_path = public;
ALTER FUNCTION public.validate_commission_entity_code(text, text) SET search_path = public;
ALTER FUNCTION public.validate_non_commission_entity_code(text, text) SET search_path = public;
ALTER FUNCTION public.assign_dual_roles_to_user(text) SET search_path = public;
ALTER FUNCTION public.handle_booking_notify_parties() SET search_path = public;
ALTER FUNCTION public.set_agent_code() SET search_path = public;
ALTER FUNCTION public.set_association_user_id() SET search_path = public;
ALTER FUNCTION public.update_hotel_available_months() SET search_path = public;
ALTER FUNCTION public.get_unique_countries() SET search_path = public;
ALTER FUNCTION public.set_association_code_enhanced() SET search_path = public;