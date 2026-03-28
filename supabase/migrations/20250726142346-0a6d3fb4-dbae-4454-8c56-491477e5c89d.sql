-- Fix the create_password_reset_token function to use correct random generation
CREATE OR REPLACE FUNCTION public.create_password_reset_token(p_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID;
  v_token TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Find user by email
  SELECT au.id INTO v_user_id
  FROM auth.users au
  WHERE au.email = p_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Generate secure token using encode and gen_random_uuid (which exists)
  v_token := encode(decode(replace(gen_random_uuid()::text, '-', ''), 'hex') || decode(replace(gen_random_uuid()::text, '-', ''), 'hex'), 'hex');
  v_expires_at := now() + interval '1 hour';
  
  -- Clean up old tokens for this user
  DELETE FROM public.password_reset_tokens 
  WHERE user_id = v_user_id OR expires_at < now();
  
  -- Insert new token
  INSERT INTO public.password_reset_tokens (user_id, email, token, expires_at)
  VALUES (v_user_id, p_email, v_token, v_expires_at);
  
  RETURN v_token;
END;
$function$;