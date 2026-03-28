-- Create function to validate hotel images before publication
CREATE OR REPLACE FUNCTION public.validate_hotel_images()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- If hotel is being set to 'approved' status, check for valid images
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Check if hotel has a valid main_image_url
    IF NEW.main_image_url IS NULL OR NEW.main_image_url = '' OR NEW.main_image_url = '/placeholder.svg' THEN
      -- Check if hotel has valid hotel_images
      IF NOT EXISTS (
        SELECT 1 FROM public.hotel_images 
        WHERE hotel_id = NEW.id 
        AND image_url IS NOT NULL 
        AND image_url != '' 
        AND image_url != '/placeholder.svg'
        AND image_url NOT LIKE '%placeholder%'
      ) THEN
        -- Prevent approval without valid images
        RAISE EXCEPTION 'Cannot approve hotel without authentic images. Please upload at least one real photo of the hotel.';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger to validate images before hotel approval
DROP TRIGGER IF EXISTS validate_hotel_images_trigger ON public.hotels;
CREATE TRIGGER validate_hotel_images_trigger
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_hotel_images();

-- Function to check if a hotel has valid images
CREATE OR REPLACE FUNCTION public.hotel_has_valid_images(hotel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    CASE 
      WHEN h.main_image_url IS NOT NULL 
           AND h.main_image_url != '' 
           AND h.main_image_url != '/placeholder.svg'
           AND h.main_image_url NOT LIKE '%placeholder%'
      THEN true
      WHEN EXISTS (
        SELECT 1 FROM public.hotel_images hi
        WHERE hi.hotel_id = h.id 
        AND hi.image_url IS NOT NULL 
        AND hi.image_url != '' 
        AND hi.image_url != '/placeholder.svg'
        AND hi.image_url NOT LIKE '%placeholder%'
      )
      THEN true
      ELSE false
    END
  FROM public.hotels h
  WHERE h.id = hotel_has_valid_images.hotel_id;
$function$;

-- Function to get hotels without valid images (for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_hotels_without_images()
RETURNS TABLE(
  hotel_id uuid,
  hotel_name text,
  hotel_status text,
  city text,
  country text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    h.id,
    h.name,
    h.status,
    h.city,
    h.country,
    h.created_at
  FROM public.hotels h
  WHERE NOT public.hotel_has_valid_images(h.id)
  ORDER BY 
    CASE WHEN h.status = 'approved' THEN 1 ELSE 2 END,
    h.created_at DESC;
$function$;