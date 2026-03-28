
-- Enable RLS on user_roles table if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow has_role function access" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Create a policy that allows authenticated users to read their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create a policy that allows the has_role function to read user_roles
-- This is needed for admin checks to work properly
CREATE POLICY "Allow role verification" ON public.user_roles
FOR SELECT
TO authenticated
USING (true);
