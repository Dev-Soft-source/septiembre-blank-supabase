-- Function to update profile email verification status when user metadata changes
CREATE OR REPLACE FUNCTION sync_profile_email_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update the profile table when user email verification status changes
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.profiles 
    SET email_verified = true, updated_at = NOW()
    WHERE id = NEW.id;
    
    RAISE LOG 'Profile email verification updated for user: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to sync email verification status
DROP TRIGGER IF EXISTS sync_email_verification_trigger ON auth.users;
CREATE TRIGGER sync_email_verification_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_email_verification();

-- Function to handle new user profile creation with correct initial data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    is_hotel_owner, 
    email_verified,
    role
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'is_hotel_owner')::boolean, false),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data ->> 'is_hotel_owner')::boolean, false) = true 
      THEN 'hotel_owner'
      ELSE 'guest'
    END
  );
  
  RAISE LOG 'New profile created for user: %, email_verified: %', NEW.id, COALESCE(NEW.email_confirmed_at IS NOT NULL, false);
  
  RETURN NEW;
END;
$$;

-- Update existing profiles to sync email verification status
UPDATE public.profiles 
SET email_verified = true, updated_at = NOW()
WHERE id IN (
  SELECT u.id 
  FROM auth.users u 
  WHERE u.email_confirmed_at IS NOT NULL 
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id AND p.email_verified = false)
);