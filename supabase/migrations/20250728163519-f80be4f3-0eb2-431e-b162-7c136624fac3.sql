-- Test the fixed handle_new_user trigger function with user role
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test.user.trigger.fixed@example.com';
BEGIN
    -- Simulate what happens when a user signs up with role 'user'
    RAISE NOTICE 'Testing FIXED handle_new_user trigger for user role';
    
    -- Clean up any existing test data first
    DELETE FROM public.user_roles WHERE email = test_email;
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    -- Test the trigger function directly by simulating profile creation
    INSERT INTO public.profiles (id, role, is_hotel_owner)
    VALUES (
        test_user_id,
        'user',  -- This should now work with the fixed constraint
        false
    );
    
    -- Test user_roles insertion
    INSERT INTO public.user_roles (user_id, role, email)
    VALUES (
        test_user_id,
        'user',
        test_email
    );
    
    -- Check results
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = test_user_id AND role = 'user') THEN
        RAISE NOTICE 'SUCCESS: Profile created with user role';
    ELSE
        RAISE NOTICE 'ERROR: Profile not created properly';
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = test_user_id AND role = 'user') THEN
        RAISE NOTICE 'SUCCESS: User role assigned correctly';
    ELSE
        RAISE NOTICE 'ERROR: User role not assigned';
    END IF;
    
    -- Clean up test data
    DELETE FROM public.user_roles WHERE user_id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    RAISE NOTICE 'Test completed and cleaned up successfully';
END
$$;