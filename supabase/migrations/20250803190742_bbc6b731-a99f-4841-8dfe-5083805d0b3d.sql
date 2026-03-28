-- Enable password strength and leaked password protection
-- This is a security best practice to prevent weak and compromised passwords
UPDATE auth.config SET value = 'true' WHERE key = 'password_min_length_enabled';
UPDATE auth.config SET value = '8' WHERE key = 'password_min_length';
UPDATE auth.config SET value = 'true' WHERE key = 'password_leaked_check_enabled';