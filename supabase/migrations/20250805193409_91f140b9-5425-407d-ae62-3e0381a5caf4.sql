-- Create a demo profile for the demo hotels owner
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@hotelliving.com',
  '$2a$10$dummy_hash_for_demo_user',
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "hotel"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create the corresponding profile
INSERT INTO profiles (
  id,
  role,
  is_hotel_owner,
  first_name,
  last_name,
  email_verified,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'hotel_owner',
  true,
  'Demo',
  'Owner',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;