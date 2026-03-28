
-- Final Spanish translations for the last remaining English terms

-- New skills categories
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Social Skills' THEN 'Habilidades Sociales'
    WHEN 'Communication Skills' THEN 'Habilidades de Comunicación'
    WHEN 'Mental Skills' THEN 'Habilidades Mentales'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN ('Social Skills', 'Communication Skills', 'Mental Skills')
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Education programs
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'University Programs' THEN 'Programas Universitarios'
    WHEN 'Study Abroad Programs' THEN 'Programas de Estudios en el Extranjero'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN ('University Programs', 'Study Abroad Programs')
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Main categories that might still be in English
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'LANGUAGES' THEN 'IDIOMAS'
    WHEN 'SPORTS' THEN 'DEPORTES'
    WHEN 'ART' THEN 'ARTE'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN ('LANGUAGES', 'SPORTS', 'ART')
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Art subcategories
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Cinema & Film Art' THEN 'Arte Cinematográfico'
    WHEN 'Street Art & Murals' THEN 'Arte Callejero y Murales'
    WHEN 'Illustration & Comics' THEN 'Ilustración y Cómics'
    WHEN 'Painting' THEN 'Pintura'
    WHEN 'Sculpture' THEN 'Escultura'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Cinema & Film Art', 'Street Art & Murals', 'Illustration & Comics',
  'Painting', 'Sculpture'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
