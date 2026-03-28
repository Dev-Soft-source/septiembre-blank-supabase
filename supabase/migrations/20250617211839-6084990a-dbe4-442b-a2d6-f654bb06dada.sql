
-- Complete Spanish translations for all missing theme items
-- First, let's add translations for COMIDA Y BEBIDA (FOOD & DRINKS) category items
INSERT INTO theme_translations (theme_id, locale, name, description) 
SELECT t.id, 'es', 
  CASE t.name
    WHEN 'World Cuisines' THEN 'Cocinas del Mundo'
    WHEN 'Cooking Classes' THEN 'Clases de Cocina'
    WHEN 'Beverages & Tasting' THEN 'Bebidas y Cata'
    WHEN 'Experiencias Gourmet' THEN 'Experiencias Gourmet'
    WHEN 'Spanish Cuisine' THEN 'Cocina Española'
    WHEN 'French Cuisine' THEN 'Cocina Francesa'
    WHEN 'Italian Cuisine' THEN 'Cocina Italiana'
    WHEN 'Wine Tasting' THEN 'Cata de Vinos'
    WHEN 'Beer Tasting' THEN 'Cata de Cervezas'
    WHEN 'Cocktail Making' THEN 'Preparación de Cócteles'
    WHEN 'Local Specialties' THEN 'Especialidades Locales'
    WHEN 'Vegetarian Cuisine' THEN 'Cocina Vegetariana'
    WHEN 'Vegan Cuisine' THEN 'Cocina Vegana'
    WHEN 'Street Food' THEN 'Comida Callejera'
    WHEN 'Fine Dining' THEN 'Alta Gastronomía'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'FOOD_AND_DRINKS' OR t.name IN (
  'World Cuisines', 'Cooking Classes', 'Beverages & Tasting', 'Experiencias Gourmet',
  'Spanish Cuisine', 'French Cuisine', 'Italian Cuisine', 'Wine Tasting', 'Beer Tasting',
  'Cocktail Making', 'Local Specialties', 'Vegetarian Cuisine', 'Vegan Cuisine',
  'Street Food', 'Fine Dining'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- DEPORTE (SPORTS) category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Martial Arts' THEN 'Artes Marciales'
    WHEN 'Team Sports' THEN 'Deportes de Equipo'
    WHEN 'Tennis & Racket Sports' THEN 'Tenis y Deportes de Raqueta'
    WHEN 'Winter Sports' THEN 'Deportes de Invierno'
    WHEN 'Adventure Sports' THEN 'Deportes de Aventura'
    WHEN 'Deportes Acuáticos' THEN 'Deportes Acuáticos'
    WHEN 'Water Sports' THEN 'Deportes Acuáticos'
    WHEN 'Swimming' THEN 'Natación'
    WHEN 'Cycling' THEN 'Ciclismo'
    WHEN 'Running' THEN 'Correr y trotar'
    WHEN 'Hiking' THEN 'Senderismo'
    WHEN 'Rock Climbing' THEN 'Escalada'
    WHEN 'Surfing' THEN 'Surf'
    WHEN 'Skiing' THEN 'Esquí'
    WHEN 'Snowboarding' THEN 'Snowboard'
    WHEN 'Golf' THEN 'Golf'
    WHEN 'Football' THEN 'Fútbol'
    WHEN 'Basketball' THEN 'Baloncesto'
    WHEN 'Volleyball' THEN 'Voleibol'
    WHEN 'Boxing' THEN 'Boxeo'
    WHEN 'Karate' THEN 'Karate'
    WHEN 'Judo' THEN 'Judo'
    WHEN 'Yoga' THEN 'Yoga'
    WHEN 'Pilates' THEN 'Pilates'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'SPORTS' OR t.name IN (
  'Martial Arts', 'Team Sports', 'Tennis & Racket Sports', 'Winter Sports', 
  'Adventure Sports', 'Water Sports', 'Swimming', 'Cycling', 'Running',
  'Hiking', 'Rock Climbing', 'Surfing', 'Skiing', 'Snowboarding', 'Golf',
  'Football', 'Basketball', 'Volleyball', 'Boxing', 'Karate', 'Judo', 'Yoga', 'Pilates'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- AFICIONADOS (HOBBIES/INTERESTS) category translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Musical Icons' THEN 'Iconos Musicales'
    WHEN 'Movie Legends' THEN 'Leyendas del Cine'
    WHEN 'Marilyn Monroe' THEN 'Marilyn Monroe'
    WHEN 'James Dean' THEN 'James Dean'
    WHEN 'Audrey Hepburn' THEN 'Audrey Hepburn'
    WHEN 'Writers & Thinkers' THEN 'Escritores y Pensadores'
    WHEN 'Shakespeare' THEN 'Shakespeare'
    WHEN 'Cervantes' THEN 'Cervantes'
    WHEN 'Tolkien' THEN 'Tolkien'
    WHEN 'Jane Austen' THEN 'Jane Austen'
    WHEN 'Artists' THEN 'Artistas'
    WHEN 'Spiritual or Historic Figures' THEN 'Figuras Espirituales o Históricas'
    WHEN 'Photography' THEN 'Fotografía'
    WHEN 'Painting' THEN 'Pintura'
    WHEN 'Music' THEN 'Música'
    WHEN 'Reading' THEN 'Lectura'
    WHEN 'Writing' THEN 'Escritura'
    WHEN 'Collecting' THEN 'Coleccionismo'
    WHEN 'Gardening' THEN 'Jardinería'
    WHEN 'Crafts' THEN 'Manualidades'
    WHEN 'Board Games' THEN 'Juegos de Mesa'
    WHEN 'Video Games' THEN 'Videojuegos'
    WHEN 'Astronomy' THEN 'Astronomía'
    WHEN 'Birdwatching' THEN 'Observación de Aves'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'HOBBIES' OR t.name IN (
  'Musical Icons', 'Movie Legends', 'Marilyn Monroe', 'James Dean', 'Audrey Hepburn',
  'Writers & Thinkers', 'Shakespeare', 'Cervantes', 'Tolkien', 'Jane Austen',
  'Artists', 'Spiritual or Historic Figures', 'Photography', 'Painting', 'Music',
  'Reading', 'Writing', 'Collecting', 'Gardening', 'Crafts', 'Board Games',
  'Video Games', 'Astronomy', 'Birdwatching'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- SCIENCE AND TECHNOLOGY translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Artificial Intelligence' THEN 'Inteligencia Artificial'
    WHEN 'Robotics' THEN 'Robótica'
    WHEN 'Space Exploration' THEN 'Exploración Espacial'
    WHEN 'Biotechnology' THEN 'Biotecnología'
    WHEN 'Renewable Energy' THEN 'Energías Renovables'
    WHEN 'Digital Innovation' THEN 'Innovación Digital'
    WHEN 'Virtual Reality' THEN 'Realidad Virtual'
    WHEN 'Blockchain' THEN 'Blockchain'
    WHEN 'Quantum Computing' THEN 'Computación Cuántica'
    WHEN 'Nanotechnology' THEN 'Nanotecnología'
    WHEN 'Medical Technology' THEN 'Tecnología Médica'
    WHEN 'Environmental Science' THEN 'Ciencias Ambientales'
    WHEN 'Physics' THEN 'Física'
    WHEN 'Chemistry' THEN 'Química'
    WHEN 'Biology' THEN 'Biología'
    WHEN 'Mathematics' THEN 'Matemáticas'
    WHEN 'Computer Science' THEN 'Informática'
    WHEN 'Engineering' THEN 'Ingeniería'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'SCIENCE_AND_TECHNOLOGY' OR t.name IN (
  'Artificial Intelligence', 'Robotics', 'Space Exploration', 'Biotechnology',
  'Renewable Energy', 'Digital Innovation', 'Virtual Reality', 'Blockchain',
  'Quantum Computing', 'Nanotechnology', 'Medical Technology', 'Environmental Science',
  'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Engineering'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- LIFESTYLE translations
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Wellness & Spa' THEN 'Bienestar y Spa'
    WHEN 'Fashion & Style' THEN 'Moda y Estilo'
    WHEN 'Interior Design' THEN 'Diseño de Interiores'
    WHEN 'Minimalism' THEN 'Minimalismo'
    WHEN 'Sustainable Living' THEN 'Vida Sostenible'
    WHEN 'Digital Nomad' THEN 'Nómada Digital'
    WHEN 'Luxury Travel' THEN 'Viajes de Lujo'
    WHEN 'Budget Travel' THEN 'Viajes Económicos'
    WHEN 'Solo Travel' THEN 'Viajes en Solitario'
    WHEN 'Family Travel' THEN 'Viajes en Familia'
    WHEN 'Adventure Travel' THEN 'Viajes de Aventura'
    WHEN 'Cultural Travel' THEN 'Viajes Culturales'
    WHEN 'Meditation' THEN 'Meditación'
    WHEN 'Mindfulness' THEN 'Atención Plena'
    WHEN 'Fitness' THEN 'Fitness'
    WHEN 'Nutrition' THEN 'Nutrición'
    WHEN 'Healthy Cooking' THEN 'Cocina Saludable'
    WHEN 'Organic Living' THEN 'Vida Orgánica'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'LIFESTYLE' OR t.name IN (
  'Wellness & Spa', 'Fashion & Style', 'Interior Design', 'Minimalism',
  'Sustainable Living', 'Digital Nomad', 'Luxury Travel', 'Budget Travel',
  'Solo Travel', 'Family Travel', 'Adventure Travel', 'Cultural Travel',
  'Meditation', 'Mindfulness', 'Fitness', 'Nutrition', 'Healthy Cooking', 'Organic Living'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ART category translations (fixing the ones you mentioned)
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Painting' THEN 'Pintura'
    WHEN 'Sculpture' THEN 'Escultura'
    WHEN 'Photography' THEN 'Fotografía'
    WHEN 'Cinema & Film Art' THEN 'Cine y Arte Cinematográfico'
    WHEN 'Street Art & Murals' THEN 'Arte Callejero y Murales'
    WHEN 'Illustration & Comics' THEN 'Ilustración y Cómics'
    WHEN 'Digital Art' THEN 'Arte Digital'
    WHEN 'Traditional Crafts' THEN 'Artesanías Tradicionales'
    WHEN 'Contemporary Art' THEN 'Arte Contemporáneo'
    WHEN 'Classical Art' THEN 'Arte Clásico'
    WHEN 'Abstract Art' THEN 'Arte Abstracto'
    WHEN 'Architecture' THEN 'Arquitectura'
    WHEN 'Design' THEN 'Diseño'
    WHEN 'Pottery & Ceramics' THEN 'Alfarería y Cerámica'
    WHEN 'Textile Arts' THEN 'Artes Textiles'
    WHEN 'Jewelry Making' THEN 'Joyería'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'ART' OR t.name IN (
  'Painting', 'Sculpture', 'Photography', 'Cinema & Film Art', 'Street Art & Murals',
  'Illustration & Comics', 'Digital Art', 'Traditional Crafts', 'Contemporary Art',
  'Classical Art', 'Abstract Art', 'Architecture', 'Design', 'Pottery & Ceramics',
  'Textile Arts', 'Jewelry Making'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Additional categories that might need translation
-- MUSIC category
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Classical Music' THEN 'Música Clásica'
    WHEN 'Jazz' THEN 'Jazz'
    WHEN 'Rock' THEN 'Rock'
    WHEN 'Pop' THEN 'Pop'
    WHEN 'Electronic Music' THEN 'Música Electrónica'
    WHEN 'Folk Music' THEN 'Música Folclórica'
    WHEN 'World Music' THEN 'Música del Mundo'
    WHEN 'Opera' THEN 'Ópera'
    WHEN 'Blues' THEN 'Blues'
    WHEN 'Country' THEN 'Country'
    WHEN 'Hip Hop' THEN 'Hip Hop'
    WHEN 'Reggae' THEN 'Reggae'
    WHEN 'Flamenco' THEN 'Flamenco'
    WHEN 'Music Production' THEN 'Producción Musical'
    WHEN 'Live Concerts' THEN 'Conciertos en Vivo'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'MUSIC' OR t.name IN (
  'Classical Music', 'Jazz', 'Rock', 'Pop', 'Electronic Music', 'Folk Music',
  'World Music', 'Opera', 'Blues', 'Country', 'Hip Hop', 'Reggae', 'Flamenco',
  'Music Production', 'Live Concerts'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- LANGUAGES category
INSERT INTO theme_translations (theme_id, locale, name, description)
SELECT t.id, 'es',
  CASE t.name
    WHEN 'Spanish Learning' THEN 'Aprendizaje de Español'
    WHEN 'English Learning' THEN 'Aprendizaje de Inglés'
    WHEN 'French Learning' THEN 'Aprendizaje de Francés'
    WHEN 'German Learning' THEN 'Aprendizaje de Alemán'
    WHEN 'Italian Learning' THEN 'Aprendizaje de Italiano'
    WHEN 'Portuguese Learning' THEN 'Aprendizaje de Portugués'
    WHEN 'Chinese Learning' THEN 'Aprendizaje de Chino'
    WHEN 'Japanese Learning' THEN 'Aprendizaje de Japonés'
    WHEN 'Language Exchange' THEN 'Intercambio de Idiomas'
    WHEN 'Translation' THEN 'Traducción'
    WHEN 'Linguistics' THEN 'Lingüística'
    ELSE t.name
  END,
  t.description
FROM themes t
WHERE t.category = 'LANGUAGES' OR t.name IN (
  'Spanish Learning', 'English Learning', 'French Learning', 'German Learning',
  'Italian Learning', 'Portuguese Learning', 'Chinese Learning', 'Japanese Learning',
  'Language Exchange', 'Translation', 'Linguistics'
)
ON CONFLICT (theme_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
