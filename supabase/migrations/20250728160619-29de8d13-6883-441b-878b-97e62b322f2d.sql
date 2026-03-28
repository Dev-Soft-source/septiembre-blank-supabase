-- Fix the handle_new_user trigger to also create user_roles entries
-- This ensures that hotel users get both profile and user_roles entries

-- Drop and recreate the trigger function to include user_roles creation
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  -- Extract role from metadata, default to 'guest'
  user_role := coalesce(new.raw_user_meta_data ->> 'role', 'guest');
  
  -- Log for debugging
  RAISE LOG 'handle_new_user triggered - new.id: %, role: %', new.id, user_role;

  -- Insert profile with role and set is_hotel_owner based on role
  INSERT INTO public.profiles (id, role, is_hotel_owner)
  VALUES (
    new.id,
    CASE WHEN user_role = 'hotel' THEN 'hotel_owner' ELSE user_role END,
    CASE WHEN user_role = 'hotel' THEN true ELSE false END
  );

  -- Also insert into user_roles table for consistency
  INSERT INTO public.user_roles (user_id, role, email)
  VALUES (
    new.id,
    user_role,
    new.email
  );

  RAISE LOG 'Profile and user_role created successfully for user: % with role: % and is_hotel_owner: %', 
    new.id, user_role, (user_role = 'hotel');

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    -- Still return new to not block user creation
    RETURN new;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix the existing user sogajo6961@0tires.com by adding missing user_roles entry
INSERT INTO public.user_roles (user_id, role, email)
SELECT 
  p.id,
  'hotel',
  au.email
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'sogajo6961@0tires.com'
  AND p.is_hotel_owner = true
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = p.id
  )
ON CONFLICT (user_id, role) DO NOTHING;