-- Fix the missing profile and user_roles for comiza.viorel@hotmail.com
DO $$
DECLARE
    user_uuid UUID;
    user_email TEXT := 'comiza.viorel@hotmail.com';
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_uuid IS NOT NULL THEN
        -- Check if profile exists
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_uuid) THEN
            -- Create missing profile with user role
            INSERT INTO public.profiles (id, role, is_hotel_owner)
            VALUES (user_uuid, 'user', false);
            RAISE NOTICE 'Created missing profile for user: %', user_email;
        ELSE
            RAISE NOTICE 'Profile already exists for user: %', user_email;
        END IF;
        
        -- Check if user_roles exists
        IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_uuid) THEN
            -- Create missing user_roles entry
            INSERT INTO public.user_roles (user_id, role, email)
            VALUES (user_uuid, 'user', user_email);
            RAISE NOTICE 'Created missing user_roles for user: %', user_email;
        ELSE
            RAISE NOTICE 'User_roles already exists for user: %', user_email;
        END IF;
    ELSE
        RAISE NOTICE 'User not found in auth.users: %', user_email;
    END IF;
END
$$;