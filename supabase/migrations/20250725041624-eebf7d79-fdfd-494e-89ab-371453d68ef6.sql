-- Remove Supabase auth dependencies and rebuild for Clerk
-- Drop existing functions that depend on auth.uid()
DROP FUNCTION IF EXISTS public.has_role(text);
DROP FUNCTION IF EXISTS public.get_my_roles();

-- Create new functions that work with explicit Clerk user IDs
CREATE OR REPLACE FUNCTION public.has_role_clerk(clerk_user_id text, role_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id::text = clerk_user_id 
    AND role = role_name
  );
$$;

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

CREATE OR REPLACE FUNCTION public.assign_user_role_clerk(clerk_user_id text, p_email text, p_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  existing_role TEXT;
BEGIN
  -- Check if email already has a role
  SELECT role INTO existing_role FROM public.user_roles WHERE email = p_email;
  
  IF existing_role IS NOT NULL THEN
    RETURN FALSE; -- Email already has a role
  END IF;
  
  -- Insert new role with Clerk user ID
  INSERT INTO public.user_roles (user_id, email, role)
  VALUES (clerk_user_id::uuid, p_email, p_role);
  
  RETURN TRUE;
END;
$$;