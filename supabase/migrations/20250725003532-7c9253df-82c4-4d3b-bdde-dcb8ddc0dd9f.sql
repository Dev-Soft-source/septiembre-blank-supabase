-- Add email column to existing user_roles table
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add unique constraint on email to enforce one role per email
ALTER TABLE public.user_roles ADD CONSTRAINT unique_email_role UNIQUE (email);

-- Update role constraint to include new roles
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_role_check CHECK (role IN ('traveler', 'hotel', 'association', 'promoter', 'admin'));

-- Function to check if email already has a role
CREATE OR REPLACE FUNCTION public.check_email_role_exists(p_email TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.user_roles WHERE email = p_email LIMIT 1;
$$;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION public.assign_user_role(p_user_id UUID, p_email TEXT, p_role TEXT)
RETURNS BOOLEAN
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
  
  -- Insert new role
  INSERT INTO public.user_roles (user_id, email, role)
  VALUES (p_user_id, p_email, p_role);
  
  RETURN TRUE;
END;
$$;