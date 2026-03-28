
-- Fix Function Search Path Mutable warnings by setting search_path for security functions
-- This prevents potential security vulnerabilities from search_path manipulation

-- Update is_admin_user function to set search_path
CREATE OR REPLACE FUNCTION public.is_admin_user()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
$function$;

-- Update has_role function to set search_path
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = role_name
  );
$function$;

-- Update get_my_roles function to set search_path
CREATE OR REPLACE FUNCTION public.get_my_roles()
 RETURNS TABLE(role text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid();
$function$;

-- Update handle_join_us_submission function to set search_path
CREATE OR REPLACE FUNCTION public.handle_join_us_submission()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Log that the trigger was fired
  RAISE LOG 'Join us submission trigger fired for submission ID: %', NEW.id;
  
  -- Call the Edge Function to send notification
  PERFORM
    net.http_post(
      url:='https://pgdzrvdwgoomjnnegkcn.supabase.co/functions/v1/send-join-us-notification',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZHpydmR3Z29vbWpubmVna2NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTQ3MiwiZXhwIjoyMDU4NDA1NDcyfQ.AKQFMM-W8bCTaxGMQIWKPKP6-u2lc-L3MX0iiixE6Ac"}'::jsonb,
      body:=json_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW),
        'old_record', null
      )::jsonb
    );
  
  RAISE LOG 'HTTP post to edge function completed for submission ID: %', NEW.id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the insertion
  RAISE LOG 'Error in handle_join_us_submission trigger: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- Move pg_net extension from public schema to extensions schema
-- First create the extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Drop and recreate pg_net in the extensions schema
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant necessary permissions to use pg_net from the extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
