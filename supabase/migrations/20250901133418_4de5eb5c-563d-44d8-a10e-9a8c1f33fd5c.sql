-- Update all existing pending associations to approved status
UPDATE associations 
SET status = 'approved', updated_at = now() 
WHERE status = 'pending';