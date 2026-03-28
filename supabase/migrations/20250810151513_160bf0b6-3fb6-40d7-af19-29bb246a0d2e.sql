-- Add total_rooms column to hotels table
ALTER TABLE public.hotels 
ADD COLUMN total_rooms integer;

-- Add check constraint to ensure positive values
ALTER TABLE public.hotels 
ADD CONSTRAINT hotels_total_rooms_positive 
CHECK (total_rooms IS NULL OR total_rooms > 0);