-- Step 4b: Now approve the hotel after adding images
UPDATE hotels 
SET status = 'approved', updated_at = now()
WHERE name = 'Prioridad 1' AND status = 'pending';