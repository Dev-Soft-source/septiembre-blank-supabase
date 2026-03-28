
-- Let's check what Spanish translations we have for the ART category items
SELECT 
    t.name as english_name,
    tt.name as spanish_name,
    t.category,
    t.level
FROM themes t
LEFT JOIN theme_translations tt ON t.id = tt.theme_id AND tt.locale = 'es'
WHERE t.category = 'ART'
ORDER BY t.level, t.sort_order, t.name;
