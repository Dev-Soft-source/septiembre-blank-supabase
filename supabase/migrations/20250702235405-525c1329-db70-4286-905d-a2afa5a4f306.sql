
-- First, let's find the user ID for the email grand_soiree@yahoo.com
-- We'll need to get this from the auth.users table (this is a lookup, not an insert)

-- Add admin role for the user grand_soiree@yahoo.com
-- Note: We need to replace 'USER_ID_HERE' with the actual UUID of the user
-- Since we can't directly query auth.users in this migration, this will need to be done manually
-- or through the Supabase dashboard after finding the user ID

-- For now, let's create a function to handle this role assignment
CREATE OR REPLACE FUNCTION assign_dual_roles_to_user(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- This function would need to be called from an edge function or admin panel
  -- since we can't directly access auth.users from SQL migrations
  
  -- For manual execution, find the user ID and then run:
  -- INSERT INTO public.user_roles (user_id, role) 
  -- VALUES ('USER_ID_HERE', 'admin')
  -- ON CONFLICT (user_id, role) DO NOTHING;
  
  -- UPDATE public.profiles 
  -- SET is_hotel_owner = true
  -- WHERE id = 'USER_ID_HERE';
  
  RAISE NOTICE 'Function created. Manual role assignment required for user: %', user_email;
END;
$$;

-- Call the function to log the requirement
SELECT assign_dual_roles_to_user('grand_soiree@yahoo.com');
