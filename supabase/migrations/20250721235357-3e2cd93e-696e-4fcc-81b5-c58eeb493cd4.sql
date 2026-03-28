
-- Add a secure token column to profiles table for JotForm authentication
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jotform_token TEXT UNIQUE;

-- Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_jotform_token ON public.profiles(jotform_token);

-- Create a function to generate secure tokens for JotForm integration
CREATE OR REPLACE FUNCTION generate_jotform_token(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a secure random token
  token := encode(gen_random_bytes(32), 'hex');
  
  -- Update the user's profile with the token
  UPDATE public.profiles 
  SET jotform_token = token 
  WHERE id = user_id;
  
  RETURN token;
END;
$$;

-- Create a function to get user ID from JotForm token
CREATE OR REPLACE FUNCTION get_user_from_jotform_token(token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id 
  FROM public.profiles 
  WHERE jotform_token = token;
  
  RETURN user_id;
END;
$$;
