-- Remove all Clerk-related database functions
DROP FUNCTION IF EXISTS public.has_role_clerk(text, text);
DROP FUNCTION IF EXISTS public.get_user_roles_clerk(text);
DROP FUNCTION IF EXISTS public.assign_user_role_clerk(text, text, text);

-- Remove email verification trigger and function with CASCADE
DROP TRIGGER IF EXISTS sync_email_verification_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.sync_profile_email_verification() CASCADE;

-- Update profiles table to always mark email as verified by default
UPDATE public.profiles SET email_verified = true WHERE email_verified = false;

-- Update the handle_new_user function to always mark emails as verified
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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
    true, -- Always mark as verified - no email verification required
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data ->> 'is_hotel_owner')::boolean, false) = true 
      THEN 'hotel_owner'
      ELSE 'guest'
    END
  );
  
  RAISE LOG 'New profile created for user: %, email_verified: true (no verification required)', NEW.id;
  
  RETURN NEW;
END;
$$;