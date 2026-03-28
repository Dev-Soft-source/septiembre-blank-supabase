-- Fix the foreign key relationships and add missing constraints
-- First, ensure the foreign keys exist properly

-- Check if foreign key exists and recreate if needed
ALTER TABLE public.hotel_themes 
DROP CONSTRAINT IF EXISTS hotel_themes_theme_id_fkey;

ALTER TABLE public.hotel_themes 
ADD CONSTRAINT hotel_themes_theme_id_fkey 
FOREIGN KEY (theme_id) REFERENCES public.themes(id) ON DELETE CASCADE;

-- Also ensure hotel_activities has proper foreign key to activities
ALTER TABLE public.hotel_activities 
DROP CONSTRAINT IF EXISTS hotel_activities_activity_id_fkey;

ALTER TABLE public.hotel_activities 
ADD CONSTRAINT hotel_activities_activity_id_fkey 
FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE CASCADE;