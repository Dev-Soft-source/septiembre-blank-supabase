-- Update the user_roles constraint to include 'user' role
ALTER TABLE public.user_roles 
DROP CONSTRAINT user_roles_role_check;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_role_check 
CHECK (role = ANY (ARRAY['user'::text, 'traveler'::text, 'hotel'::text, 'association'::text, 'promoter'::text, 'admin'::text]));

-- Now insert the missing user_roles entries for existing users
INSERT INTO public.user_roles (user_id, role, email)
SELECT 
  p.id, 
  CASE 
    WHEN p.role = 'guest' THEN 'user'  -- Convert any existing guest to user
    ELSE p.role 
  END,
  au.email
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.id NOT IN (SELECT user_id FROM public.user_roles WHERE user_id IS NOT NULL)
  AND p.role IS NOT NULL;