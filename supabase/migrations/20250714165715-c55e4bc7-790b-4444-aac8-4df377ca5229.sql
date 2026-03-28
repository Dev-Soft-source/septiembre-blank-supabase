-- CRITICAL FIX: Deactivate all manual filters to enforce JotForm as single source of truth
UPDATE filters 
SET is_active = false 
WHERE source_type = 'manual';

-- Remove legacy theme and activity data dependencies
UPDATE filters 
SET is_active = false 
WHERE source_type != 'jotform';