-- Ensure all existing associations have referral codes
-- This is an idempotent operation - safe to run multiple times

UPDATE public.hotel_associations 
SET referral_code = generate_commission_entity_code('A')
WHERE referral_code IS NULL OR referral_code = '';

-- Add index for better performance when looking up by referral code
CREATE INDEX IF NOT EXISTS idx_hotel_associations_referral_code 
ON public.hotel_associations(referral_code);

-- Add index for better performance when looking up by user_id
CREATE INDEX IF NOT EXISTS idx_hotel_associations_user_id 
ON public.hotel_associations(user_id);

-- Add logging trigger to help debug association creation issues
CREATE OR REPLACE FUNCTION public.log_association_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Log association creation for debugging
  RAISE LOG 'Association created - ID: %, User ID: %, Name: %, Email: %, Referral Code: %',
    NEW.id, NEW.user_id, NEW.association_name, NEW.email, NEW.referral_code;
  RETURN NEW;
END;
$function$;

-- Create trigger to log association creation
DROP TRIGGER IF EXISTS log_association_creation_trigger ON public.hotel_associations;
CREATE TRIGGER log_association_creation_trigger
  AFTER INSERT ON public.hotel_associations
  FOR EACH ROW
  EXECUTE FUNCTION public.log_association_creation();

-- Enhanced logging for handle_new_user trigger to debug issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role text;
BEGIN
  -- Extract role from metadata, default to 'user'
  user_role := coalesce(new.raw_user_meta_data ->> 'role', 'user');
  
  RAISE LOG 'handle_new_user triggered - User ID: %, Email: %, Role: %, Metadata: %', 
    new.id, new.email, user_role, new.raw_user_meta_data;
  
  -- Insert profile with role and set is_hotel_owner based on role
  INSERT INTO public.profiles (id, role, is_hotel_owner)
  VALUES (
    new.id,
    CASE 
      WHEN user_role = 'hotel' THEN 'hotel_owner' 
      WHEN user_role = 'user' THEN 'user'
      WHEN user_role = 'admin' THEN 'admin'
      WHEN user_role = 'association' THEN 'association'
      WHEN user_role = 'promoter' THEN 'promoter'
      WHEN user_role = 'leaderliving' THEN 'leaderliving'
      ELSE 'user'
    END,
    CASE WHEN user_role = 'hotel' THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    is_hotel_owner = EXCLUDED.is_hotel_owner;

  RAISE LOG 'Profile created/updated for user ID: %', new.id;

  -- Also insert into user_roles table for consistency
  INSERT INTO public.user_roles (user_id, role, email)
  VALUES (
    new.id,
    CASE 
      WHEN user_role IN ('hotel', 'admin', 'association', 'promoter', 'leaderliving') THEN user_role
      ELSE 'user'
    END,
    new.email
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  -- If user is registering as association, create hotel_associations record
  IF user_role = 'association' THEN
    RAISE LOG 'Creating association record for user ID: %', new.id;
    
    INSERT INTO public.hotel_associations (
      user_id,
      association_name,
      email,
      responsible_person,
      country,
      status
    ) VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data ->> 'association_name', new.raw_user_meta_data ->> 'nombreAsociacion', 'Unknown Association'),
      new.email,
      COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'association_name', new.raw_user_meta_data ->> 'nombreAsociacion', 'Unknown'),
      COALESCE(new.raw_user_meta_data ->> 'country', 'Unknown'),
      'pending'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      association_name = EXCLUDED.association_name,
      responsible_person = EXCLUDED.responsible_person,
      country = EXCLUDED.country,
      updated_at = now();
      
    RAISE LOG 'Association record created/updated for user ID: %', new.id;
  END IF;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but still return new to not block user creation
    RAISE LOG 'Error in handle_new_user for user ID %, Error: %', new.id, SQLERRM;
    RETURN new;
END;
$function$;