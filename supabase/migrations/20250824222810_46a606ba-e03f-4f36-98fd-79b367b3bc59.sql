-- Add missing columns to hotels table for batch-create-us-hotels functionality

-- Add rating column (numeric, to store hotel star ratings like 3.8, 4.1, etc.)
ALTER TABLE public.hotels 
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) CHECK (rating >= 1.0 AND rating <= 5.0);

-- Add state column (text, to store US state information)
ALTER TABLE public.hotels 
ADD COLUMN IF NOT EXISTS state TEXT;

-- Add helpful comments
COMMENT ON COLUMN public.hotels.rating IS 'Hotel star rating from 1.0 to 5.0';
COMMENT ON COLUMN public.hotels.state IS 'State/province for location-based filtering and display';