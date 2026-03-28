-- Hotels table structure cleanup and reorganization
-- This migration handles column renames, deletions, and photos refactor

-- Step 1: Rename columns and handle duplicates
-- Rename style to property_style (delete existing empty property_style first if it exists)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS property_style;
ALTER TABLE public.hotels RENAME COLUMN style TO property_style;

-- Rename ideal_guests to ideal_guests_description (delete existing empty duplicate first)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS ideal_guests_description;
ALTER TABLE public.hotels RENAME COLUMN ideal_guests TO ideal_guests_description;

-- Rename atmosphere to atmosphere_description (delete existing empty duplicate first)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS atmosphere_description;
ALTER TABLE public.hotels RENAME COLUMN atmosphere TO atmosphere_description;

-- Step 2: Delete completely unused columns (0% usage)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS rejection_reason;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS location_address;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS location_highlight_description;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS location_description;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS preferred;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS locked_by;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS locked_at;

-- Step 3: Remove photos array column (currently empty)
ALTER TABLE public.hotels DROP COLUMN IF EXISTS photos;

-- Note: hotel_images table already exists for multiple images per hotel
-- main_image_url is kept in hotels table for primary photo
-- All secondary/multiple photos should use hotel_images table

-- Add a comment to document the changes
COMMENT ON TABLE public.hotels IS 'Hotels table - cleaned up structure with consolidated columns and removed unused fields';
COMMENT ON COLUMN public.hotels.property_style IS 'Renamed from style - describes the architectural/design style of the property';
COMMENT ON COLUMN public.hotels.ideal_guests_description IS 'Renamed from ideal_guests - description of the target guest profile';
COMMENT ON COLUMN public.hotels.atmosphere_description IS 'Renamed from atmosphere - description of the property atmosphere and ambiance';
COMMENT ON COLUMN public.hotels.main_image_url IS 'Primary image URL - secondary images stored in hotel_images table';