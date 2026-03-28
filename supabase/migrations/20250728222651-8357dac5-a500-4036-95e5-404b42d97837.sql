-- Fix admin access by adding Fernando's email to admin roles and admin_users table
-- First, delete the orphaned admin user record
DELETE FROM admin_users WHERE id = '786aefb8-bd6e-4955-8a0e-ec82efa0e608';

-- Add Fernando's primary email to admin_users table
INSERT INTO admin_users (id) 
VALUES ('df3ac2e1-01cc-4052-9530-093be4ffde08');

-- Add admin role to user_roles for Fernando's primary email
INSERT INTO user_roles (user_id, email, role)
VALUES ('df3ac2e1-01cc-4052-9530-093be4ffde08', 'fernandoespineira6@gmail.com', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;