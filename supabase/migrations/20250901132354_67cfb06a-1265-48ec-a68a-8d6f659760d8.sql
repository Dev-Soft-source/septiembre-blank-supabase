-- Create missing association record for user myoc130e1t@daouse.com
INSERT INTO associations (
  user_id,
  association_name,
  responsible_person,
  email,
  country,
  status,
  created_at,
  updated_at
) VALUES (
  'ae4bc417-88ee-40f9-bd50-52dfffc178ab',
  'fff',
  'fff', 
  'myoc130e1t@daouse.com',
  'España',
  'pending',
  '2025-09-01 13:20:35.801528+00',  -- Match original registration time
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Trigger admin notification for this association
SELECT public.trigger_missed_association_notifications();