-- CRITICAL SECURITY FIX #2: Add secure search_path to functions
-- This prevents search path manipulation attacks

-- Fix functions that are missing SET search_path = 'public'
CREATE OR REPLACE FUNCTION public.assign_dual_roles_to_user(user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- This function would need to be called from an edge function or admin panel
  -- since we can't directly access auth.users from SQL migrations
  
  -- For manual execution, find the user ID and then run:
  -- INSERT INTO public.user_roles (user_id, role) 
  -- VALUES ('USER_ID_HERE', 'admin')
  -- ON CONFLICT (user_id, role) DO NOTHING;
  
  -- UPDATE public.profiles 
  -- SET is_hotel_owner = true
  -- WHERE id = 'USER_ID_HERE';
  
  RAISE NOTICE 'Function created. Manual role assignment required for user: %', user_email;
END;
$function$;

CREATE OR REPLACE FUNCTION public.assign_user_role(p_user_id uuid, p_email text, p_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  existing_role TEXT;
BEGIN
  -- Check if email already has a role
  SELECT role INTO existing_role FROM public.user_roles WHERE email = p_email;
  
  IF existing_role IS NOT NULL THEN
    RETURN FALSE; -- Email already has a role
  END IF;
  
  -- Insert new role
  INSERT INTO public.user_roles (user_id, email, role)
  VALUES (p_user_id, p_email, p_role);
  
  RETURN TRUE;
END;
$function$;

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