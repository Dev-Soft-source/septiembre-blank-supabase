
-- Final comprehensive Spanish translations for ALL remaining English terms

-- Media & Digital category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Media & Digital' THEN 'Medios y Digital'
    WHEN 'Cinema & Film' THEN 'Cine y Películas'
    WHEN 'TV & Streaming Series' THEN 'TV y Series de Streaming'
    WHEN 'Live Entertainment' THEN 'Entretenimiento en Vivo'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Media & Digital', 'Cinema & Film', 'TV & Streaming Series', 'Live Entertainment'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Professional Development category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Professional Development' THEN 'Desarrollo Profesional'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN ('Professional Development')
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Education subcategory translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Academic Learning' THEN 'Aprendizaje Académico'
    WHEN 'Courses & Workshops' THEN 'Cursos y Talleres'
    WHEN 'University-Related Events' THEN 'Eventos Relacionados con Universidades'
    WHEN 'Educational Retreats' THEN 'Retiros Educativos'
    WHEN 'Conferences & Seminars' THEN 'Conferencias y Seminarios'
    WHEN 'Study Abroad / Exchange-Friendly' THEN 'Estudios en el Extranjero / Intercambio Amigable'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Academic Learning', 'Courses & Workshops', 'University-Related Events',
  'Educational Retreats', 'Conferences & Seminars', 'Study Abroad / Exchange-Friendly'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Music subcategory translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'World Music' THEN 'Música del Mundo'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN ('World Music')
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Sports subcategory translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Esports & Competitive Gaming' THEN 'Esports y Gaming Competitivo'
    WHEN 'Adventure Sports (zipline, canyoning, rafting, etc.)' THEN 'Deportes de Aventura (tirolesa, barranquismo, rafting, etc.)'
    WHEN 'Swimming' THEN 'Natación'
    WHEN 'Cycling' THEN 'Ciclismo'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Esports & Competitive Gaming', 'Adventure Sports (zipline, canyoning, rafting, etc.)',
  'Swimming', 'Cycling'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Additional category and subcategory translations that might be missing
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Innovation & Future' THEN 'Innovación y Futuro'
    WHEN 'Research & Exploration' THEN 'Investigación y Exploración'
    WHEN 'Personal Relationships' THEN 'Relaciones Personales'
    WHEN 'Couples Retreats' THEN 'Retiros para Parejas'
    WHEN 'Wildlife & Biology' THEN 'Vida Silvestre y Biología'
    WHEN 'Natural Environments' THEN 'Entornos Naturales'
    WHEN 'Spiritual Lifestyle' THEN 'Estilo de Vida Espiritual'
    WHEN 'LGBTQ+ Friendly' THEN 'LGBTQ+ Amigable'
    WHEN 'Pet-Friendly Living' THEN 'Vida Pet-Friendly'
    WHEN 'Wellness & Values' THEN 'Bienestar y Valores'
    WHEN 'Urban Exploration' THEN 'Exploración Urbana'
    WHEN 'Travel & Mobility' THEN 'Viajes y Movilidad'
    WHEN 'Digital Nomadism' THEN 'Nomadismo Digital'
    WHEN 'Slow Travel' THEN 'Viajes Lentos'
    WHEN 'Theater & Musicals' THEN 'Teatro y Musicales'
    WHEN 'Music Concerts' THEN 'Conciertos de Música'
    WHEN 'Stand-Up Comedy' THEN 'Comedia en Vivo'
    WHEN 'Film Festivals' THEN 'Festivales de Cine'
    WHEN 'Documentary Screenings' THEN 'Proyecciones de Documentales'
    WHEN 'Independent Cinema' THEN 'Cine Independiente'
    WHEN 'Classic Films' THEN 'Películas Clásicas'
    WHEN 'Foreign Films' THEN 'Películas Extranjeras'
    WHEN 'Animation & Cartoons' THEN 'Animación y Dibujos Animados'
    WHEN 'Science Fiction' THEN 'Ciencia Ficción'
    WHEN 'Horror & Thriller' THEN 'Terror y Suspense'
    WHEN 'Comedy Films' THEN 'Películas de Comedia'
    WHEN 'Drama & Romance' THEN 'Drama y Romance'
    WHEN 'Action & Adventure' THEN 'Acción y Aventura'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Innovation & Future', 'Research & Exploration', 'Personal Relationships', 
  'Couples Retreats', 'Wildlife & Biology', 'Natural Environments',
  'Spiritual Lifestyle', 'LGBTQ+ Friendly', 'Pet-Friendly Living',
  'Wellness & Values', 'Urban Exploration', 'Travel & Mobility',
  'Digital Nomadism', 'Slow Travel', 'Theater & Musicals',
  'Music Concerts', 'Stand-Up Comedy', 'Film Festivals',
  'Documentary Screenings', 'Independent Cinema', 'Classic Films',
  'Foreign Films', 'Animation & Cartoons', 'Science Fiction',
  'Horror & Thriller', 'Comedy Films', 'Drama & Romance',
  'Action & Adventure'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
