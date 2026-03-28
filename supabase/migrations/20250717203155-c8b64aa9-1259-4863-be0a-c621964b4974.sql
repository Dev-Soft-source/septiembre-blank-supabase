-- PHASE 1: Availability Package System - Database Foundation

-- Create availability_packages table
CREATE TABLE public.availability_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days IN (8, 15, 22, 29)),
  total_rooms INTEGER NOT NULL CHECK (total_rooms > 0),
  available_rooms INTEGER NOT NULL CHECK (available_rooms >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure available_rooms never exceeds total_rooms
  CONSTRAINT valid_room_count CHECK (available_rooms <= total_rooms),
  
  -- Ensure end_date matches start_date + duration
  CONSTRAINT valid_date_range CHECK (end_date = start_date + (duration_days - 1))
);

-- Create index for efficient queries
CREATE INDEX idx_availability_packages_hotel_date ON public.availability_packages(hotel_id, start_date, end_date);
CREATE INDEX idx_availability_packages_available ON public.availability_packages(hotel_id, available_rooms) WHERE available_rooms > 0;

-- Add package_id to bookings table
ALTER TABLE public.bookings ADD COLUMN package_id UUID REFERENCES public.availability_packages(id) ON DELETE SET NULL;
CREATE INDEX idx_bookings_package_id ON public.bookings(package_id);

-- Enable Row Level Security
ALTER TABLE public.availability_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for availability_packages
CREATE POLICY "Public can view availability packages" 
ON public.availability_packages 
FOR SELECT 
USING (true);

CREATE POLICY "Hotel owners can manage their packages" 
ON public.availability_packages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.hotels 
  WHERE hotels.id = availability_packages.hotel_id 
  AND hotels.owner_id = auth.uid()
));

CREATE POLICY "Admins can manage all packages" 
ON public.availability_packages 
FOR ALL 
USING (has_role('admin'));

-- Create function to check package availability atomically
CREATE OR REPLACE FUNCTION public.check_package_availability(
  p_package_id UUID,
  p_rooms_needed INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  available_count INTEGER;
BEGIN
  -- Get current available rooms with row lock
  SELECT available_rooms INTO available_count
  FROM availability_packages
  WHERE id = p_package_id
  FOR UPDATE;
  
  RETURN available_count >= p_rooms_needed;
END;
$$;

-- Create function to reserve package rooms atomically
CREATE OR REPLACE FUNCTION public.reserve_package_rooms(
  p_package_id UUID,
  p_rooms_to_reserve INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  available_count INTEGER;
BEGIN
  -- Get current available rooms with row lock
  SELECT available_rooms INTO available_count
  FROM availability_packages
  WHERE id = p_package_id
  FOR UPDATE;
  
  -- Check if enough rooms available
  IF available_count < p_rooms_to_reserve THEN
    RETURN FALSE;
  END IF;
  
  -- Reserve the rooms
  UPDATE availability_packages
  SET available_rooms = available_rooms - p_rooms_to_reserve,
      updated_at = now()
  WHERE id = p_package_id;
  
  RETURN TRUE;
END;
$$;

-- Create function to restore package availability (for cancellations)
CREATE OR REPLACE FUNCTION public.restore_package_availability(
  p_package_id UUID,
  p_rooms_to_restore INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Restore the rooms, ensuring we don't exceed total_rooms
  UPDATE availability_packages
  SET available_rooms = LEAST(available_rooms + p_rooms_to_restore, total_rooms),
      updated_at = now()
  WHERE id = p_package_id;
  
  RETURN TRUE;
END;
$$;

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_availability_packages_updated_at
  BEFORE UPDATE ON public.availability_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to prevent overlapping packages
CREATE OR REPLACE FUNCTION public.check_package_overlap()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check for overlapping packages for the same hotel
  IF EXISTS (
    SELECT 1 FROM availability_packages
    WHERE hotel_id = NEW.hotel_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND (
      (NEW.start_date >= start_date AND NEW.start_date <= end_date) OR
      (NEW.end_date >= start_date AND NEW.end_date <= end_date) OR
      (NEW.start_date <= start_date AND NEW.end_date >= end_date)
    )
  ) THEN
    RAISE EXCEPTION 'Package dates overlap with existing package for this hotel';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to prevent overlapping packages
CREATE TRIGGER prevent_package_overlap
  BEFORE INSERT OR UPDATE ON public.availability_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.check_package_overlap();