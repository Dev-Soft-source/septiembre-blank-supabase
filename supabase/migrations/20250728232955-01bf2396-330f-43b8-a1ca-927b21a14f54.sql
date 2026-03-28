-- Add a regular user role for comiza.viorel@hotmail.com using 'traveler' role
INSERT INTO public.user_roles (user_id, email, role)
VALUES (
  gen_random_uuid(),
  'comiza.viorel@hotmail.com',
  'traveler'
);