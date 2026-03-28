-- Rename hotel_associations table to associations
ALTER TABLE public.hotel_associations RENAME TO associations;

-- Update RLS policies - drop old ones and create new ones with correct table reference
DROP POLICY IF EXISTS "Admins can view all associations" ON public.associations;
DROP POLICY IF EXISTS "Allow association registration" ON public.associations;
DROP POLICY IF EXISTS "Users can update their own association data" ON public.associations;
DROP POLICY IF EXISTS "Users can view their own association data" ON public.associations;

-- Recreate RLS policies with correct table references
CREATE POLICY "Admins can view all associations" 
ON public.associations FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Allow association registration" 
ON public.associations FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own association data" 
ON public.associations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own association data" 
ON public.associations FOR SELECT 
USING (auth.uid() = user_id);

-- Update the handle_new_user trigger function to reference the new table name
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

  -- If user is registering as association, create associations record
  IF user_role = 'association' THEN
    RAISE LOG 'Creating association record for user ID: %', new.id;
    
    INSERT INTO public.associations (
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

-- Update the log_association_creation trigger function to reference new table
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

-- Update the trigger to reference new table
DROP TRIGGER IF EXISTS log_association_creation_trigger ON public.associations;
CREATE TRIGGER log_association_creation_trigger
  AFTER INSERT ON public.associations
  FOR EACH ROW
  EXECUTE FUNCTION public.log_association_creation();

-- Update association referral code trigger to reference new table  
CREATE OR REPLACE FUNCTION public.set_association_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- A prefix for Associations - commission entity  
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_commission_entity_code('A');
  ELSE
    -- Validate manually entered code
    IF NOT validate_commission_entity_code(NEW.referral_code, 'A') THEN
      RAISE EXCEPTION 'Invalid association code format. Expected: A[5 digits][letter A-Z except O]';
    END IF;
    NEW.referral_code := UPPER(NEW.referral_code);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for referral code generation on associations table
DROP TRIGGER IF EXISTS set_association_referral_code_trigger ON public.associations;
CREATE TRIGGER set_association_referral_code_trigger
  BEFORE INSERT OR UPDATE ON public.associations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_association_referral_code();