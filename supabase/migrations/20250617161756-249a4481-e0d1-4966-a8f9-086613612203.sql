
-- First, create the app_role enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END $$;

-- Enable RLS on user_roles table if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow has_role function access" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Update the has_role function to work with text role names
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = role_name
  );
$$;

-- Create a policy that allows the has_role function to read user_roles
CREATE POLICY "Allow has_role function access" ON public.user_roles
FOR SELECT
USING (true);

-- Also create a policy for users to see their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
