-- Remove latitude and longitude columns from hotels table (temporarily until geolocation feature is properly implemented)
ALTER TABLE public.hotels 
DROP COLUMN IF EXISTS latitude,
DROP COLUMN IF EXISTS longitude;