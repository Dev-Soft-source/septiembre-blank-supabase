
-- Additional comprehensive Spanish translations for all missing theme items
-- Let's add translations for items that are still appearing in English

-- HEALTH AND WELLNESS (SALUD Y BIENESTAR) - Level 2 and 3 items
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Fitness & Movement' THEN 'Fitness y Movimiento'
    WHEN 'Mindfulness & Wellness' THEN 'Atención Plena y Bienestar'
    WHEN 'Nutrition & Health' THEN 'Nutrición y Salud'
    WHEN 'Yoga' THEN 'Yoga'
    WHEN 'Meditación' THEN 'Meditación'
    WHEN 'Desintoxicación' THEN 'Desintoxicación'
    WHEN 'Gym & Fitness' THEN 'Gimnasio y Fitness'
    WHEN 'Yoga & Pilates' THEN 'Yoga y Pilates'
    WHEN 'Spa & Wellness' THEN 'Spa y Bienestar'
    WHEN 'Mental Health' THEN 'Salud Mental'
    WHEN 'Alternative Medicine' THEN 'Medicina Alternativa'
    WHEN 'Detox' THEN 'Desintoxicación'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'HEALTH_AND_WELLNESS' OR t.name IN (
  'Fitness & Movement', 'Mindfulness & Wellness', 'Nutrition & Health', 'Yoga', 
  'Meditación', 'Desintoxicación', 'Gym & Fitness', 'Yoga & Pilates', 
  'Spa & Wellness', 'Mental Health', 'Alternative Medicine', 'Detox'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- MUSIC category - Level 2 and 3 items
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Instrumental Performance' THEN 'Interpretación Instrumental'
    WHEN 'Music Appreciation & History' THEN 'Apreciación Musical e Historia'
    WHEN 'Classical Music (Mozart, Beethoven, Bach, etc.)' THEN 'Música Clásica (Mozart, Beethoven, Bach, etc.)'
    WHEN 'Jazz & Blues' THEN 'Jazz y Blues'
    WHEN 'Música del Mundo' THEN 'Música del Mundo'
    WHEN 'Latin Music' THEN 'Música Latina'
    WHEN 'Contemporary & Pop Music' THEN 'Música Contemporánea y Pop'
    WHEN 'Folk & Traditional Music' THEN 'Música Folk y Tradicional'
    WHEN 'Opera & Vocal Arts' THEN 'Ópera y Artes Vocales'
    WHEN 'Electronic Music' THEN 'Música Electrónica'
    WHEN 'Music Theory' THEN 'Teoría Musical'
    WHEN 'Music Composition' THEN 'Composición Musical'
    WHEN 'Music Technology' THEN 'Tecnología Musical'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'MUSIC' OR t.name IN (
  'Instrumental Performance', 'Music Appreciation & History', 
  'Classical Music (Mozart, Beethoven, Bach, etc.)', 'Jazz & Blues', 'Música del Mundo',
  'Latin Music', 'Contemporary & Pop Music', 'Folk & Traditional Music', 
  'Opera & Vocal Arts', 'Electronic Music', 'Music Theory', 'Music Composition', 'Music Technology'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- SPORTS category - Level 2 and 3 items that are still in English
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Martial Arts (karate, judo, taekwondo, etc.)' THEN 'Artes Marciales (karate, judo, taekwondo, etc.)'
    WHEN 'Team Sports (soccer, basketball, volleyball, etc.)' THEN 'Deportes de Equipo (fútbol, baloncesto, voleibol, etc.)'
    WHEN 'Tennis & Racket Sports (tenis, pádel, squash)' THEN 'Tenis y Deportes de Raqueta (tenis, pádel, squash)'
    WHEN 'Golf & Mini Golf' THEN 'Golf y Mini Golf'
    WHEN 'Winter Sports (ski, snowboard, ice skating)' THEN 'Deportes de Invierno (esquí, snowboard, patinaje sobre hielo)'
    WHEN 'Watersports' THEN 'Deportes Acuáticos'
    WHEN 'Natación' THEN 'Natación'
    WHEN 'Ciclismo' THEN 'Ciclismo'
    WHEN 'Running & Jogging' THEN 'Correr y Trotar'
    WHEN 'Climbing & Bouldering' THEN 'Escalada y Boulder'
    WHEN 'Horseback Riding' THEN 'Equitación'
    WHEN 'Skating & Skateboarding' THEN 'Patinaje y Skateboard'
    WHEN 'Deportes de Aventura' THEN 'Deportes de Aventura'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'SPORTS' OR t.name IN (
  'Martial Arts (karate, judo, taekwondo, etc.)', 'Team Sports (soccer, basketball, volleyball, etc.)',
  'Tennis & Racket Sports (tenis, pádel, squash)', 'Golf & Mini Golf', 
  'Winter Sports (ski, snowboard, ice skating)', 'Watersports', 'Natación', 'Ciclismo',
  'Running & Jogging', 'Climbing & Bouldering', 'Horseback Riding', 'Skating & Skateboarding',
  'Deportes de Aventura'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ART category - Level 2 and 3 items that are still in English
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Pintura' THEN 'Pintura'
    WHEN 'Escultura' THEN 'Escultura'
    WHEN 'Fotografía' THEN 'Fotografía'
    WHEN 'Cine y Arte Cinematográfico' THEN 'Cine y Arte Cinematográfico'
    WHEN 'Arte Callejero y Murales' THEN 'Arte Callejero y Murales'
    WHEN 'Ilustración y Cómics' THEN 'Ilustración y Cómics'
    WHEN 'Calligraphy & Typography' THEN 'Caligrafía y Tipografía'
    WHEN 'Architecture as Art' THEN 'Arquitectura como Arte'
    WHEN 'Performance Art' THEN 'Arte de Performance'
    WHEN 'Installation Art' THEN 'Arte de Instalación'
    WHEN 'Ceramics & Pottery' THEN 'Cerámica y Alfarería'
    WHEN 'Art History & Movements' THEN 'Historia del Arte y Movimientos'
    WHEN 'Digital Art & NFTs' THEN 'Arte Digital y NFTs'
    WHEN 'Textile Arts' THEN 'Artes Textiles'
    WHEN 'Printmaking' THEN 'Grabado'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'ART' OR t.name IN (
  'Pintura', 'Escultura', 'Fotografía', 'Cine y Arte Cinematográfico', 
  'Arte Callejero y Murales', 'Ilustración y Cómics', 'Calligraphy & Typography',
  'Architecture as Art', 'Performance Art', 'Installation Art', 'Ceramics & Pottery',
  'Art History & Movements', 'Digital Art & NFTs', 'Textile Arts', 'Printmaking'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- EDUCATION category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'EDUCATION' THEN 'EDUCACIÓN'
    WHEN 'Online Learning' THEN 'Aprendizaje en Línea'
    WHEN 'Professional Development' THEN 'Desarrollo Profesional'
    WHEN 'Academic Research' THEN 'Investigación Académica'
    WHEN 'Educational Technology' THEN 'Tecnología Educativa'
    WHEN 'Teaching & Training' THEN 'Enseñanza y Formación'
    WHEN 'Skills Development' THEN 'Desarrollo de Habilidades'
    WHEN 'Certification Programs' THEN 'Programas de Certificación'
    WHEN 'Higher Education' THEN 'Educación Superior'
    WHEN 'Vocational Training' THEN 'Formación Profesional'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'EDUCATION' OR t.name IN (
  'EDUCATION', 'Online Learning', 'Professional Development', 'Academic Research',
  'Educational Technology', 'Teaching & Training', 'Skills Development', 
  'Certification Programs', 'Higher Education', 'Vocational Training'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- BUSINESS category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Entrepreneurship' THEN 'Emprendimiento'
    WHEN 'Marketing & Sales' THEN 'Marketing y Ventas'
    WHEN 'Finance & Investment' THEN 'Finanzas e Inversión'
    WHEN 'Leadership & Management' THEN 'Liderazgo y Gestión'
    WHEN 'Networking' THEN 'Networking'
    WHEN 'Business Strategy' THEN 'Estrategia Empresarial'
    WHEN 'E-commerce' THEN 'Comercio Electrónico'
    WHEN 'Consulting' THEN 'Consultoría'
    WHEN 'Project Management' THEN 'Gestión de Proyectos'
    WHEN 'Innovation' THEN 'Innovación'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'BUSINESS' OR t.name IN (
  'Entrepreneurship', 'Marketing & Sales', 'Finance & Investment', 'Leadership & Management',
  'Networking', 'Business Strategy', 'E-commerce', 'Consulting', 'Project Management', 'Innovation'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- CULTURE category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Local Traditions' THEN 'Tradiciones Locales'
    WHEN 'Cultural Festivals' THEN 'Festivales Culturales'
    WHEN 'Heritage Sites' THEN 'Sitios Patrimoniales'
    WHEN 'Indigenous Cultures' THEN 'Culturas Indígenas'
    WHEN 'Religious Studies' THEN 'Estudios Religiosos'
    WHEN 'Anthropology' THEN 'Antropología'
    WHEN 'Cultural Exchange' THEN 'Intercambio Cultural'
    WHEN 'Folklore' THEN 'Folclore'
    WHEN 'Cultural History' THEN 'Historia Cultural'
    WHEN 'Cross-Cultural Studies' THEN 'Estudios Interculturales'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'CULTURE' OR t.name IN (
  'Local Traditions', 'Cultural Festivals', 'Heritage Sites', 'Indigenous Cultures',
  'Religious Studies', 'Anthropology', 'Cultural Exchange', 'Folklore', 
  'Cultural History', 'Cross-Cultural Studies'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ENTERTAINMENT category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Movies & Cinema' THEN 'Películas y Cine'
    WHEN 'Theater & Drama' THEN 'Teatro y Drama'
    WHEN 'Comedy & Humor' THEN 'Comedia y Humor'
    WHEN 'Gaming' THEN 'Videojuegos'
    WHEN 'Live Shows' THEN 'Espectáculos en Vivo'
    WHEN 'Concerts & Music Events' THEN 'Conciertos y Eventos Musicales'
    WHEN 'Festivals' THEN 'Festivales'
    WHEN 'Nightlife' THEN 'Vida Nocturna'
    WHEN 'Celebrity Culture' THEN 'Cultura de Celebridades'
    WHEN 'Reality TV' THEN 'Reality TV'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'ENTERTAINMENT' OR t.name IN (
  'Movies & Cinema', 'Theater & Drama', 'Comedy & Humor', 'Gaming', 'Live Shows',
  'Concerts & Music Events', 'Festivals', 'Nightlife', 'Celebrity Culture', 'Reality TV'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
