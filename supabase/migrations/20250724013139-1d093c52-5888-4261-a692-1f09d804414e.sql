-- Fix hotels with empty available_months arrays
-- Update all hotels that have empty available_months to include all 12 months
UPDATE public.hotels 
SET available_months = ARRAY[
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
],
updated_at = now()
WHERE status = 'approved' 
AND (available_months IS NULL OR available_months = '{}');