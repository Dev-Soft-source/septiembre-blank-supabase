-- Create password reset tokens table for custom password reset flow
CREATE TABLE public.password_reset_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for fast token lookup
CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_email ON public.password_reset_tokens(email);
CREATE INDEX idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies - tokens should only be accessible by the system
CREATE POLICY "No direct access to password reset tokens" 
ON public.password_reset_tokens 
FOR ALL 
USING (false);

-- Function to create a password reset token
CREATE OR REPLACE FUNCTION public.create_password_reset_token(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
  
  -- Generate secure token
  v_token := encode(gen_random_bytes(32), 'hex');
  v_expires_at := now() + interval '1 hour';
  
  -- Clean up old tokens for this user
  DELETE FROM public.password_reset_tokens 
  WHERE user_id = v_user_id OR expires_at < now();
  
  -- Insert new token
  INSERT INTO public.password_reset_tokens (user_id, email, token, expires_at)
  VALUES (v_user_id, p_email, v_token, v_expires_at);
  
  RETURN v_token;
END;
$$;

-- Function to validate and use a password reset token
CREATE OR REPLACE FUNCTION public.validate_password_reset_token(p_token TEXT)
RETURNS TABLE(user_id UUID, email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_record RECORD;
BEGIN
  -- Find valid token
  SELECT prt.user_id, prt.email, prt.used_at, prt.expires_at
  INTO v_record
  FROM public.password_reset_tokens prt
  WHERE prt.token = p_token;
  
  IF v_record IS NULL THEN
    RAISE EXCEPTION 'Invalid token';
  END IF;
  
  IF v_record.used_at IS NOT NULL THEN
    RAISE EXCEPTION 'Token already used';
  END IF;
  
  IF v_record.expires_at < now() THEN
    RAISE EXCEPTION 'Token expired';
  END IF;
  
  -- Mark token as used
  UPDATE public.password_reset_tokens 
  SET used_at = now()
  WHERE token = p_token;
  
  -- Return user info
  user_id := v_record.user_id;
  email := v_record.email;
  RETURN NEXT;
END;
$$;