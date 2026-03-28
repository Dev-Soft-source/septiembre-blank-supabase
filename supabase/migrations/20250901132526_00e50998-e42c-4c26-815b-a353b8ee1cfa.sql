-- Generate a valid referral code and create association record
DO $$
DECLARE
  generated_code TEXT;
BEGIN
  -- Generate a unique referral code for associations (A prefix)
  generated_code := public.generate_commission_entity_code('A');
  
  -- Create missing association record for user myoc130e1t@daouse.com
  INSERT INTO associations (
    user_id,
    association_name,
    responsible_person,
    email,
    country,
    referral_code,
    status,
    created_at,
    updated_at
  ) VALUES (
    'ae4bc417-88ee-40f9-bd50-52dfffc178ab',
    'fff',
    'fff', 
    'myoc130e1t@daouse.com',
    'España',
    generated_code,
    'pending',
    '2025-09-01 13:20:35.801528+00',  -- Match original registration time
    now()
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RAISE NOTICE 'Association created with referral code: %', generated_code;
END $$;