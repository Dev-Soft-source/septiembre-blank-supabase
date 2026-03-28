-- Fix missing user_roles entries for existing users who have profiles but no user_roles
-- This repairs the data inconsistency identified in the analysis
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

-- Also update any existing guest roles in profiles to user
UPDATE public.profiles 
SET role = 'user' 
WHERE role = 'guest';