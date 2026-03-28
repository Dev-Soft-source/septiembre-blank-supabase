-- Create admin user for development environment
-- Insert the admin email into admin_users table
INSERT INTO public.admin_users (id, email, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'grand_soiree@yahoo.com'
ON CONFLICT (id) DO NOTHING;

-- Insert admin role into user_roles table  
INSERT INTO public.user_roles (user_id, email, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  'admin',
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'grand_soiree@yahoo.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profile to admin role if exists
UPDATE public.profiles 
SET 
  role = 'admin',
  updated_at = now()
WHERE id IN (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'grand_soiree@yahoo.com'
);