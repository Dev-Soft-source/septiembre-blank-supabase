-- Fix the handle_new_user trigger to properly create hotel_associations records
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_role text;
BEGIN
  -- Extract role from metadata, default to 'user'
  user_role := coalesce(new.raw_user_meta_data ->> 'role', 'user');
  
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
  ON CONFLICT (id) DO NOTHING;

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
  END IF;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but still return new to not block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$function$;