
-- Review all Spanish translations to identify any remaining English text
SELECT 
    tt.id,
    tt.theme_id,
    tt.name,
    tt.description,
    t.category,
    t.level,
    t.sort_order
FROM theme_translations tt
JOIN themes t ON tt.theme_id = t.id
WHERE tt.locale = 'es'
ORDER BY t.category, t.level, t.sort_order, tt.name;
