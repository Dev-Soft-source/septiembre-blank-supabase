-- CRITICAL SECURITY FIX #2: Fix search_path for functions (Part 1)
-- Drop and recreate functions to avoid parameter conflicts

DROP FUNCTION IF EXISTS public.audit_commission_operation(uuid, text, text, uuid, jsonb, jsonb, text);
DROP FUNCTION IF EXISTS public.audit_sensitive_data_access();

-- Recreate with secure search_path
CREATE OR REPLACE FUNCTION public.audit_commission_operation(
    p_booking_id uuid,
    p_operation text,
    p_commission_source_type text,
    p_commission_source_id uuid,
    p_previous_state jsonb,
    p_new_state jsonb,
    p_notes text DEFAULT NULL::text
)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.commission_audit (
    booking_id,
    operation,
    commission_source_type,
    commission_source_id,
    actor_id,
    previous_state,
    new_state,
    notes
  ) VALUES (
    p_booking_id,
    p_operation,
    p_commission_source_type,
    p_commission_source_id,
    auth.uid(),
    p_previous_state,
    p_new_state,
    p_notes
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.audit_sensitive_data_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Log access to sensitive hotel data
  INSERT INTO public.admin_logs (admin_id, action, details)
  VALUES (
    COALESCE(auth.uid()::text, 'anonymous'),
    'sensitive_data_access',
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'record_id', NEW.id,
      'timestamp', now(),
      'user_id', auth.uid()
    )
  );
  RETURN NEW;
END;
$function$;