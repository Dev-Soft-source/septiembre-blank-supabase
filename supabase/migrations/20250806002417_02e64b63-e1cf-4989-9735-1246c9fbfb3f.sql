-- Update existing demo hotels with correct pricing structure
-- This migration fixes all batch-created demo hotels to use the predefined pricing table

-- Update hotel categories based on city (using city since state is not a column)
UPDATE hotels 
SET category = CASE 
  WHEN city IN ('Fremont', 'Atlantic City', 'Pittsburgh', 'Columbus') THEN 4
  ELSE 3
END
WHERE status = 'approved' 
AND owner_id IN (SELECT id FROM admin_users)
AND created_at > '2024-01-01';

-- Update rates and price_per_month for all demo hotels
UPDATE hotels 
SET 
  rates = CASE 
    WHEN category = 4 THEN '{
      "8-double": 385,
      "8-single": 605,
      "15-double": 742.50,
      "15-single": 1155,
      "22-double": 1072.50,
      "22-single": 1650,
      "29-double": 1430,
      "29-single": 2090
    }'::jsonb
    ELSE '{
      "8-double": 247.50,
      "8-single": 385,
      "15-double": 467.50,
      "15-single": 715,
      "22-double": 660,
      "22-single": 1020,
      "29-double": 880,
      "29-single": 1320
    }'::jsonb
  END,
  price_per_month = CASE 
    WHEN category = 4 THEN 1430  -- 29-day double room per person
    ELSE 880                     -- 29-day double room per person
  END
WHERE status = 'approved' 
AND owner_id IN (SELECT id FROM admin_users)
AND created_at > '2024-01-01';