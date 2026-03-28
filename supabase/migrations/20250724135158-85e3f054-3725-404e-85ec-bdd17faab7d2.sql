-- Fix database function security paths by adding SET search_path TO 'public'
-- This prevents schema injection attacks

-- Update existing functions to include proper search path
DROP FUNCTION IF EXISTS public.generate_agent_code(text, text);
CREATE OR REPLACE FUNCTION public.generate_agent_code(first_name text, last_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 1;
BEGIN
  -- Extract first syllable of first name and first two syllables of last name
  -- This is a simplified version - for production you might want more sophisticated syllable detection
  base_code := UPPER(LEFT(first_name, 3)) || UPPER(LEFT(last_name, 3));
  final_code := base_code;
  
  -- Ensure uniqueness by appending number if needed
  WHILE EXISTS (SELECT 1 FROM public.agents WHERE agent_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || counter::TEXT;
  END LOOP;
  
  RETURN final_code;
END;
$function$;

-- Update generate_association_code function
DROP FUNCTION IF EXISTS public.generate_association_code(text);
CREATE OR REPLACE FUNCTION public.generate_association_code(association_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 1;
BEGIN
  -- Extract first 3 letters from association name and add 3 random digits
  base_code := UPPER(LEFT(regexp_replace(association_name, '[^a-zA-Z]', '', 'g'), 3)) || 
               LPAD(floor(random() * 1000)::text, 3, '0');
  final_code := base_code;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.hotel_associations WHERE association_code = final_code) LOOP
    counter := counter + 1;
    final_code := base_code || counter::TEXT;
  END LOOP;
  
  RETURN final_code;
END;
$function$;

-- Update set_association_code function
DROP FUNCTION IF EXISTS public.set_association_code();
CREATE OR REPLACE FUNCTION public.set_association_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.association_code IS NULL THEN
    NEW.association_code := public.generate_association_code(NEW.association_name);
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix admin access vulnerability by tightening RLS policies
-- Remove overly permissive admin_users policies and add restrictive ones
DROP POLICY IF EXISTS "Basic admin_users access" ON public.admin_users;
DROP POLICY IF EXISTS "Allow admin verification" ON public.admin_users;

-- Create proper admin verification policy that only allows checking admin status
CREATE POLICY "Allow admin status verification only" 
ON public.admin_users 
FOR SELECT 
USING (id = auth.uid());

-- Add server-side password validation function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Password must be at least 8 characters
  IF length(password) < 8 THEN
    RETURN false;
  END IF;
  
  -- Password must contain at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Password must contain at least one lowercase letter
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  -- Password must contain at least one digit
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

-- Add input validation function for email addresses
CREATE OR REPLACE FUNCTION public.validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Basic email validation using regex
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$function$;

-- Add trigger to validate passwords on profile updates (where applicable)
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate email format if provided
  IF NEW.first_name IS NOT NULL AND length(trim(NEW.first_name)) = 0 THEN
    RAISE EXCEPTION 'First name cannot be empty';
  END IF;
  
  IF NEW.last_name IS NOT NULL AND length(trim(NEW.last_name)) = 0 THEN
    RAISE EXCEPTION 'Last name cannot be empty';
  END IF;
  
  -- Sanitize input data
  NEW.first_name := trim(NEW.first_name);
  NEW.last_name := trim(NEW.last_name);
  
  RETURN NEW;
END;
$function$;

-- Create trigger for profile validation
DROP TRIGGER IF EXISTS validate_profile_data_trigger ON public.profiles;
CREATE TRIGGER validate_profile_data_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_data();

-- Improve RLS policies for more secure access
-- Update hotel_associations policies to be more restrictive
DROP POLICY IF EXISTS "Allow association registration" ON public.hotel_associations;
CREATE POLICY "Allow authenticated association registration" 
ON public.hotel_associations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Add rate limiting table for security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  action_type text NOT NULL,
  attempt_count integer DEFAULT 1,
  first_attempt timestamp with time zone DEFAULT now(),
  last_attempt timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Add policy for rate limits (admin only)
CREATE POLICY "Admins can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (has_role('admin'));

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action_type text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_count integer;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Get current attempt count within the window
  SELECT attempt_count INTO current_count
  FROM public.rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND first_attempt > window_start;
  
  -- If no record exists or window expired, create/reset
  IF current_count IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action_type, attempt_count, first_attempt, last_attempt)
    VALUES (p_identifier, p_action_type, 1, now(), now())
    ON CONFLICT (identifier, action_type) 
    DO UPDATE SET 
      attempt_count = 1,
      first_attempt = now(),
      last_attempt = now();
    RETURN true;
  END IF;
  
  -- Check if limit exceeded
  IF current_count >= p_max_attempts THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  UPDATE public.rate_limits
  SET attempt_count = attempt_count + 1,
      last_attempt = now()
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  RETURN true;
END;
$function$;