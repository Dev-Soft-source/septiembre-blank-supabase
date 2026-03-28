
-- Comprehensive Spanish translations for ALL remaining English terms
-- Categories that are still in English
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'HOBBIES' THEN 'AFICIONES'
    WHEN 'NATURE' THEN 'NATURALEZA'
    WHEN 'ENTERTAINMENT' THEN 'ENTRETENIMIENTO'
    WHEN 'LIFESTYLE' THEN 'ESTILO DE VIDA'
    WHEN 'PERSONAL DEVELOPMENT' THEN 'DESARROLLO PERSONAL'
    WHEN 'RELATIONSHIPS' THEN 'RELACIONES'
    WHEN 'SCIENCE AND TECHNOLOGY' THEN 'CIENCIA Y TECNOLOGÍA'
    WHEN 'BUSINESS' THEN 'NEGOCIOS'
    WHEN 'EDUCATION' THEN 'EDUCACIÓN'
    WHEN 'CULTURE' THEN 'CULTURA'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'HOBBIES', 'NATURE', 'ENTERTAINMENT', 'LIFESTYLE', 'PERSONAL DEVELOPMENT', 
  'RELATIONSHIPS', 'SCIENCE AND TECHNOLOGY', 'BUSINESS', 'EDUCATION', 'CULTURE'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Nature & Outdoor subcategories and items
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Nature & Outdoor' THEN 'Naturaleza y Aire Libre'
    WHEN 'Gardening & Horticulture' THEN 'Jardinería y Horticultura'
    WHEN 'Birdwatching & Nature' THEN 'Observación de Aves y Naturaleza'
    WHEN 'Pet Care & Training' THEN 'Cuidado y Entrenamiento de Mascotas'
    WHEN 'Fishing & Angling' THEN 'Pesca'
    WHEN 'Stargazing & Astronomy' THEN 'Observación de Estrellas y Astronomía'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Nature & Outdoor', 'Gardening & Horticulture', 'Birdwatching & Nature', 
  'Pet Care & Training', 'Fishing & Angling', 'Stargazing & Astronomy'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Arts & Crafts subcategories and items
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Arts & Crafts' THEN 'Artes y Manualidades'
    WHEN 'Knitting & Sewing' THEN 'Tejido y Costura'
    WHEN 'Model Building' THEN 'Construcción de Modelos'
    WHEN 'DIY & Bricolage' THEN 'Bricolaje y Manualidades'
    WHEN 'Restoration & Repair' THEN 'Restauración y Reparación'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Arts & Crafts', 'Knitting & Sewing', 'Model Building', 'DIY & Bricolage', 'Restoration & Repair'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Collecting & Games subcategories and items
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Collecting & Games' THEN 'Coleccionismo y Juegos'
    WHEN 'Antiques & Collectibles' THEN 'Antigüedades y Coleccionables'
    WHEN 'Board Games & Strategy' THEN 'Juegos de Mesa y Estrategia'
    WHEN 'Social Dancing' THEN 'Baile Social'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Collecting & Games', 'Antiques & Collectibles', 'Board Games & Strategy', 'Social Dancing'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Language subcategories and items
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Conversation Practice Spaces' THEN 'Espacios de Práctica de Conversación'
    WHEN 'Language Exchange Meetups' THEN 'Encuentros de Intercambio de Idiomas'
    WHEN 'Language Teaching' THEN 'Enseñanza de Idiomas'
    WHEN 'English Teaching' THEN 'Enseñanza de Inglés'
    WHEN 'Spanish Teaching' THEN 'Enseñanza de Español'
    WHEN 'Chinese Teaching' THEN 'Enseñanza de Chino'
    WHEN 'Russian Teaching' THEN 'Enseñanza de Ruso'
    WHEN 'English Exchange' THEN 'Intercambio de Inglés'
    WHEN 'Spanish Exchange' THEN 'Intercambio de Español'
    WHEN 'Chinese Exchange' THEN 'Intercambio de Chino'
    WHEN 'Russian Exchange' THEN 'Intercambio de Ruso'
    WHEN 'English Conversation' THEN 'Conversación en Inglés'
    WHEN 'Spanish Conversation' THEN 'Conversación en Español'
    WHEN 'Chinese Conversation' THEN 'Conversación en Chino'
    WHEN 'Russian Conversation' THEN 'Conversación en Ruso'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Conversation Practice Spaces', 'Language Exchange Meetups', 'Language Teaching',
  'English Teaching', 'Spanish Teaching', 'Chinese Teaching', 'Russian Teaching',
  'English Exchange', 'Spanish Exchange', 'Chinese Exchange', 'Russian Exchange',
  'English Conversation', 'Spanish Conversation', 'Chinese Conversation', 'Russian Conversation'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Additional missing translations that might be in the database
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Dance' THEN 'Danza'
    WHEN 'DANCE' THEN 'DANZA'
    WHEN 'Music Production' THEN 'Producción Musical'
    WHEN 'Live Music' THEN 'Música en Vivo'
    WHEN 'Concerts' THEN 'Conciertos'
    WHEN 'Festivals' THEN 'Festivales'
    WHEN 'Theater' THEN 'Teatro'
    WHEN 'Cinema' THEN 'Cine'
    WHEN 'Movies' THEN 'Películas'
    WHEN 'Gaming' THEN 'Videojuegos'
    WHEN 'Video Games' THEN 'Videojuegos'
    WHEN 'Board Games' THEN 'Juegos de Mesa'
    WHEN 'Card Games' THEN 'Juegos de Cartas'
    WHEN 'Outdoor Activities' THEN 'Actividades al Aire Libre'
    WHEN 'Indoor Activities' THEN 'Actividades de Interior'
    WHEN 'Social Activities' THEN 'Actividades Sociales'
    WHEN 'Creative Writing' THEN 'Escritura Creativa'
    WHEN 'Poetry' THEN 'Poesía'
    WHEN 'Literature' THEN 'Literatura'
    WHEN 'Reading' THEN 'Lectura'
    WHEN 'Book Clubs' THEN 'Clubes de Lectura'
    WHEN 'Philosophy' THEN 'Filosofía'
    WHEN 'History' THEN 'Historia'
    WHEN 'Politics' THEN 'Política'
    WHEN 'Current Events' THEN 'Actualidad'
    WHEN 'News & Media' THEN 'Noticias y Medios'
    WHEN 'Social Media' THEN 'Redes Sociales'
    WHEN 'Photography' THEN 'Fotografía'
    WHEN 'Videography' THEN 'Videografía'
    WHEN 'Film Making' THEN 'Producción Audiovisual'
    WHEN 'Documentary' THEN 'Documental'
    WHEN 'Animation' THEN 'Animación'
    WHEN 'Graphics Design' THEN 'Diseño Gráfico'
    WHEN 'Web Design' THEN 'Diseño Web'
    WHEN 'UI/UX Design' THEN 'Diseño UI/UX'
    WHEN 'Product Design' THEN 'Diseño de Producto'
    WHEN 'Fashion Design' THEN 'Diseño de Moda'
    WHEN 'Interior Design' THEN 'Diseño de Interiores'
    WHEN 'Architecture' THEN 'Arquitectura'
    WHEN 'Urban Planning' THEN 'Urbanismo'
    WHEN 'Landscape Design' THEN 'Diseño de Paisajes'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.name IN (
  'Dance', 'DANCE', 'Music Production', 'Live Music', 'Concerts', 'Festivals',
  'Theater', 'Cinema', 'Movies', 'Gaming', 'Video Games', 'Board Games', 'Card Games',
  'Outdoor Activities', 'Indoor Activities', 'Social Activities', 'Creative Writing',
  'Poetry', 'Literature', 'Reading', 'Book Clubs', 'Philosophy', 'History',
  'Politics', 'Current Events', 'News & Media', 'Social Media', 'Photography',
  'Videography', 'Film Making', 'Documentary', 'Animation', 'Graphics Design',
  'Web Design', 'UI/UX Design', 'Product Design', 'Fashion Design', 'Interior Design',
  'Architecture', 'Urban Planning', 'Landscape Design'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
