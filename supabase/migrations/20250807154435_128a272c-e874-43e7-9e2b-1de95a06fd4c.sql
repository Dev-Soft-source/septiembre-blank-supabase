-- Update Supabase configuration for production domain
-- This will update the external_url and additional_redirect_urls in config

-- Note: The actual Site URL and redirect URLs must be configured in the Supabase dashboard
-- under Authentication > URL Configuration with these values:

-- Site URL: https://www.hotel-living.com

-- Redirect URLs (add all of these):
-- https://www.hotel-living.com/entrada-admin
-- https://www.hotel-living.com/admin-login  
-- https://www.hotel-living.com/panel-admin
-- https://www.hotel-living.com/admin-restore
-- https://ca48e511-da23-4c95-9913-59cb1724cacc.lovableproject.com
-- https://ca48e511-da23-4c95-9913-59cb1724cacc.lovableproject.com/auth/callback

-- This migration serves as documentation of the required configuration
SELECT 'Supabase authentication URLs must be configured in dashboard for production access' as note;