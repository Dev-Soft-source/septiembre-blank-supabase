-- Update the handle_new_user function to also create promoter records
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public 
AS $$
BEGIN
  -- Determine role from raw_user_meta_data, default to traveler
  DECLARE
    user_role text := COALESCE(NEW.raw_user_meta_data->>'role', 'traveler');
    user_name text := COALESCE(NEW.raw_user_meta_data->>'name', 'User');
    profile_id uuid;
  BEGIN
    -- Insert profile with correct role and automatic referral code
    INSERT INTO public.profiles (user_id, role, code, name, email)
    VALUES (
      NEW.id,
      user_role::user_role,
      CASE 
        WHEN user_role = 'hotel_owner' THEN 'HOTEL_' || substr(NEW.id::text, 1, 8)
        WHEN user_role = 'association' THEN 'ASSOC_' || substr(NEW.id::text, 1, 8)
        WHEN user_role = 'promoter' THEN 'PROMO_' || substr(NEW.id::text, 1, 8)
        WHEN user_role = 'leader' THEN 'LEAD_' || substr(NEW.id::text, 1, 8)
        ELSE 'USER_' || substr(NEW.id::text, 1, 8)
      END,
      user_name,
      NEW.email
    ) RETURNING id INTO profile_id;
    
    -- Create role-specific records
    IF user_role = 'promoter' THEN
      INSERT INTO public.promoters (profile_id, status)
      VALUES (profile_id, 'active');
    ELSIF user_role = 'leader' THEN
      INSERT INTO public.leaders (profile_id)
      VALUES (profile_id);
    ELSIF user_role = 'association' THEN
      INSERT INTO public.associations (profile_id, name)
      VALUES (profile_id, user_name);
    END IF;
    
    -- Insert admin notification record for later processing
    INSERT INTO public.admin_notifications (event_type, entity_id, details)
    VALUES (
      'new_user_registration', 
      NEW.id, 
      jsonb_build_object(
        'email', NEW.email,
        'role', user_role,
        'name', user_name,
        'timestamp', NEW.created_at,
        'needs_email_notification', true
      )
    );
    
    RETURN NEW;
  END;
END;
$$;