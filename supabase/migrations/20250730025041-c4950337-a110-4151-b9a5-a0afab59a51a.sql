-- Fix function search path security warnings by setting explicit search_path

-- Update increment_hotel_version function with secure search_path
CREATE OR REPLACE FUNCTION public.increment_hotel_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update check_version_conflict function with secure search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update lock_hotel_for_editing function with secure search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update cleanup_stale_hotel_locks function with secure search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;