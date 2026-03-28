-- Update the handle_new_user function to properly set is_hotel_owner for hotel registrations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
    user_role,
    CASE WHEN user_role = 'hotel' THEN true ELSE false END
  );

  RAISE LOG 'Profile insert completed successfully for user: % with role: % and is_hotel_owner: %', 
    new.id, user_role, (user_role = 'hotel');

  RETURN new;
END;
$$;