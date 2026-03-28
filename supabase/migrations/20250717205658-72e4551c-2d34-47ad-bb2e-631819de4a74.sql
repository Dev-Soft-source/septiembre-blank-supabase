-- Performance optimization: Add indexes for availability_packages queries
CREATE INDEX IF NOT EXISTS idx_availability_packages_hotel_dates 
ON availability_packages (hotel_id, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_availability_packages_hotel_availability 
ON availability_packages (hotel_id, available_rooms) 
WHERE available_rooms > 0;

CREATE INDEX IF NOT EXISTS idx_availability_packages_status_lookup 
ON availability_packages (hotel_id, start_date) 
WHERE start_date >= CURRENT_DATE;

-- Performance optimization: Add index for bookings package lookup
CREATE INDEX IF NOT EXISTS idx_bookings_package_status 
ON bookings (package_id, status) 
WHERE status IN ('pending', 'confirmed');

-- Enhanced atomic functions with better concurrency protection
CREATE OR REPLACE FUNCTION public.check_package_availability_enhanced(p_package_id uuid, p_rooms_needed integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  available_count INTEGER;
  current_time TIMESTAMP WITH TIME ZONE;
BEGIN
  current_time := now();
  
  -- Get current available rooms with row lock for concurrency protection
  SELECT available_rooms INTO available_count
  FROM availability_packages
  WHERE id = p_package_id
    AND start_date >= CURRENT_DATE  -- Only allow bookings for future/current packages
  FOR UPDATE NOWAIT;  -- Fail fast if locked by another transaction
  
  -- Check if package exists and has sufficient availability
  IF available_count IS NULL THEN
    RAISE LOG 'Package not found or not available for booking: %', p_package_id;
    RETURN FALSE;
  END IF;
  
  IF available_count < p_rooms_needed THEN
    RAISE LOG 'Insufficient rooms available. Requested: %, Available: %', p_rooms_needed, available_count;
    RETURN FALSE;
  END IF;
  
  RAISE LOG 'Package availability check passed: % rooms available, % requested', available_count, p_rooms_needed;
  RETURN TRUE;
  
EXCEPTION
  WHEN lock_not_available THEN
    RAISE LOG 'Package % is locked by another transaction', p_package_id;
    RETURN FALSE;
  WHEN OTHERS THEN
    RAISE LOG 'Error checking package availability: %', SQLERRM;
    RETURN FALSE;
END;
$function$;

-- Enhanced reservation function with audit logging
CREATE OR REPLACE FUNCTION public.reserve_package_rooms_enhanced(p_package_id uuid, p_rooms_to_reserve integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  available_count INTEGER;
  reservation_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
  reservation_timestamp := now();
  
  -- Get current available rooms with row lock
  SELECT available_rooms INTO available_count
  FROM availability_packages
  WHERE id = p_package_id
    AND start_date >= CURRENT_DATE
  FOR UPDATE NOWAIT;
  
  -- Validate package exists and has sufficient rooms
  IF available_count IS NULL THEN
    RAISE LOG 'Package not found for reservation: %', p_package_id;
    RETURN FALSE;
  END IF;
  
  IF available_count < p_rooms_to_reserve THEN
    RAISE LOG 'Insufficient rooms for reservation. Available: %, Requested: %', available_count, p_rooms_to_reserve;
    RETURN FALSE;
  END IF;
  
  -- Reserve the rooms atomically
  UPDATE availability_packages
  SET available_rooms = available_rooms - p_rooms_to_reserve,
      updated_at = reservation_timestamp
  WHERE id = p_package_id;
  
  RAISE LOG 'Successfully reserved % rooms for package %. Remaining availability: %', 
    p_rooms_to_reserve, p_package_id, (available_count - p_rooms_to_reserve);
  
  RETURN TRUE;
  
EXCEPTION
  WHEN lock_not_available THEN
    RAISE LOG 'Package % is locked by another transaction during reservation', p_package_id;
    RETURN FALSE;
  WHEN OTHERS THEN
    RAISE LOG 'Error reserving package rooms: %', SQLERRM;
    RETURN FALSE;
END;
$function$;

-- Enhanced restore function with validation
CREATE OR REPLACE FUNCTION public.restore_package_availability_enhanced(p_package_id uuid, p_rooms_to_restore integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_available INTEGER;
  total_rooms_count INTEGER;
  restore_timestamp TIMESTAMP WITH TIME ZONE;
BEGIN
  restore_timestamp := now();
  
  -- Get current state with row lock
  SELECT available_rooms, total_rooms 
  INTO current_available, total_rooms_count
  FROM availability_packages
  WHERE id = p_package_id
  FOR UPDATE NOWAIT;
  
  -- Validate package exists
  IF current_available IS NULL OR total_rooms_count IS NULL THEN
    RAISE LOG 'Package not found for availability restoration: %', p_package_id;
    RETURN FALSE;
  END IF;
  
  -- Validate we don't exceed total room capacity
  IF (current_available + p_rooms_to_restore) > total_rooms_count THEN
    RAISE LOG 'Cannot restore % rooms - would exceed total capacity. Current: %, Total: %', 
      p_rooms_to_restore, current_available, total_rooms_count;
    RETURN FALSE;
  END IF;
  
  -- Restore the rooms atomically
  UPDATE availability_packages
  SET available_rooms = LEAST(available_rooms + p_rooms_to_restore, total_rooms),
      updated_at = restore_timestamp
  WHERE id = p_package_id;
  
  RAISE LOG 'Successfully restored % rooms for package %. New availability: %', 
    p_rooms_to_restore, p_package_id, LEAST(current_available + p_rooms_to_restore, total_rooms_count);
  
  RETURN TRUE;
  
EXCEPTION
  WHEN lock_not_available THEN
    RAISE LOG 'Package % is locked by another transaction during restore', p_package_id;
    RETURN FALSE;
  WHEN OTHERS THEN
    RAISE LOG 'Error restoring package availability: %', SQLERRM;
    RETURN FALSE;
END;
$function$;

-- Add constraint to prevent negative available rooms
ALTER TABLE availability_packages 
ADD CONSTRAINT check_available_rooms_non_negative 
CHECK (available_rooms >= 0);

-- Add constraint to ensure available rooms don't exceed total rooms
ALTER TABLE availability_packages 
ADD CONSTRAINT check_available_not_exceed_total 
CHECK (available_rooms <= total_rooms);