
-- Additional Spanish translations for business and professional development categories

-- Business and Finance categories
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Investing & Finance' THEN 'Inversión y Finanzas'
    WHEN 'Financial Planning' THEN 'Planificación Financiera'
    WHEN 'Startups' THEN 'Startups'
    WHEN 'Business Innovation' THEN 'Innovación Empresarial'
    WHEN 'Remote Work' THEN 'Trabajo Remoto'
    WHEN 'Leadership & Strategy' THEN 'Liderazgo y Estrategia'
    WHEN 'Business Training' THEN 'Formación Empresarial'
    WHEN 'Marketing & Branding' THEN 'Marketing y Branding'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Investing & Finance', 'Financial Planning', 'Startups', 'Business Innovation',
  'Remote Work', 'Leadership & Strategy', 'Business Training', 'Marketing & Branding'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Make sure MUSIC category is also translated if it exists in uppercase
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'MUSIC' THEN 'MÚSICA'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name = 'MUSIC'
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
