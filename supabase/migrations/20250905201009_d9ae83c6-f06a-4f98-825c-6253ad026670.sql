-- Create promoter records for existing promoter profiles that don't have them
INSERT INTO public.promoters (profile_id, status, created_at, updated_at)
SELECT 
  p.id,
  'active',
  NOW(),
  NOW()
FROM profiles p
LEFT JOIN promoters pr ON pr.profile_id = p.id
WHERE p.role = 'promoter' AND pr.id IS NULL;