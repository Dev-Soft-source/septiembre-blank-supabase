-- Fix the profiles role constraint to include 'user' role
ALTER TABLE public.profiles 
DROP CONSTRAINT profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['guest'::text, 'user'::text, 'hotel'::text, 'hotel_owner'::text, 'admin'::text, 'association'::text, 'promoter'::text]));

-- Also check the handle_new_user trigger to ensure it correctly handles 'user' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
    CASE 
      WHEN user_role = 'hotel' THEN 'hotel_owner' 
      WHEN user_role = 'user' THEN 'user'
      ELSE user_role 
    END,
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
$function$;