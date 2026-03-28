-- Add the missing get_user_roles_clerk function
CREATE OR REPLACE FUNCTION public.get_user_roles_clerk(clerk_user_id text)
RETURNS TABLE(role text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id::text = clerk_user_id;
$$;