-- Add a regular user role for comiza.viorel@hotmail.com
INSERT INTO public.user_roles (user_id, email, role)
VALUES (
  gen_random_uuid(), -- Generate a UUID for user_id since we don't have the actual auth user
  'comiza.viorel@hotmail.com',
  'user'
);