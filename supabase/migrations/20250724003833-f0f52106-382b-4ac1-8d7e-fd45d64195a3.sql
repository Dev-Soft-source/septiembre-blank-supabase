-- Add English translations for all themes
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT 
    id as theme_id,
    'en' as locale,
    CASE 
        WHEN name = 'ART' THEN 'Art'
        WHEN name = 'FANS' THEN 'Fans'
        WHEN name = 'SPORTS' THEN 'Sports'
        WHEN name = 'FOOD & DRINKS' THEN 'Food & Drinks'
        WHEN name = 'MUSIC' THEN 'Music'
        WHEN name = 'HEALTH AND WELLNESS' THEN 'Health and Wellness'
        WHEN name = 'EDUCATION' THEN 'Education'
        WHEN name = 'SCIENCE AND KNOWLEDGE' THEN 'Science and Knowledge'
        WHEN name = 'BUSINESS' THEN 'Business'
        WHEN name = 'LANGUAGES' THEN 'Languages'
        ELSE name
    END as name,
    description
FROM themes
WHERE id NOT IN (SELECT theme_id FROM theme_translations WHERE locale = 'en');

-- Add Portuguese translations for all themes
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT 
    id as theme_id,
    'pt' as locale,
    CASE 
        WHEN name = 'ART' THEN 'Arte'
        WHEN name = 'FANS' THEN 'Fãs'
        WHEN name = 'SPORTS' THEN 'Esportes'
        WHEN name = 'FOOD & DRINKS' THEN 'Comida e Bebidas'
        WHEN name = 'MUSIC' THEN 'Música'
        WHEN name = 'HEALTH AND WELLNESS' THEN 'Saúde e Bem-estar'
        WHEN name = 'EDUCATION' THEN 'Educação'
        WHEN name = 'SCIENCE AND KNOWLEDGE' THEN 'Ciência e Conhecimento'
        WHEN name = 'BUSINESS' THEN 'Negócios'
        WHEN name = 'LANGUAGES' THEN 'Idiomas'
        ELSE name
    END as name,
    description
FROM themes
WHERE id NOT IN (SELECT theme_id FROM theme_translations WHERE locale = 'pt');

-- Add Romanian translations for all themes
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT 
    id as theme_id,
    'ro' as locale,
    CASE 
        WHEN name = 'ART' THEN 'Artă'
        WHEN name = 'FANS' THEN 'Fani'
        WHEN name = 'SPORTS' THEN 'Sport'
        WHEN name = 'FOOD & DRINKS' THEN 'Mâncare și Băuturi'
        WHEN name = 'MUSIC' THEN 'Muzică'
        WHEN name = 'HEALTH AND WELLNESS' THEN 'Sănătate și Wellness'
        WHEN name = 'EDUCATION' THEN 'Educație'
        WHEN name = 'SCIENCE AND KNOWLEDGE' THEN 'Știință și Cunoaștere'
        WHEN name = 'BUSINESS' THEN 'Afaceri'
        WHEN name = 'LANGUAGES' THEN 'Limbi'
        ELSE name
    END as name,
    description
FROM themes
WHERE id NOT IN (SELECT theme_id FROM theme_translations WHERE locale = 'ro');