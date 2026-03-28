-- Create a function to safely delete stuck users
CREATE OR REPLACE FUNCTION public.delete_auth_user_by_email(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = p_email;
  
  IF user_uuid IS NULL THEN
    RETURN false; -- User not found
  END IF;
  
  -- Delete from auth.users (this will cascade)
  DELETE FROM auth.users WHERE id = user_uuid;
  
  RETURN true;
END;
$$;