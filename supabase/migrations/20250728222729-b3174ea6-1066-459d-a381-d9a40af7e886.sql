-- Fix Fernando's admin access by updating his role and adding to admin_users
-- First, add Fernando to admin_users table
INSERT INTO admin_users (id) 
VALUES ('df3ac2e1-01cc-4052-9530-093be4ffde08')
ON CONFLICT (id) DO NOTHING;

-- Update Fernando's existing role from 'promoter' to 'admin'
UPDATE user_roles 
SET role = 'admin', updated_at = now()
WHERE email = 'fernandoespineira6@gmail.com' AND user_id = 'df3ac2e1-01cc-4052-9530-093be4ffde08';