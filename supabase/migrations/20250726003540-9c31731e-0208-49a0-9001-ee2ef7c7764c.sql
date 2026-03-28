-- Clean up the specific stuck account
DELETE FROM public.profiles WHERE id = '12de91fd-00f5-49ba-af16-da2e82ba620d';

-- Create a function to clean up stuck accounts (accounts with guest role but no user_roles entry)
CREATE OR REPLACE FUNCTION public.cleanup_stuck_accounts()
RETURNS TABLE(cleaned_user_id uuid, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH stuck_accounts AS (
    SELECT p.id, au.email
    FROM public.profiles p
    JOIN auth.users au ON p.id = au.id
    WHERE p.role = 'guest' 
    AND p.id NOT IN (SELECT user_id FROM public.user_roles WHERE user_id IS NOT NULL)
    AND p.created_at < (now() - interval '1 hour') -- Only accounts older than 1 hour
  )
  DELETE FROM public.profiles 
  WHERE id IN (SELECT id FROM stuck_accounts)
  RETURNING id, (SELECT email FROM auth.users WHERE id = profiles.id);
END;
$$;

-- Create a function to detect incomplete signups
CREATE OR REPLACE FUNCTION public.detect_incomplete_signups()
RETURNS TABLE(user_id uuid, email text, created_at timestamptz, missing_components text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    p.created_at,
    ARRAY[
      CASE WHEN ur.user_id IS NULL THEN 'user_roles' END,
      CASE WHEN p.role = 'guest' AND p.is_hotel_owner = true THEN 'role_mismatch' END,
      CASE WHEN p.first_name IS NULL OR p.last_name IS NULL THEN 'incomplete_profile' END
    ]::text[] as missing_components
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id
  WHERE p.created_at > (now() - interval '24 hours')
  AND (
    ur.user_id IS NULL 
    OR (p.role = 'guest' AND p.is_hotel_owner = true)
    OR p.first_name IS NULL 
    OR p.last_name IS NULL
  );
END;
$$;