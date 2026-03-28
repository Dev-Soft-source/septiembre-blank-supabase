-- CRITICAL FIX: Recategorize affinities from "other_options" to "themes"
-- These are the 120 affinities that are currently miscategorized
UPDATE filters 
SET category = 'themes' 
WHERE source_type = 'jotform' 
AND category = 'other_options' 
AND jotform_field_id = '19';

-- Verify the update
SELECT category, COUNT(*) as count 
FROM filters 
WHERE source_type = 'jotform' AND is_active = true 
GROUP BY category 
ORDER BY category;