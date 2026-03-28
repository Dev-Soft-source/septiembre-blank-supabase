
-- Check if there are any Spanish translations at all
SELECT COUNT(*) as total_spanish_translations
FROM theme_translations 
WHERE locale = 'es';

-- Get a sample of Spanish translations to verify the data
SELECT 
    tt.name,
    tt.locale,
    t.category
FROM theme_translations tt
JOIN themes t ON tt.theme_id = t.id
WHERE tt.locale = 'es'
LIMIT 10;

-- Look for potential English words in Spanish translations
-- Common English indicators: words ending in -ing, -tion, -ly, etc.
SELECT 
    tt.name,
    tt.theme_id,
    t.category
FROM theme_translations tt
JOIN themes t ON tt.theme_id = t.id
WHERE tt.locale = 'es' 
AND (
    tt.name ILIKE '%ing%' OR
    tt.name ILIKE '%tion%' OR
    tt.name ILIKE '%music%' OR
    tt.name ILIKE '%art%' OR
    tt.name ILIKE '%sports%' OR
    tt.name ILIKE '%business%' OR
    tt.name ILIKE '%science%' OR
    tt.name ILIKE '%education%' OR
    tt.name ILIKE '%entertainment%' OR
    tt.name ILIKE '%lifestyle%' OR
    tt.name ILIKE '%nature%' OR
    tt.name ILIKE '%development%' OR
    tt.name ILIKE '%relationship%' OR
    tt.name ILIKE '%technology%' OR
    tt.name ILIKE '% and %' OR
    tt.name ILIKE '% & %'
)
ORDER BY tt.name;
