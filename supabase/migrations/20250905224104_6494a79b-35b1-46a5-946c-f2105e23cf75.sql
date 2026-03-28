-- Insert Affinities data (first batch of 25)
INSERT INTO affinities (name_en, name_es, name_pt, name_ro, category)
SELECT 'Academic Learning', 'Educación', 'Educação', 'Educație', 'education'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Academic Learning')
UNION ALL
SELECT 'Antiques & Collectibles', 'Antigüedades y Coleccionables', 'Antiguidades e Colecionáveis', 'Antichități și Colecții', 'hobbies'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Antiques & Collectibles')
UNION ALL
SELECT 'Architecture & Design', 'Arquitectura y Diseño', 'Arquitetura e Design', 'Arhitectură și Design', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Architecture & Design')
UNION ALL
SELECT 'Art History & Movements', 'Historia del arte', 'História da arte', 'Istoria artei', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Art History & Movements')
UNION ALL
SELECT 'Artificial Intelligence', 'Inteligencia artificial', 'Inteligência artificial', 'Inteligență artificială', 'technology'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Artificial Intelligence')
UNION ALL
SELECT 'Artists & Creativity', 'Escritura creativa', 'Escrita criativa', 'Scriere creativă', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Artists & Creativity')
UNION ALL
SELECT 'Astronomy', 'Astronomía', 'Astronomia', 'Astronomie', 'science'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Astronomy')
UNION ALL
SELECT 'Beaches & Coastlines', 'Playas y Costas', 'Praias e Costas', 'Plaje și Coastă', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Beaches & Coastlines')
UNION ALL
SELECT 'Beer & Brewing Culture', 'Cultura Cervecera', 'Cultura da Cerveja', 'Cultura Berii', 'food_drinks'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Beer & Brewing Culture')
UNION ALL
SELECT 'Beverages & Tastings', 'Bebidas y Degustaciones', 'Bebidas e Degustações', 'Băuturi și Degustări', 'food_drinks'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Beverages & Tastings')
UNION ALL
SELECT 'Biology', 'Biología', 'Biologia', 'Biologie', 'science'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Biology')
UNION ALL
SELECT 'Board Games & Strategy', 'Ajedrez', 'Xadrez', 'Șah', 'games'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Board Games & Strategy')
UNION ALL
SELECT 'Botanical Interest', 'Interés Botánico', 'Interesse Botânico', 'Interes Botanic', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Botanical Interest')
UNION ALL
SELECT 'Business Innovation', 'Innovación', 'Inovação', 'Inovație', 'business'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Business Innovation')
UNION ALL
SELECT 'Ceramics & Pottery', 'Cerámica y Alfarería', 'Cerâmica e Olaria', 'Ceramică și Olărit', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Ceramics & Pottery')
UNION ALL
SELECT 'Chemistry', 'Química', 'Química', 'Chimie', 'science'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Chemistry')
UNION ALL
SELECT 'Chinese Culture & Language', 'Cultura asiática', 'Cultura asiática', 'Cultură asiatică', 'culture'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Chinese Culture & Language')
UNION ALL
SELECT 'Cinema & Film Appreciation', 'Cine contemporáneo', 'Cinema contemporâneo', 'Cinema contemporan', 'entertainment'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Cinema & Film Appreciation')
UNION ALL
SELECT 'Classical Music', 'Música clásica', 'Música clássica', 'Muzică clasică', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Classical Music')
UNION ALL
SELECT 'Collecting & Games', 'Gaming competitivo', 'Gaming competitivo', 'Gaming competitiv', 'games'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Collecting & Games')
UNION ALL
SELECT 'Conferences & Seminars', 'Conferencias y Seminarios', 'Conferências e Seminários', 'Conferințe și Seminarii', 'education'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Conferences & Seminars')
UNION ALL
SELECT 'Confidence Building', 'Inteligencia emocional', 'Inteligência emocional', 'Inteligență emoțională', 'personal_development'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Confidence Building')
UNION ALL
SELECT 'Contemporary & Pop Music', 'Música pop', 'Música pop', 'Muzică pop', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Contemporary & Pop Music')
UNION ALL
SELECT 'Courses & Workshops', 'Cursos y Talleres', 'Cursos e Workshops', 'Cursuri și Workshopuri', 'education'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Courses & Workshops')
UNION ALL
SELECT 'Desserts & Sweets Culture', 'Repostería', 'Pastelaria', 'Patiserie', 'food_drinks'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Desserts & Sweets Culture');