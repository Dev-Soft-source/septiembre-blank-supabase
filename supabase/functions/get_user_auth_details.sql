
-- This SQL function should be executed in the Supabase SQL editor
CREATE OR REPLACE FUNCTION public.get_user_auth_details(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'last_sign_in_at', u.last_sign_in_at,
    'created_at', u.created_at,
    'email_confirmed_at', u.email_confirmed_at
  ) INTO result
  FROM auth.users u
  WHERE u.id = user_id;
  
  RETURN result;
END;
$$;

-- Grant access to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_auth_details(UUID) TO authenticated;
