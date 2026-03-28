-- Hotels table structure cleanup with dependency handling
-- Step 1: Drop dependent views that reference the columns we're modifying
DROP VIEW IF EXISTS hotels_detailed_view CASCADE;

-- Step 2: Handle column renames and deletions
-- First, check if duplicate columns exist and drop them
ALTER TABLE public.hotels DROP COLUMN IF EXISTS property_style;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS ideal_guests_description; 
ALTER TABLE public.hotels DROP COLUMN IF EXISTS atmosphere_description;

-- Now rename the main columns
ALTER TABLE public.hotels RENAME COLUMN style TO property_style;
ALTER TABLE public.hotels RENAME COLUMN ideal_guests TO ideal_guests_description;
ALTER TABLE public.hotels RENAME COLUMN atmosphere TO atmosphere_description;

-- Step 3: Delete completely unused columns
ALTER TABLE public.hotels DROP COLUMN IF EXISTS rejection_reason;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS location_address;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS location_highlight_description;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS location_description;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS preferred;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS locked_by;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS locked_at;
ALTER TABLE public.hotels DROP COLUMN IF EXISTS photos;

-- Step 4: Add documentation comments
COMMENT ON TABLE public.hotels IS 'Hotels table - cleaned up structure with consolidated columns and removed unused fields';
COMMENT ON COLUMN public.hotels.property_style IS 'Renamed from style - describes the architectural/design style of the property';
COMMENT ON COLUMN public.hotels.ideal_guests_description IS 'Renamed from ideal_guests - description of the target guest profile';
COMMENT ON COLUMN public.hotels.atmosphere_description IS 'Renamed from atmosphere - description of the property atmosphere and ambiance';
COMMENT ON COLUMN public.hotels.main_image_url IS 'Primary image URL - secondary images stored in hotel_images table';