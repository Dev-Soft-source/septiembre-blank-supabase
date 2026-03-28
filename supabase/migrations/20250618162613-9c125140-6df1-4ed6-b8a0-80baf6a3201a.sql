
-- Update the user profile to set the correct role for hotel access
UPDATE public.profiles 
SET role = 'hotel_owner'
WHERE id = '786aefb8-bd6e-4955-8a0e-ec82efa0e608';

-- Ensure the user has the hotel role in user_roles table
INSERT INTO public.user_roles (user_id, role) 
VALUES ('786aefb8-bd6e-4955-8a0e-ec82efa0e608', 'hotel')
ON CONFLICT (user_id, role) DO NOTHING;
