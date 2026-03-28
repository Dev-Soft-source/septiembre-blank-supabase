-- Step 4: Approve the hotel (simulating admin approval)
UPDATE hotels 
SET status = 'approved', updated_at = now()
WHERE name = 'Prioridad 1' AND status = 'pending';