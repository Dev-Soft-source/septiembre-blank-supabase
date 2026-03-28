-- CRITICAL ROLE FIXES - URGENT CORRECTIONS

-- 1. Remove fernandoespineira6@gmail.com from admin_users and change to promoter
DELETE FROM admin_users WHERE id = 'df3ac2e1-01cc-4052-9530-093be4ffde08';
UPDATE user_roles SET role = 'promoter', updated_at = now() 
WHERE user_id = 'df3ac2e1-01cc-4052-9530-093be4ffde08';

-- 2. Ensure grand_soiree@yahoo.com is the ONLY admin
-- First clean up any duplicate roles for this user
DELETE FROM user_roles WHERE user_id = '786aefb8-bd6e-4955-8a0e-ec82efa0e608' AND role = 'hotel';
-- Ensure this user has admin role and is in admin_users table
INSERT INTO user_roles (user_id, email, role) 
VALUES ('786aefb8-bd6e-4955-8a0e-ec82efa0e608', 'grand_soiree@yahoo.com', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
INSERT INTO admin_users (id) 
VALUES ('786aefb8-bd6e-4955-8a0e-ec82efa0e608')
ON CONFLICT (id) DO NOTHING;

-- 3. fernando_espineira@yahoo.com should remain association (appears correct)
-- Verify it's set correctly
UPDATE user_roles SET role = 'association', updated_at = now() 
WHERE user_id = '59aec73d-a125-49ca-9cf3-e5c33190eba1';

-- 4. sogajo6961@0tires.com should remain hotel (appears correct)
-- Ensure proper hotel role
UPDATE user_roles SET role = 'hotel', updated_at = now() 
WHERE user_id = '0b95a83d-b596-428c-90c7-c1fda79f5ccf';

-- 5. Set up comiza.viorel@hotmail.com if needed (no role specified, leaving as is)