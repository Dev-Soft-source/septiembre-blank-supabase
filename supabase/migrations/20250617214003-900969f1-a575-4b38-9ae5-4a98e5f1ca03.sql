
-- Comprehensive Spanish translations for ALL remaining English terms found in the images

-- Music category items that need translation
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Instrumental Performance' THEN 'Interpretación Instrumental'
    WHEN 'Music Appreciation & History' THEN 'Apreciación Musical e Historia'
    WHEN 'Classical Music (Mozart, Beethoven, Bach, etc.)' THEN 'Música Clásica (Mozart, Beethoven, Bach, etc.)'
    WHEN 'Jazz & Blues' THEN 'Jazz y Blues'
    WHEN 'Latin Music' THEN 'Música Latina'
    WHEN 'Contemporary & Pop Music' THEN 'Música Contemporánea y Pop'
    WHEN 'Folk & Traditional Music' THEN 'Música Folk y Tradicional'
    WHEN 'Opera & Vocal Arts' THEN 'Ópera y Artes Vocales'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Instrumental Performance', 'Music Appreciation & History', 
  'Classical Music (Mozart, Beethoven, Bach, etc.)', 'Jazz & Blues', 'Latin Music',
  'Contemporary & Pop Music', 'Folk & Traditional Music', 'Opera & Vocal Arts'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Sports category items that need translation  
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Martial Arts (karate, judo, taekwondo, etc.)' THEN 'Artes Marciales (karate, judo, taekwondo, etc.)'
    WHEN 'Team Sports (soccer, basketball, volleyball, etc.)' THEN 'Deportes de Equipo (fútbol, baloncesto, voleibol, etc.)'
    WHEN 'Tennis & Racket Sports (tenis, pádel, squash)' THEN 'Tenis y Deportes de Raqueta (tenis, pádel, squash)'
    WHEN 'Golf & Mini Golf' THEN 'Golf y Mini Golf'
    WHEN 'Winter Sports (ski, snowboard, ice skating)' THEN 'Deportes de Invierno (esquí, snowboard, patinaje sobre hielo)'
    WHEN 'Gym & Fitness' THEN 'Gimnasio y Fitness'
    WHEN 'Yoga & Pilates' THEN 'Yoga y Pilates'
    WHEN 'Horseback Riding' THEN 'Equitación'
    WHEN 'Skating & Skateboarding' THEN 'Patinaje y Skateboard'
    WHEN 'Watersports' THEN 'Deportes Acuáticos'
    WHEN 'Running & Jogging' THEN 'Correr y Trotar'
    WHEN 'Climbing & Bouldering' THEN 'Escalada y Boulder'
    WHEN 'Martial Arts' THEN 'Artes Marciales'
    WHEN 'Team Sports' THEN 'Deportes de Equipo'
    WHEN 'Tennis & Racket Sports' THEN 'Tenis y Deportes de Raqueta'
    WHEN 'Winter Sports' THEN 'Deportes de Invierno'
    WHEN 'Adventure Sports' THEN 'Deportes de Aventura'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Martial Arts (karate, judo, taekwondo, etc.)', 'Team Sports (soccer, basketball, volleyball, etc.)',
  'Tennis & Racket Sports (tenis, pádel, squash)', 'Golf & Mini Golf', 
  'Winter Sports (ski, snowboard, ice skating)', 'Gym & Fitness', 'Yoga & Pilates',
  'Horseback Riding', 'Skating & Skateboarding', 'Watersports', 'Running & Jogging',
  'Climbing & Bouldering', 'Martial Arts', 'Team Sports', 'Tennis & Racket Sports',
  'Winter Sports', 'Adventure Sports'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Art category items that need translation
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Calligraphy & Typography' THEN 'Caligrafía y Tipografía'
    WHEN 'Architecture as Art' THEN 'Arquitectura como Arte'
    WHEN 'Performance Art' THEN 'Arte de Performance'
    WHEN 'Installation Art' THEN 'Arte de Instalación'
    WHEN 'Ceramics & Pottery' THEN 'Cerámica y Alfarería'
    WHEN 'Art History & Movements' THEN 'Historia del Arte y Movimientos'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Calligraphy & Typography', 'Architecture as Art', 'Performance Art', 
  'Installation Art', 'Ceramics & Pottery', 'Art History & Movements'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Food & Drinks category items that need translation
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'World Cuisines' THEN 'Cocinas del Mundo'
    WHEN 'Cooking Classes' THEN 'Clases de Cocina'
    WHEN 'Beverages & Tasting' THEN 'Bebidas y Cata'
    WHEN 'Cocinas del Mundo (Española, Francesa, Italiana)' THEN 'Cocinas del Mundo (Española, Francesa, Italiana)'
    WHEN 'Clases de Cocina (Española, Italiana, Francesa, Japonesa, etc.)' THEN 'Clases de Cocina (Española, Italiana, Francesa, Japonesa, etc.)'
    WHEN 'Cata de vinos' THEN 'Cata de Vinos'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'World Cuisines', 'Cooking Classes', 'Beverages & Tasting',
  'Cocinas del Mundo (Española, Francesa, Italiana)',
  'Clases de Cocina (Española, Italiana, Francesa, Japonesa, etc.)',
  'Cata de vinos'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Hobbies/People category items that need translation
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Writers & Thinkers' THEN 'Escritores y Pensadores'
    WHEN 'Shakespeare' THEN 'Shakespeare'
    WHEN 'Cervantes' THEN 'Cervantes'
    WHEN 'Tolkien' THEN 'Tolkien'
    WHEN 'Jane Austen' THEN 'Jane Austen'
    WHEN 'Audrey Hepburn' THEN 'Audrey Hepburn'
    WHEN 'Artists' THEN 'Artistas'
    WHEN 'Spiritual or Historic Figures' THEN 'Figuras Espirituales o Históricas'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Writers & Thinkers', 'Shakespeare', 'Cervantes', 'Tolkien', 'Jane Austen',
  'Audrey Hepburn', 'Artists', 'Spiritual or Historic Figures'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Main category translations that might be missing
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'EDUCATION' THEN 'EDUCACIÓN'
    WHEN 'SALUD Y BIENESTAR' THEN 'SALUD Y BIENESTAR'
    WHEN 'SCIENCE AND KNOWLEDGE' THEN 'CIENCIA Y CONOCIMIENTO'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN ('EDUCATION', 'SALUD Y BIENESTAR', 'SCIENCE AND KNOWLEDGE')
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
