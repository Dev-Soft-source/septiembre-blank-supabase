-- Fix schema mismatches for hotel data import

-- Create missing hotel_themes table
CREATE TABLE IF NOT EXISTS public.hotel_themes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  theme_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Create missing hotel_translations table  
CREATE TABLE IF NOT EXISTS public.hotel_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  name text,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Add missing created_at column to hotel_activities table
ALTER TABLE public.hotel_activities 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Add missing owner_id column to hotels table (maps to profile_id)
ALTER TABLE public.hotels 
ADD COLUMN IF NOT EXISTS owner_id uuid;

-- Set owner_id to match profile_id for existing records
UPDATE public.hotels SET owner_id = profile_id WHERE owner_id IS NULL;

-- Add missing total_rooms column to availability_packages table (maps to rooms)
ALTER TABLE public.availability_packages 
ADD COLUMN IF NOT EXISTS total_rooms integer;

-- Set total_rooms to match rooms for existing records
UPDATE public.availability_packages SET total_rooms = rooms WHERE total_rooms IS NULL;