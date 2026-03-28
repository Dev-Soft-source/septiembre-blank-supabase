-- Remove all Clerk-related database functions
DROP FUNCTION IF EXISTS public.has_role_clerk(text, text);
DROP FUNCTION IF EXISTS public.get_user_roles_clerk(text);
DROP FUNCTION IF EXISTS public.assign_user_role_clerk(text, text, text);

-- Disable email verification trigger if it exists
DROP TRIGGER IF EXISTS sync_profile_email_verification ON auth.users;
DROP FUNCTION IF EXISTS public.sync_profile_email_verification();

-- Update Supabase auth configuration to disable email confirmation
-- Note: This will be handled through the Supabase dashboard, but we ensure profiles work without email verification

-- Update profiles table to always mark email as verified by default
UPDATE public.profiles SET email_verified = true WHERE email_verified = false;

-- Create function to automatically verify emails on signup
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
    true, -- Always mark as verified
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data ->> 'is_hotel_owner')::boolean, false) = true 
      THEN 'hotel_owner'
      ELSE 'guest'
    END
  );
  
  RAISE LOG 'New profile created for user: %, email_verified: true', NEW.id;
  
  RETURN NEW;
END;
$$;