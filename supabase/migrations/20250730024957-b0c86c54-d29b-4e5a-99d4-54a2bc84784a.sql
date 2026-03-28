-- Add version control and proper foreign key constraints for data integrity

-- Add version column to hotels table for concurrent editing protection
ALTER TABLE public.hotels 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_modified_by UUID,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS locked_by UUID,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE;

-- Add proper foreign key constraints with CASCADE DELETE for orphan cleanup
ALTER TABLE public.hotel_images 
DROP CONSTRAINT IF EXISTS hotel_images_hotel_id_fkey,
ADD CONSTRAINT hotel_images_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;

ALTER TABLE public.hotel_themes 
DROP CONSTRAINT IF EXISTS hotel_themes_hotel_id_fkey,
ADD CONSTRAINT hotel_themes_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;

ALTER TABLE public.hotel_activities 
DROP CONSTRAINT IF EXISTS hotel_activities_hotel_id_fkey,
ADD CONSTRAINT hotel_activities_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;

ALTER TABLE public.availability_packages 
DROP CONSTRAINT IF EXISTS availability_packages_hotel_id_fkey,
ADD CONSTRAINT availability_packages_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;

ALTER TABLE public.hotel_availability 
DROP CONSTRAINT IF EXISTS hotel_availability_hotel_id_fkey,
ADD CONSTRAINT hotel_availability_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;

-- Create function to increment version on hotel updates
CREATE OR REPLACE FUNCTION public.increment_hotel_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for version incrementing
DROP TRIGGER IF EXISTS hotel_version_trigger ON public.hotels;
CREATE TRIGGER hotel_version_trigger
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_hotel_version();

-- Create function to check version conflicts
CREATE OR REPLACE FUNCTION public.check_version_conflict(p_hotel_id UUID, p_expected_version INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_version INTEGER;
BEGIN
  SELECT version INTO current_version 
  FROM public.hotels 
  WHERE id = p_hotel_id;
  
  RETURN current_version = p_expected_version;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to safely lock/unlock hotel for editing
CREATE OR REPLACE FUNCTION public.lock_hotel_for_editing(p_hotel_id UUID, p_lock BOOLEAN DEFAULT true)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  lock_owner UUID;
  lock_time TIMESTAMP WITH TIME ZONE;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get current lock status
  SELECT locked_by, locked_at INTO lock_owner, lock_time
  FROM public.hotels 
  WHERE id = p_hotel_id;
  
  IF p_lock THEN
    -- Trying to acquire lock
    IF lock_owner IS NOT NULL AND lock_owner != current_user_id THEN
      -- Check if lock is stale (older than 30 minutes)
      IF lock_time IS NULL OR (now() - lock_time) < interval '30 minutes' THEN
        RETURN false; -- Lock held by another user
      END IF;
    END IF;
    
    -- Acquire or refresh lock
    UPDATE public.hotels 
    SET is_locked = true, 
        locked_by = current_user_id, 
        locked_at = now()
    WHERE id = p_hotel_id;
    
  ELSE
    -- Trying to release lock
    IF lock_owner = current_user_id OR lock_owner IS NULL THEN
      UPDATE public.hotels 
      SET is_locked = false, 
          locked_by = NULL, 
          locked_at = NULL
      WHERE id = p_hotel_id;
    ELSE
      RETURN false; -- Can't release someone else's lock
    END IF;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up stale locks
CREATE OR REPLACE FUNCTION public.cleanup_stale_hotel_locks()
RETURNS INTEGER AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  UPDATE public.hotels 
  SET is_locked = false, 
      locked_by = NULL, 
      locked_at = NULL
  WHERE is_locked = true 
    AND locked_at IS NOT NULL 
    AND (now() - locked_at) > interval '30 minutes';
    
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for performance on version and lock queries
CREATE INDEX IF NOT EXISTS idx_hotels_version ON public.hotels(version);
CREATE INDEX IF NOT EXISTS idx_hotels_locked ON public.hotels(is_locked, locked_by, locked_at);

-- Update RLS policies to respect locks
DROP POLICY IF EXISTS "Hotel owners can update own hotels with version check" ON public.hotels;
CREATE POLICY "Hotel owners can update own hotels with version check" ON public.hotels
FOR UPDATE 
USING (
  auth.uid() = owner_id 
  AND (NOT is_locked OR locked_by = auth.uid())
  AND status != 'pending'
);

-- Create policy to prevent editing during admin review
DROP POLICY IF EXISTS "Block editing during admin review" ON public.hotels;
CREATE POLICY "Block editing during admin review" ON public.hotels
FOR UPDATE 
USING (
  auth.uid() = owner_id 
  AND status != 'pending'
  AND (NOT is_locked OR locked_by = auth.uid())
);