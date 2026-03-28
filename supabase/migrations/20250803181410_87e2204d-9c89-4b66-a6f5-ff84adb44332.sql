-- Replace entire affinities (themes) dataset with new definitive list
-- First, safely remove old associations to prevent foreign key violations
DELETE FROM hotel_themes WHERE theme_id NOT IN (
  SELECT ht.theme_id 
  FROM hotel_themes ht 
  JOIN themes t ON ht.theme_id = t.id 
  WHERE t.name IN (
    'Academic Learning', 'Antiques & Collectibles', 'Architecture & Design', 
    'Art History & Movements', 'Artificial Intelligence', 'Artists & Creativity',
    'Astronomy', 'Beaches & Coastlines', 'Beer & Brewing Culture', 
    'Beverages & Tastings', 'Biology', 'Board Games & Strategy',
    'Botanical Interest', 'Business Innovation', 'Ceramics & Pottery',
    'Chemistry', 'Chinese Culture & Language', 'Cinema & Film Appreciation',
    'Classical Music', 'Collecting & Games', 'Conferences & Seminars',
    'Confidence Building', 'Contemporary & Pop Music', 'Courses & Workshops',
    'Desserts & Sweets Culture', 'Digital Nomadism', 'Engineering & Technology',
    'English Language & Culture', 'Finance & Investment', 'Folk & Traditional Music',
    'Forests & Greenery', 'French Cuisine & Gastronomy', 'Friendship & Socializing',
    'Gardening & Horticulture', 'Gourmet Experiences', 'Holistic Therapies',
    'Illustration & Comics', 'Innovation & Future Trends', 'Italian Cuisine & Pasta Culture',
    'Jazz & Blues', 'Language Exchange', 'Latin Music',
    'Leadership & Strategy', 'Live Entertainment', 'Marine Life & Oceans',
    'Marketing & Branding', 'Mathematics', 'Media & Digital Culture',
    'Meditation & Mindfulness', 'Mediterranean Cuisine', 'Mental Skills Development',
    'Mountains & Scenic Views', 'Musical Icons', 'Music Appreciation & History',
    'Natural Environments', 'Nutrition & Wellness', 'Opera & Vocal Arts',
    'Painting & Fine Arts', 'Performance Art', 'Personal Development & Growth',
    'Philosophy', 'Photography', 'Psychology & Human Behavior', 'Public Speaking'
  )
);

DELETE FROM user_affinities WHERE theme_id NOT IN (
  SELECT ua.theme_id 
  FROM user_affinities ua 
  JOIN themes t ON ua.theme_id = t.id 
  WHERE t.name IN (
    'Academic Learning', 'Antiques & Collectibles', 'Architecture & Design', 
    'Art History & Movements', 'Artificial Intelligence', 'Artists & Creativity',
    'Astronomy', 'Beaches & Coastlines', 'Beer & Brewing Culture', 
    'Beverages & Tastings', 'Biology', 'Board Games & Strategy',
    'Botanical Interest', 'Business Innovation', 'Ceramics & Pottery',
    'Chemistry', 'Chinese Culture & Language', 'Cinema & Film Appreciation',
    'Classical Music', 'Collecting & Games', 'Conferences & Seminars',
    'Confidence Building', 'Contemporary & Pop Music', 'Courses & Workshops',
    'Desserts & Sweets Culture', 'Digital Nomadism', 'Engineering & Technology',
    'English Language & Culture', 'Finance & Investment', 'Folk & Traditional Music',
    'Forests & Greenery', 'French Cuisine & Gastronomy', 'Friendship & Socializing',
    'Gardening & Horticulture', 'Gourmet Experiences', 'Holistic Therapies',
    'Illustration & Comics', 'Innovation & Future Trends', 'Italian Cuisine & Pasta Culture',
    'Jazz & Blues', 'Language Exchange', 'Latin Music',
    'Leadership & Strategy', 'Live Entertainment', 'Marine Life & Oceans',
    'Marketing & Branding', 'Mathematics', 'Media & Digital Culture',
    'Meditation & Mindfulness', 'Mediterranean Cuisine', 'Mental Skills Development',
    'Mountains & Scenic Views', 'Musical Icons', 'Music Appreciation & History',
    'Natural Environments', 'Nutrition & Wellness', 'Opera & Vocal Arts',
    'Painting & Fine Arts', 'Performance Art', 'Personal Development & Growth',
    'Philosophy', 'Photography', 'Psychology & Human Behavior', 'Public Speaking'
  )
);

-- Clear all existing themes
DELETE FROM themes;

-- Insert new definitive affinities list with proper sorting
INSERT INTO themes (id, name, description, category, level, sort_order, created_at) VALUES
(gen_random_uuid(), 'Academic Learning', 'Learning and educational experiences', 'EDUCATION', 1, 1, now()),
(gen_random_uuid(), 'Antiques & Collectibles', 'Historical items and collecting', 'HOBBIES', 1, 2, now()),
(gen_random_uuid(), 'Architecture & Design', 'Buildings and structural design', 'ART', 1, 3, now()),
(gen_random_uuid(), 'Art History & Movements', 'Artistic periods and movements', 'ART', 1, 4, now()),
(gen_random_uuid(), 'Artificial Intelligence', 'AI and machine learning', 'SCIENCE AND TECHNOLOGY', 1, 5, now()),
(gen_random_uuid(), 'Artists & Creativity', 'Creative expression and artists', 'ART', 1, 6, now()),
(gen_random_uuid(), 'Astronomy', 'Stars, planets and space', 'SCIENCE AND KNOWLEDGE', 1, 7, now()),
(gen_random_uuid(), 'Beaches & Coastlines', 'Coastal environments and beaches', 'NATURE', 1, 8, now()),
(gen_random_uuid(), 'Beer & Brewing Culture', 'Beer culture and brewing', 'FOOD & DRINKS', 1, 9, now()),
(gen_random_uuid(), 'Beverages & Tastings', 'Drinks and tasting experiences', 'FOOD & DRINKS', 1, 10, now()),
(gen_random_uuid(), 'Biology', 'Life sciences and biology', 'SCIENCE AND KNOWLEDGE', 1, 11, now()),
(gen_random_uuid(), 'Board Games & Strategy', 'Games and strategic thinking', 'HOBBIES', 1, 12, now()),
(gen_random_uuid(), 'Botanical Interest', 'Plants and botanical studies', 'NATURE', 1, 13, now()),
(gen_random_uuid(), 'Business Innovation', 'Business and innovation', 'BUSINESS', 1, 14, now()),
(gen_random_uuid(), 'Ceramics & Pottery', 'Clay work and ceramics', 'ART', 1, 15, now()),
(gen_random_uuid(), 'Chemistry', 'Chemical sciences', 'SCIENCE AND KNOWLEDGE', 1, 16, now()),
(gen_random_uuid(), 'Chinese Culture & Language', 'Chinese language and culture', 'LANGUAGES', 1, 17, now()),
(gen_random_uuid(), 'Cinema & Film Appreciation', 'Movies and film culture', 'ENTERTAINMENT', 1, 18, now()),
(gen_random_uuid(), 'Classical Music', 'Classical music appreciation', 'MUSIC', 1, 19, now()),
(gen_random_uuid(), 'Collecting & Games', 'Collecting hobbies and games', 'HOBBIES', 1, 20, now()),
(gen_random_uuid(), 'Conferences & Seminars', 'Professional events and learning', 'BUSINESS', 1, 21, now()),
(gen_random_uuid(), 'Confidence Building', 'Personal confidence development', 'PERSONAL DEVELOPMENT', 1, 22, now()),
(gen_random_uuid(), 'Contemporary & Pop Music', 'Modern and popular music', 'MUSIC', 1, 23, now()),
(gen_random_uuid(), 'Courses & Workshops', 'Educational courses and workshops', 'EDUCATION', 1, 24, now()),
(gen_random_uuid(), 'Desserts & Sweets Culture', 'Desserts and sweet foods', 'FOOD & DRINKS', 1, 25, now()),
(gen_random_uuid(), 'Digital Nomadism', 'Remote work and digital lifestyle', 'LIFESTYLE', 1, 26, now()),
(gen_random_uuid(), 'Engineering & Technology', 'Engineering and tech innovation', 'SCIENCE AND TECHNOLOGY', 1, 27, now()),
(gen_random_uuid(), 'English Language & Culture', 'English language and culture', 'LANGUAGES', 1, 28, now()),
(gen_random_uuid(), 'Finance & Investment', 'Financial planning and investing', 'BUSINESS', 1, 29, now()),
(gen_random_uuid(), 'Folk & Traditional Music', 'Traditional and folk music', 'MUSIC', 1, 30, now()),
(gen_random_uuid(), 'Forests & Greenery', 'Forest environments and nature', 'NATURE', 1, 31, now()),
(gen_random_uuid(), 'French Cuisine & Gastronomy', 'French food and cooking', 'FOOD & DRINKS', 1, 32, now()),
(gen_random_uuid(), 'Friendship & Socializing', 'Social connections and friendship', 'RELATIONSHIPS', 1, 33, now()),
(gen_random_uuid(), 'Gardening & Horticulture', 'Gardening and plant cultivation', 'NATURE', 1, 34, now()),
(gen_random_uuid(), 'Gourmet Experiences', 'Fine dining and gourmet food', 'FOOD & DRINKS', 1, 35, now()),
(gen_random_uuid(), 'Holistic Therapies', 'Alternative and holistic healing', 'HEALTH AND WELLNESS', 1, 36, now()),
(gen_random_uuid(), 'Illustration & Comics', 'Illustration art and comics', 'ART', 1, 37, now()),
(gen_random_uuid(), 'Innovation & Future Trends', 'Innovation and future thinking', 'SCIENCE AND TECHNOLOGY', 1, 38, now()),
(gen_random_uuid(), 'Italian Cuisine & Pasta Culture', 'Italian food and pasta', 'FOOD & DRINKS', 1, 39, now()),
(gen_random_uuid(), 'Jazz & Blues', 'Jazz and blues music', 'MUSIC', 1, 40, now()),
(gen_random_uuid(), 'Language Exchange', 'Language learning and exchange', 'LANGUAGES', 1, 41, now()),
(gen_random_uuid(), 'Latin Music', 'Latin music and culture', 'MUSIC', 1, 42, now()),
(gen_random_uuid(), 'Leadership & Strategy', 'Leadership development and strategy', 'BUSINESS', 1, 43, now()),
(gen_random_uuid(), 'Live Entertainment', 'Live shows and entertainment', 'ENTERTAINMENT', 1, 44, now()),
(gen_random_uuid(), 'Marine Life & Oceans', 'Ocean life and marine biology', 'NATURE', 1, 45, now()),
(gen_random_uuid(), 'Marketing & Branding', 'Marketing and brand development', 'BUSINESS', 1, 46, now()),
(gen_random_uuid(), 'Mathematics', 'Mathematical sciences', 'SCIENCE AND KNOWLEDGE', 1, 47, now()),
(gen_random_uuid(), 'Media & Digital Culture', 'Digital media and culture', 'ENTERTAINMENT', 1, 48, now()),
(gen_random_uuid(), 'Meditation & Mindfulness', 'Meditation and mindful practices', 'HEALTH AND WELLNESS', 1, 49, now()),
(gen_random_uuid(), 'Mediterranean Cuisine', 'Mediterranean food culture', 'FOOD & DRINKS', 1, 50, now()),
(gen_random_uuid(), 'Mental Skills Development', 'Mental skills and cognitive development', 'PERSONAL DEVELOPMENT', 1, 51, now()),
(gen_random_uuid(), 'Mountains & Scenic Views', 'Mountain environments and views', 'NATURE', 1, 52, now()),
(gen_random_uuid(), 'Musical Icons', 'Famous musicians and musical legends', 'MUSIC', 1, 53, now()),
(gen_random_uuid(), 'Music Appreciation & History', 'Music history and appreciation', 'MUSIC', 1, 54, now()),
(gen_random_uuid(), 'Natural Environments', 'Natural settings and environments', 'NATURE', 1, 55, now()),
(gen_random_uuid(), 'Nutrition & Wellness', 'Nutrition and health wellness', 'HEALTH AND WELLNESS', 1, 56, now()),
(gen_random_uuid(), 'Opera & Vocal Arts', 'Opera and vocal performances', 'MUSIC', 1, 57, now()),
(gen_random_uuid(), 'Painting & Fine Arts', 'Painting and fine art', 'ART', 1, 58, now()),
(gen_random_uuid(), 'Performance Art', 'Performance and theatrical art', 'ART', 1, 59, now()),
(gen_random_uuid(), 'Personal Development & Growth', 'Personal growth and development', 'PERSONAL DEVELOPMENT', 1, 60, now()),
(gen_random_uuid(), 'Philosophy', 'Philosophical thinking and ideas', 'SCIENCE AND KNOWLEDGE', 1, 61, now()),
(gen_random_uuid(), 'Photography', 'Photography and visual arts', 'ART', 1, 62, now()),
(gen_random_uuid(), 'Psychology & Human Behavior', 'Psychology and human behavior', 'SCIENCE AND KNOWLEDGE', 1, 63, now()),
(gen_random_uuid(), 'Public Speaking', 'Public speaking and communication', 'PERSONAL DEVELOPMENT', 1, 64, now());

-- Create translations for the new affinities
INSERT INTO theme_translations (theme_id, locale, name, description, created_at) 
SELECT 
  t.id,
  'es' as locale,
  CASE t.name
    WHEN 'Academic Learning' THEN 'Aprendizaje Académico'
    WHEN 'Antiques & Collectibles' THEN 'Antigüedades y Coleccionables'
    WHEN 'Architecture & Design' THEN 'Arquitectura y Diseño'
    WHEN 'Art History & Movements' THEN 'Historia del Arte y Movimientos'
    WHEN 'Artificial Intelligence' THEN 'Inteligencia Artificial'
    WHEN 'Artists & Creativity' THEN 'Artistas y Creatividad'
    WHEN 'Astronomy' THEN 'Astronomía'
    WHEN 'Beaches & Coastlines' THEN 'Playas y Costas'
    WHEN 'Beer & Brewing Culture' THEN 'Cultura Cervecera'
    WHEN 'Beverages & Tastings' THEN 'Bebidas y Catas'
    WHEN 'Biology' THEN 'Biología'
    WHEN 'Board Games & Strategy' THEN 'Juegos de Mesa y Estrategia'
    WHEN 'Botanical Interest' THEN 'Interés Botánico'
    WHEN 'Business Innovation' THEN 'Innovación Empresarial'
    WHEN 'Ceramics & Pottery' THEN 'Cerámica y Alfarería'
    WHEN 'Chemistry' THEN 'Química'
    WHEN 'Chinese Culture & Language' THEN 'Cultura e Idioma Chino'
    WHEN 'Cinema & Film Appreciation' THEN 'Cine y Apreciación Cinematográfica'
    WHEN 'Classical Music' THEN 'Música Clásica'
    WHEN 'Collecting & Games' THEN 'Coleccionismo y Juegos'
    WHEN 'Conferences & Seminars' THEN 'Conferencias y Seminarios'
    WHEN 'Confidence Building' THEN 'Desarrollo de Confianza'
    WHEN 'Contemporary & Pop Music' THEN 'Música Contemporánea y Pop'
    WHEN 'Courses & Workshops' THEN 'Cursos y Talleres'
    WHEN 'Desserts & Sweets Culture' THEN 'Cultura de Postres y Dulces'
    WHEN 'Digital Nomadism' THEN 'Nomadismo Digital'
    WHEN 'Engineering & Technology' THEN 'Ingeniería y Tecnología'
    WHEN 'English Language & Culture' THEN 'Idioma y Cultura Inglesa'
    WHEN 'Finance & Investment' THEN 'Finanzas e Inversión'
    WHEN 'Folk & Traditional Music' THEN 'Música Folk y Tradicional'
    WHEN 'Forests & Greenery' THEN 'Bosques y Vegetación'
    WHEN 'French Cuisine & Gastronomy' THEN 'Cocina y Gastronomía Francesa'
    WHEN 'Friendship & Socializing' THEN 'Amistad y Socialización'
    WHEN 'Gardening & Horticulture' THEN 'Jardinería y Horticultura'
    WHEN 'Gourmet Experiences' THEN 'Experiencias Gourmet'
    WHEN 'Holistic Therapies' THEN 'Terapias Holísticas'
    WHEN 'Illustration & Comics' THEN 'Ilustración y Cómics'
    WHEN 'Innovation & Future Trends' THEN 'Innovación y Tendencias Futuras'
    WHEN 'Italian Cuisine & Pasta Culture' THEN 'Cocina Italiana y Cultura de Pasta'
    WHEN 'Jazz & Blues' THEN 'Jazz y Blues'
    WHEN 'Language Exchange' THEN 'Intercambio de Idiomas'
    WHEN 'Latin Music' THEN 'Música Latina'
    WHEN 'Leadership & Strategy' THEN 'Liderazgo y Estrategia'
    WHEN 'Live Entertainment' THEN 'Entretenimiento en Vivo'
    WHEN 'Marine Life & Oceans' THEN 'Vida Marina y Océanos'
    WHEN 'Marketing & Branding' THEN 'Marketing y Branding'
    WHEN 'Mathematics' THEN 'Matemáticas'
    WHEN 'Media & Digital Culture' THEN 'Medios y Cultura Digital'
    WHEN 'Meditation & Mindfulness' THEN 'Meditación y Atención Plena'
    WHEN 'Mediterranean Cuisine' THEN 'Cocina Mediterránea'
    WHEN 'Mental Skills Development' THEN 'Desarrollo de Habilidades Mentales'
    WHEN 'Mountains & Scenic Views' THEN 'Montañas y Vistas Panorámicas'
    WHEN 'Musical Icons' THEN 'Íconos Musicales'
    WHEN 'Music Appreciation & History' THEN 'Apreciación e Historia Musical'
    WHEN 'Natural Environments' THEN 'Entornos Naturales'
    WHEN 'Nutrition & Wellness' THEN 'Nutrición y Bienestar'
    WHEN 'Opera & Vocal Arts' THEN 'Ópera y Artes Vocales'
    WHEN 'Painting & Fine Arts' THEN 'Pintura y Bellas Artes'
    WHEN 'Performance Art' THEN 'Arte Performático'
    WHEN 'Personal Development & Growth' THEN 'Desarrollo y Crecimiento Personal'
    WHEN 'Philosophy' THEN 'Filosofía'
    WHEN 'Photography' THEN 'Fotografía'
    WHEN 'Psychology & Human Behavior' THEN 'Psicología y Comportamiento Humano'
    WHEN 'Public Speaking' THEN 'Oratoria'
    ELSE t.name
  END as name,
  t.description,
  now()
FROM themes t;

INSERT INTO theme_translations (theme_id, locale, name, description, created_at) 
SELECT 
  t.id,
  'pt' as locale,
  CASE t.name
    WHEN 'Academic Learning' THEN 'Aprendizagem Académica'
    WHEN 'Antiques & Collectibles' THEN 'Antiguidades e Colecionáveis'
    WHEN 'Architecture & Design' THEN 'Arquitetura e Design'
    WHEN 'Art History & Movements' THEN 'História da Arte e Movimentos'
    WHEN 'Artificial Intelligence' THEN 'Inteligência Artificial'
    WHEN 'Artists & Creativity' THEN 'Artistas e Criatividade'
    WHEN 'Astronomy' THEN 'Astronomia'
    WHEN 'Beaches & Coastlines' THEN 'Praias e Costas'
    WHEN 'Beer & Brewing Culture' THEN 'Cultura Cervejeira'
    WHEN 'Beverages & Tastings' THEN 'Bebidas e Degustações'
    WHEN 'Biology' THEN 'Biologia'
    WHEN 'Board Games & Strategy' THEN 'Jogos de Tabuleiro e Estratégia'
    WHEN 'Botanical Interest' THEN 'Interesse Botânico'
    WHEN 'Business Innovation' THEN 'Inovação Empresarial'
    WHEN 'Ceramics & Pottery' THEN 'Cerâmica e Olaria'
    WHEN 'Chemistry' THEN 'Química'
    WHEN 'Chinese Culture & Language' THEN 'Cultura e Idioma Chinês'
    WHEN 'Cinema & Film Appreciation' THEN 'Cinema e Apreciação Cinematográfica'
    WHEN 'Classical Music' THEN 'Música Clássica'
    WHEN 'Collecting & Games' THEN 'Colecionismo e Jogos'
    WHEN 'Conferences & Seminars' THEN 'Conferências e Seminários'
    WHEN 'Confidence Building' THEN 'Desenvolvimento de Confiança'
    WHEN 'Contemporary & Pop Music' THEN 'Música Contemporânea e Pop'
    WHEN 'Courses & Workshops' THEN 'Cursos e Workshops'
    WHEN 'Desserts & Sweets Culture' THEN 'Cultura de Sobremesas e Doces'
    WHEN 'Digital Nomadism' THEN 'Nomadismo Digital'
    WHEN 'Engineering & Technology' THEN 'Engenharia e Tecnologia'
    WHEN 'English Language & Culture' THEN 'Idioma e Cultura Inglesa'
    WHEN 'Finance & Investment' THEN 'Finanças e Investimento'
    WHEN 'Folk & Traditional Music' THEN 'Música Folk e Tradicional'
    WHEN 'Forests & Greenery' THEN 'Florestas e Vegetação'
    WHEN 'French Cuisine & Gastronomy' THEN 'Cozinha e Gastronomia Francesa'
    WHEN 'Friendship & Socializing' THEN 'Amizade e Socialização'
    WHEN 'Gardening & Horticulture' THEN 'Jardinagem e Horticultura'
    WHEN 'Gourmet Experiences' THEN 'Experiências Gourmet'
    WHEN 'Holistic Therapies' THEN 'Terapias Holísticas'
    WHEN 'Illustration & Comics' THEN 'Ilustração e Quadrinhos'
    WHEN 'Innovation & Future Trends' THEN 'Inovação e Tendências Futuras'
    WHEN 'Italian Cuisine & Pasta Culture' THEN 'Cozinha Italiana e Cultura da Massa'
    WHEN 'Jazz & Blues' THEN 'Jazz e Blues'
    WHEN 'Language Exchange' THEN 'Intercâmbio de Idiomas'
    WHEN 'Latin Music' THEN 'Música Latina'
    WHEN 'Leadership & Strategy' THEN 'Liderança e Estratégia'
    WHEN 'Live Entertainment' THEN 'Entretenimento ao Vivo'
    WHEN 'Marine Life & Oceans' THEN 'Vida Marinha e Oceanos'
    WHEN 'Marketing & Branding' THEN 'Marketing e Branding'
    WHEN 'Mathematics' THEN 'Matemática'
    WHEN 'Media & Digital Culture' THEN 'Mídia e Cultura Digital'
    WHEN 'Meditation & Mindfulness' THEN 'Meditação e Mindfulness'
    WHEN 'Mediterranean Cuisine' THEN 'Cozinha Mediterrânea'
    WHEN 'Mental Skills Development' THEN 'Desenvolvimento de Habilidades Mentais'
    WHEN 'Mountains & Scenic Views' THEN 'Montanhas e Vistas Cênicas'
    WHEN 'Musical Icons' THEN 'Ícones Musicais'
    WHEN 'Music Appreciation & History' THEN 'Apreciação e História Musical'
    WHEN 'Natural Environments' THEN 'Ambientes Naturais'
    WHEN 'Nutrition & Wellness' THEN 'Nutrição e Bem-estar'
    WHEN 'Opera & Vocal Arts' THEN 'Ópera e Artes Vocais'
    WHEN 'Painting & Fine Arts' THEN 'Pintura e Belas Artes'
    WHEN 'Performance Art' THEN 'Arte Performática'
    WHEN 'Personal Development & Growth' THEN 'Desenvolvimento e Crescimento Pessoal'
    WHEN 'Philosophy' THEN 'Filosofia'
    WHEN 'Photography' THEN 'Fotografia'
    WHEN 'Psychology & Human Behavior' THEN 'Psicologia e Comportamento Humano'
    WHEN 'Public Speaking' THEN 'Oratória'
    ELSE t.name
  END as name,
  t.description,
  now()
FROM themes t;

INSERT INTO theme_translations (theme_id, locale, name, description, created_at) 
SELECT 
  t.id,
  'ro' as locale,
  CASE t.name
    WHEN 'Academic Learning' THEN 'Învățare Academică'
    WHEN 'Antiques & Collectibles' THEN 'Antichități și Colecționabile'
    WHEN 'Architecture & Design' THEN 'Arhitectură și Design'
    WHEN 'Art History & Movements' THEN 'Istoria Artei și Mișcări'
    WHEN 'Artificial Intelligence' THEN 'Inteligență Artificială'
    WHEN 'Artists & Creativity' THEN 'Artiști și Creativitate'
    WHEN 'Astronomy' THEN 'Astronomie'
    WHEN 'Beaches & Coastlines' THEN 'Plaje și Coaste'
    WHEN 'Beer & Brewing Culture' THEN 'Cultura Berii și Fabricării'
    WHEN 'Beverages & Tastings' THEN 'Băuturi și Degustări'
    WHEN 'Biology' THEN 'Biologie'
    WHEN 'Board Games & Strategy' THEN 'Jocuri de Masă și Strategie'
    WHEN 'Botanical Interest' THEN 'Interes Botanic'
    WHEN 'Business Innovation' THEN 'Inovație în Afaceri'
    WHEN 'Ceramics & Pottery' THEN 'Ceramică și Olărit'
    WHEN 'Chemistry' THEN 'Chimie'
    WHEN 'Chinese Culture & Language' THEN 'Cultura și Limba Chineză'
    WHEN 'Cinema & Film Appreciation' THEN 'Cinema și Aprecierea Filmului'
    WHEN 'Classical Music' THEN 'Muzică Clasică'
    WHEN 'Collecting & Games' THEN 'Colecționare și Jocuri'
    WHEN 'Conferences & Seminars' THEN 'Conferințe și Seminarii'
    WHEN 'Confidence Building' THEN 'Dezvoltarea Încrederii'
    WHEN 'Contemporary & Pop Music' THEN 'Muzică Contemporană și Pop'
    WHEN 'Courses & Workshops' THEN 'Cursuri și Ateliere'
    WHEN 'Desserts & Sweets Culture' THEN 'Cultura Deserturilor și Dulciurilor'
    WHEN 'Digital Nomadism' THEN 'Nomadism Digital'
    WHEN 'Engineering & Technology' THEN 'Inginerie și Tehnologie'
    WHEN 'English Language & Culture' THEN 'Limba și Cultura Engleză'
    WHEN 'Finance & Investment' THEN 'Finanțe și Investiții'
    WHEN 'Folk & Traditional Music' THEN 'Muzică Folk și Tradițională'
    WHEN 'Forests & Greenery' THEN 'Păduri și Vegetație'
    WHEN 'French Cuisine & Gastronomy' THEN 'Bucătăria și Gastronomia Franceză'
    WHEN 'Friendship & Socializing' THEN 'Prietenie și Socializare'
    WHEN 'Gardening & Horticulture' THEN 'Grădinărit și Horticultură'
    WHEN 'Gourmet Experiences' THEN 'Experiențe Gourmet'
    WHEN 'Holistic Therapies' THEN 'Terapii Holistice'
    WHEN 'Illustration & Comics' THEN 'Ilustrație și Benzi Desenate'
    WHEN 'Innovation & Future Trends' THEN 'Inovație și Tendințe Viitoare'
    WHEN 'Italian Cuisine & Pasta Culture' THEN 'Bucătăria Italiană și Cultura Pastelor'
    WHEN 'Jazz & Blues' THEN 'Jazz și Blues'
    WHEN 'Language Exchange' THEN 'Schimb de Limbi'
    WHEN 'Latin Music' THEN 'Muzică Latină'
    WHEN 'Leadership & Strategy' THEN 'Leadership și Strategie'
    WHEN 'Live Entertainment' THEN 'Divertisment Live'
    WHEN 'Marine Life & Oceans' THEN 'Viața Marină și Oceane'
    WHEN 'Marketing & Branding' THEN 'Marketing și Branding'
    WHEN 'Mathematics' THEN 'Matematică'
    WHEN 'Media & Digital Culture' THEN 'Media și Cultura Digitală'
    WHEN 'Meditation & Mindfulness' THEN 'Meditație și Mindfulness'
    WHEN 'Mediterranean Cuisine' THEN 'Bucătăria Mediteraneană'
    WHEN 'Mental Skills Development' THEN 'Dezvoltarea Abilităților Mentale'
    WHEN 'Mountains & Scenic Views' THEN 'Munți și Priveliști Pitorești'
    WHEN 'Musical Icons' THEN 'Icoane Muzicale'
    WHEN 'Music Appreciation & History' THEN 'Aprecierea și Istoria Muzicii'
    WHEN 'Natural Environments' THEN 'Medii Naturale'
    WHEN 'Nutrition & Wellness' THEN 'Nutriție și Wellness'
    WHEN 'Opera & Vocal Arts' THEN 'Operă și Arte Vocale'
    WHEN 'Painting & Fine Arts' THEN 'Pictură și Arte Frumoase'
    WHEN 'Performance Art' THEN 'Artă Performativă'
    WHEN 'Personal Development & Growth' THEN 'Dezvoltare și Creștere Personală'
    WHEN 'Philosophy' THEN 'Filosofie'
    WHEN 'Photography' THEN 'Fotografie'
    WHEN 'Psychology & Human Behavior' THEN 'Psihologie și Comportament Uman'
    WHEN 'Public Speaking' THEN 'Vorbire în Public'
    ELSE t.name
  END as name,
  t.description,
  now()
FROM themes t;