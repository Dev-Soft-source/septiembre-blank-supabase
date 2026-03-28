-- Fix monthly pricing for all demo hotels to show correct per-person monthly rates
-- This migration recalculates price_per_month to reflect per-person rates based on double room 29-day packages

UPDATE hotels 
SET price_per_month = CASE 
  WHEN category = 4 THEN 715  -- 4-star: 1430 (29-day double room) / 2 = 715 per person
  ELSE 440                    -- 3-star: 880 (29-day double room) / 2 = 440 per person
END
WHERE status = 'approved' 
AND owner_id IN (SELECT id FROM admin_users)
AND created_at > '2024-01-01';