-- Step 5: Admin approval - Update hotel status to approved
UPDATE hotels 
SET status = 'approved', updated_at = now()
WHERE id = 'f3f4bc58-dade-476a-9a0a-5d31e34b5f10' -- First Prioridad 1 hotel
RETURNING id, name, status;