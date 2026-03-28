-- Update availability packages and booking logic for simplified flow

-- 1. Remove overlap checks from availability packages
DROP TRIGGER IF EXISTS check_package_overlap_trigger ON public.availability_packages;
DROP FUNCTION IF EXISTS public.check_package_overlap();

-- 2. Update booking commission logic to automatic 15% processing
CREATE OR REPLACE FUNCTION public.process_booking_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hotel_commission DECIMAL(5,2) := 5.0; -- Always 5% to hotel
  total_commission DECIMAL(5,2) := 15.0; -- Always 15% total
  commission_amount INTEGER;
  referral_commission DECIMAL(5,2);
  referral_source_type TEXT;
  referral_source_id UUID;
BEGIN
  -- Only process confirmed bookings
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    
    commission_amount := ROUND(NEW.total_price * (total_commission / 100.0));
    
    -- Always allocate 5% to hotel
    INSERT INTO public.booking_commissions (
      booking_id, 
      referred_by, 
      commission_usd, 
      commission_percent
    ) VALUES (
      NEW.id,
      'hotel_' || NEW.hotel_id::text,
      ROUND(NEW.total_price * (hotel_commission / 100.0)),
      hotel_commission
    ) ON CONFLICT (booking_id) DO NOTHING;
    
    -- Check if there's a referral source for additional commission
    IF NEW.referral_code_used IS NOT NULL THEN
      -- Determine referral source and commission rate
      SELECT 
        CASE 
          WHEN EXISTS (SELECT 1 FROM hotel_associations WHERE referral_code = NEW.referral_code_used) THEN 'association'
          WHEN EXISTS (SELECT 1 FROM agents WHERE referral_code = NEW.referral_code_used) THEN 'promoter'
          WHEN EXISTS (SELECT 1 FROM hotels WHERE referral_code = NEW.referral_code_used) THEN 'hotel_referrer'
          ELSE NULL
        END,
        CASE 
          WHEN EXISTS (SELECT 1 FROM hotel_associations WHERE referral_code = NEW.referral_code_used) THEN 
            (SELECT id FROM hotel_associations WHERE referral_code = NEW.referral_code_used LIMIT 1)
          WHEN EXISTS (SELECT 1 FROM agents WHERE referral_code = NEW.referral_code_used) THEN 
            (SELECT id FROM agents WHERE referral_code = NEW.referral_code_used LIMIT 1)
          WHEN EXISTS (SELECT 1 FROM hotels WHERE referral_code = NEW.referral_code_used) THEN 
            (SELECT id FROM hotels WHERE referral_code = NEW.referral_code_used LIMIT 1)
          ELSE NULL
        END
      INTO referral_source_type, referral_source_id;
      
      -- Allocate appropriate commission percentage based on source type
      IF referral_source_type = 'association' THEN
        referral_commission := 4.0; -- 4% for associations
      ELSIF referral_source_type = 'promoter' THEN
        referral_commission := 4.0; -- 4% for promoters 
      ELSIF referral_source_type = 'hotel_referrer' THEN
        referral_commission := 6.0; -- 6% for hotel referrals (total 15% - 5% hotel - 6% referrer = 4% to platform)
      END IF;
      
      -- Create referral commission record
      IF referral_commission > 0 THEN
        INSERT INTO public.booking_commissions (
          booking_id,
          referred_by,
          commission_usd,
          commission_percent
        ) VALUES (
          NEW.id,
          referral_source_type || '_' || referral_source_id::text,
          ROUND(NEW.total_price * (referral_commission / 100.0)),
          referral_commission
        ) ON CONFLICT DO NOTHING;
        
        -- Update booking with commission source info
        UPDATE public.bookings 
        SET 
          commission_source_type = referral_source_type,
          commission_source_id = referral_source_id
        WHERE id = NEW.id;
      END IF;
    END IF;
    
    RAISE LOG 'Commission processed for booking %: Total 15%%, Hotel 5%%, Referral: % %%', 
      NEW.id, COALESCE(referral_commission, 0);
      
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Create trigger for automatic commission processing
DROP TRIGGER IF EXISTS process_booking_commission_trigger ON public.bookings;
CREATE TRIGGER process_booking_commission_trigger
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION process_booking_commission();

-- 4. Update package availability to auto-hide when stock = 0
CREATE OR REPLACE VIEW public.available_packages AS
SELECT ap.*
FROM public.availability_packages ap
WHERE ap.available_rooms > 0;

-- 5. Ensure packages restore stock on cancellation
CREATE OR REPLACE FUNCTION public.restore_stock_on_cancellation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When booking is cancelled, restore rooms to package
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE public.availability_packages
    SET available_rooms = LEAST(available_rooms + NEW.guest_count, total_rooms)
    WHERE id = NEW.package_id;
    
    RAISE LOG 'Restored % rooms to package % due to booking cancellation', 
      NEW.guest_count, NEW.package_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for stock restoration
DROP TRIGGER IF EXISTS restore_stock_on_cancellation_trigger ON public.bookings;
CREATE TRIGGER restore_stock_on_cancellation_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION restore_stock_on_cancellation();