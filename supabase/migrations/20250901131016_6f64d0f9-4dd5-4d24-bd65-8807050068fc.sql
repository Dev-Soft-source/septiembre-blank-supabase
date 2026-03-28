-- Fix associations for users who already signed up but don't have association records
INSERT INTO public.associations (
  user_id, 
  association_name, 
  email, 
  responsible_person, 
  country, 
  status,
  referral_code
)
SELECT DISTINCT
  au.id,
  COALESCE(au.raw_user_meta_data ->> 'association_name', au.raw_user_meta_data ->> 'nombreAsociacion', 'Association'),
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'full_name', au.raw_user_meta_data ->> 'association_name', 'Unknown'),
  COALESCE(au.raw_user_meta_data ->> 'country', 'Unknown'),
  'pending',
  public.generate_commission_entity_code('A')
FROM auth.users au
WHERE au.raw_user_meta_data ->> 'role' = 'association'
  AND au.email_confirmed_at IS NOT NULL
  AND au.created_at > now() - interval '48 hours'
  AND NOT EXISTS (
    SELECT 1 FROM public.associations a WHERE a.user_id = au.id
  );