-- Remove guest role fallback from handle_new_user function
-- Ensure all new authenticated users get 'user' role, never 'guest'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_role text;
BEGIN
  -- Extract role from metadata, default to 'user' (not 'guest')
  user_role := coalesce(new.raw_user_meta_data ->> 'role', 'user');
  
  -- Log for debugging
  RAISE LOG 'handle_new_user triggered - new.id: %, role: %', new.id, user_role;

  -- Insert profile with role and set is_hotel_owner based on role
  INSERT INTO public.profiles (id, role, is_hotel_owner)
  VALUES (
    new.id,
    CASE 
      WHEN user_role = 'hotel' THEN 'hotel_owner' 
      WHEN user_role = 'user' THEN 'user'
      WHEN user_role = 'admin' THEN 'admin'
      WHEN user_role = 'association' THEN 'association'
      WHEN user_role = 'promoter' THEN 'promoter'
      ELSE 'user'  -- Default to 'user', never 'guest'
    END,
    CASE WHEN user_role = 'hotel' THEN true ELSE false END
  );

  -- Also insert into user_roles table for consistency
  -- Force 'user' role for any undefined or guest registration
  INSERT INTO public.user_roles (user_id, role, email)
  VALUES (
    new.id,
    CASE 
      WHEN user_role IN ('hotel', 'admin', 'association', 'promoter') THEN user_role
      ELSE 'user'  -- Force 'user' role, never 'guest'
    END,
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