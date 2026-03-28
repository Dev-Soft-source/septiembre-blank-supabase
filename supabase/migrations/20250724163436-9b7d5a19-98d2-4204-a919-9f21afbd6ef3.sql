-- Fix the remaining function search path security issue
CREATE OR REPLACE FUNCTION public.assign_dual_roles_to_user(user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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