
-- Add admin role for the current user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('786aefb8-bd6e-4955-8a0e-ec82efa0e608', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
