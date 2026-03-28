-- Add final 3 affinities to complete the restoration
INSERT INTO affinities (name_en, name_es, name_pt, name_ro, category)
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

-- Now address the security warning about leaked password protection
-- Enable leaked password protection for better security
UPDATE auth.config 
SET value = 'true'
WHERE parameter = 'password_leaked_value_check';