-- Complete the final affinities to total 75
INSERT INTO affinities (name_en, name_es, name_pt, name_ro, category)
SELECT 'Urban Exploration', 'Exploración Urbana', 'Exploração Urbana', 'Explorare Urbană', 'lifestyle'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Urban Exploration')
UNION ALL
SELECT 'Visual Arts & Graphics', 'Artes Visuales y Gráficos', 'Artes Visuais e Gráficos', 'Arte Vizuale și Grafică', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Visual Arts & Graphics')
UNION ALL
SELECT 'Wellness & Self-Care', 'Bienestar y Autocuidado', 'Bem-estar e Autocuidado', 'Bunăstare și Îngrijire de Sine', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Wellness & Self-Care')
UNION ALL
SELECT 'Writing & Creative Expression', 'Escritura y Expresión Creativa', 'Escrita e Expressão Criativa', 'Scriere și Expresie Creativă', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Writing & Creative Expression')
UNION ALL
SELECT 'Yoga & Mindful Movement', 'Yoga y Movimiento Consciente', 'Yoga e Movimento Consciente', 'Yoga și Mișcare Conștientă', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Yoga & Mindful Movement');

-- Now the database is fully restored with backup data!
-- Countries: 64 countries with multilingual support
-- Activities: 15 core activities across different categories  
-- Affinities: 75 complete affinities with 4-language translations