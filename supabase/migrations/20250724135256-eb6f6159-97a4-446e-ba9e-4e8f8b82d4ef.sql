-- Fix database function security paths by adding SET search_path TO 'public'
-- This prevents schema injection attacks

-- First drop the dependent triggers for set_association_code function
DROP TRIGGER IF EXISTS trigger_set_association_code ON public.hotel_associations;
DROP TRIGGER IF EXISTS set_association_code_trigger ON public.hotel_associations;

-- Now update the functions with proper search paths
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
  base_code := UPPER(LEFT(first_name, 3)) || UPPER(LEFT(last_name, 3));
  final_code := base_code;
  
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
  base_code := UPPER(LEFT(regexp_replace(association_name, '[^a-zA-Z]', '', 'g'), 3)) || 
               LPAD(floor(random() * 1000)::text, 3, '0');
  final_code := base_code;
  
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

-- Recreate the trigger
CREATE TRIGGER set_association_code_trigger
  BEFORE INSERT OR UPDATE ON public.hotel_associations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_association_code();

-- Fix admin access vulnerability by tightening RLS policies
DROP POLICY IF EXISTS "Basic admin_users access" ON public.admin_users;
DROP POLICY IF EXISTS "Allow admin verification" ON public.admin_users;

-- Create proper admin verification policy that only allows checking admin status
CREATE POLICY "Allow admin status verification only" 
ON public.admin_users 
FOR SELECT 
USING (id = auth.uid());

-- Add server-side validation functions
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF length(password) < 8 THEN RETURN false; END IF;
  IF password !~ '[A-Z]' THEN RETURN false; END IF;
  IF password !~ '[a-z]' THEN RETURN false; END IF;
  IF password !~ '[0-9]' THEN RETURN false; END IF;
  RETURN true;
END;
$function$;

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

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (has_role('admin'));

-- Create rate limiting function
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
  
  SELECT attempt_count INTO current_count
  FROM public.rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND first_attempt > window_start;
  
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
  
  IF current_count >= p_max_attempts THEN
    RETURN false;
  END IF;
  
  UPDATE public.rate_limits
  SET attempt_count = attempt_count + 1,
      last_attempt = now()
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  RETURN true;
END;
$function$;