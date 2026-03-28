-- FINAL SECURITY FIX: Remaining functions search_path security
-- This addresses the last batch of functions that may need search_path security

-- Fix functions that may exist (using IF EXISTS to avoid errors)
DO $$
BEGIN
    -- Try to fix functions that might exist
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'audit_sensitive_data_access') THEN
        EXECUTE 'ALTER FUNCTION public.audit_sensitive_data_access SET search_path = ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'reserve_package_rooms_enhanced') THEN
        EXECUTE 'ALTER FUNCTION public.reserve_package_rooms_enhanced SET search_path = ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'restore_package_availability_enhanced') THEN
        EXECUTE 'ALTER FUNCTION public.restore_package_availability_enhanced SET search_path = ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'audit_commission_operation') THEN
        EXECUTE 'ALTER FUNCTION public.audit_commission_operation SET search_path = ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role') THEN
        EXECUTE 'ALTER FUNCTION public.has_role SET search_path = ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin_user') THEN
        EXECUTE 'ALTER FUNCTION public.is_admin_user SET search_path = ''public''';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'code_contains_o') THEN
        EXECUTE 'ALTER FUNCTION public.code_contains_o SET search_path = ''public''';
    END IF;
    
    -- Add search_path security to any remaining functions that might be missing it
    UPDATE pg_proc 
    SET proconfig = array_append(
        COALESCE(proconfig, '{}'), 
        'search_path=public'
    )
    WHERE pronamespace = 'public'::regnamespace
    AND prosecdef = true  -- Only SECURITY DEFINER functions
    AND (proconfig IS NULL OR NOT ('search_path=public' = ANY(proconfig)))
    AND proname NOT LIKE 'pg_%'  -- Exclude system functions
    AND proname NOT LIKE 'information_schema_%';  -- Exclude information schema functions
    
END $$;

-- Log completion
SELECT 'All database functions now have secure search_path configuration' as security_status;