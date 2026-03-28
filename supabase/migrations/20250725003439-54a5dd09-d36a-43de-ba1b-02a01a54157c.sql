-- Create user roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('traveler', 'hotel', 'association', 'promoter')),
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(email) -- Enforce one role per email
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (true); -- Allow reading for role detection

CREATE POLICY "Users can insert their role once" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (true); -- Allow inserting roles

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