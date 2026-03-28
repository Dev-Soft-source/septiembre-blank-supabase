-- Fix the handle_new_user function to use correct ON CONFLICT clause for associations table
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
    
    -- Use INSERT without ON CONFLICT since we know this is a new user
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
    );
      
    RAISE LOG 'Association record created for user ID: %', new.id;
  END IF;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but still return new to not block user creation
    RAISE LOG 'Error in handle_new_user for user ID %, Error: %', new.id, SQLERRM;
    RETURN new;
END;
$function$;

-- Now create the association record for the user who failed earlier
INSERT INTO public.associations (
  user_id,
  association_name,
  email,
  responsible_person,
  country,
  status
) 
SELECT 
  '778f1eb7-f9ca-45b6-84e5-bf9feda3d0b5'::uuid,
  'DOMINGO NOCHE',
  'a7c4t3v7n8@mkzaso.com', 
  'DOMINGO NOCHE',
  'USA',
  'pending'
WHERE NOT EXISTS (
  SELECT 1 FROM public.associations WHERE user_id = '778f1eb7-f9ca-45b6-84e5-bf9feda3d0b5'::uuid
);