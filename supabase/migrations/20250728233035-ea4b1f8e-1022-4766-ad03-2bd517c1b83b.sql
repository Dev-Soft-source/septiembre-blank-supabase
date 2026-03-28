-- First, let's check if comiza.viorel@hotmail.com exists in auth.users
-- If not, we'll just add a role record with a NULL user_id but valid email
INSERT INTO public.user_roles (email, role)
VALUES ('comiza.viorel@hotmail.com', 'traveler');