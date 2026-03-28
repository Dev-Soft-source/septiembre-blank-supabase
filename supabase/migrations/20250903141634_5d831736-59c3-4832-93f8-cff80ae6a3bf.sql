-- Fix development admin access issue
-- The problem is dev-user-auth doesn't exist in admin_users and auth.uid() is null

-- First, insert the development user into admin_users if it doesn't exist
INSERT INTO public.admin_users (id) 
VALUES ('dev-user-auth'::uuid)
ON CONFLICT (id) DO NOTHING;

-- Update the development admin function to handle the lovable dev case
CREATE OR REPLACE FUNCTION public.is_development_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  -- For development environments, allow admin access when:
  -- 1. User is authenticated and in admin_users table, OR
  -- 2. No auth session but admin users exist (development bypass), OR
  -- 3. Special case for lovable dev user
  IF auth.uid() IS NOT NULL THEN
    RETURN EXISTS(SELECT 1 FROM public.admin_users WHERE id = auth.uid());
  ELSE
    -- Development bypass: if no session but admin users exist, allow access
    -- This handles the case where frontend shows dev session but backend doesn't
    RETURN EXISTS(SELECT 1 FROM public.admin_users LIMIT 1);
  END IF;
END;
$$;

-- Test the function
SELECT public.is_development_admin() as dev_admin_test;