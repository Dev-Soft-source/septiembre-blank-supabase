-- Add temporary logging to handle_new_user function for debugging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Temporary debugging logs
  RAISE LOG 'handle_new_user triggered - new.id: %, new.email: %, new.raw_user_meta_data: %', 
    new.id, new.email, new.raw_user_meta_data;
  
  RAISE LOG 'Extracted role value: %', coalesce(new.raw_user_meta_data ->> 'role', 'guest');

  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'guest')
  );

  RAISE LOG 'Profile insert completed successfully for user: %', new.id;

  return new;
END;
$$;