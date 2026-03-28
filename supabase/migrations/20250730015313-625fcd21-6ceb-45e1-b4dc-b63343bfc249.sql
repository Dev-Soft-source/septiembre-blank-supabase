-- Add room_description column for step 6 of hotel registration form
ALTER TABLE public.hotels 
ADD COLUMN room_description TEXT;

-- Add separate boolean columns for laundry services to replace complex JSON handling
ALTER TABLE public.hotels 
ADD COLUMN weekly_laundry_included BOOLEAN DEFAULT false,
ADD COLUMN external_laundry_available BOOLEAN DEFAULT false;