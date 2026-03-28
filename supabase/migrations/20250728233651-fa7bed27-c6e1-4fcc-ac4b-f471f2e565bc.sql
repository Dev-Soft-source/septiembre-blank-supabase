-- Create profile for existing auth user comiza.viorel@hotmail.com
-- This user exists in auth.users with ID 89640453-cc4b-4090-bb0f-30d7f34c0dd6
-- but lacks a profile record, which is needed for role-based access

INSERT INTO public.profiles (
  id,
  role,
  is_hotel_owner,
  is_active,
  email_verified,
  created_at,
  updated_at
) VALUES (
  '89640453-cc4b-4090-bb0f-30d7f34c0dd6',
  'user',
  false,
  true,
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  is_hotel_owner = EXCLUDED.is_hotel_owner,
  is_active = EXCLUDED.is_active,
  updated_at = now();