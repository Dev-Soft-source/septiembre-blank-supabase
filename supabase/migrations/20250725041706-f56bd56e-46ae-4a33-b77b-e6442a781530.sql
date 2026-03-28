-- First, create the new Clerk-compatible functions alongside the old ones
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

-- Create a simple function to check if someone is admin based on admin_users table
-- This avoids the has_role dependency for existing policies
CREATE OR REPLACE FUNCTION public.is_admin_simple()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
$$;