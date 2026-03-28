-- Final batch of affinities data restoration (batch 3 - final 25)
INSERT INTO affinities (name_en, name_es, name_pt, name_ro, category)
SELECT 'Mental Skills Development', 'Desarrollo personal', 'Desenvolvimento pessoal', 'Dezvoltare personală', 'personal_development'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Mental Skills Development')
UNION ALL
SELECT 'Mountains & Scenic Views', 'Montañas y Vistas Escénicas', 'Montanhas e Vistas Cênicas', 'Munți și Priveliști Frumoase', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Mountains & Scenic Views')
UNION ALL
SELECT 'Musical Icons', 'Iconos musicales', 'Ícones musicais', 'Icoane muzicale', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Musical Icons')
UNION ALL
SELECT 'Music Appreciation & History', 'Teoría musical', 'Teoria musical', 'Teoria muzicală', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Music Appreciation & History')
UNION ALL
SELECT 'Natural Environments', 'Naturaleza', 'Natureza', 'Natură', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Natural Environments')
UNION ALL
SELECT 'Nutrition & Wellness', 'Nutrición', 'Nutrição', 'Nutriție', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Nutrition & Wellness')
UNION ALL
SELECT 'Opera & Vocal Arts', 'Ópera', 'Ópera', 'Operă', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Opera & Vocal Arts')
UNION ALL
SELECT 'Painting & Fine Arts', 'Pintura', 'Pintura', 'Pictură', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Painting & Fine Arts')
UNION ALL
SELECT 'Performance Art', 'Arte de rendimiento', 'Arte de performance', 'Artă performativă', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Performance Art')
UNION ALL
SELECT 'Personal Development & Growth', 'Crecimiento personal', 'Crescimento pessoal', 'Creștere personală', 'personal_development'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Personal Development & Growth')
UNION ALL
SELECT 'Philosophy', 'Filosofía', 'Filosofia', 'Filozofie', 'education'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Philosophy')
UNION ALL
SELECT 'Photography', 'Fotografía', 'Fotografia', 'Fotografie', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Photography')
UNION ALL
SELECT 'Psychology & Human Behavior', 'Psicología', 'Psicologia', 'Psihologie', 'science'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Psychology & Human Behavior')
UNION ALL
SELECT 'Public Speaking', 'Oratoria', 'Oratória', 'Oratorie', 'personal_development'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Public Speaking')
UNION ALL
SELECT 'Reading & Literary Circles', 'Lectura y Círculos Literarios', 'Leitura e Círculos Literários', 'Lectură și Cercuri Literare', 'education'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Reading & Literary Circles')
UNION ALL
SELECT 'Rock & Heavy Music', 'Música Rock y Heavy', 'Música Rock e Heavy', 'Muzică Rock și Heavy', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Rock & Heavy Music')
UNION ALL
SELECT 'Rural & Countryside Environments', 'Ambientes Rurales y de Campo', 'Ambientes Rurais e do Campo', 'Medii Rurale și de Țară', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Rural & Countryside Environments')
UNION ALL
SELECT 'Science Communication', 'Comunicación Científica', 'Comunicação Científica', 'Comunicare Științifică', 'science'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Science Communication')
UNION ALL
SELECT 'Seaside & Coastal Tourism', 'Turismo Costero y de Playa', 'Turismo Costeiro e de Praia', 'Turism Costier și de Plajă', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Seaside & Coastal Tourism')
UNION ALL
SELECT 'Spiritual Growth', 'Crecimiento Espiritual', 'Crescimento Espiritual', 'Creștere Spirituală', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Spiritual Growth')
UNION ALL
SELECT 'Strategy Games & Puzzles', 'Juegos de Estrategia y Rompecabezas', 'Jogos de Estratégia e Quebra-cabeças', 'Jocuri de Strategie și Puzzle-uri', 'games'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Strategy Games & Puzzles')
UNION ALL
SELECT 'Sustainable Living', 'Vida Sostenible', 'Vida Sustentável', 'Viață Sustenabilă', 'lifestyle'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Sustainable Living')
UNION ALL
SELECT 'Tai Chi & Qigong', 'Tai Chi y Qigong', 'Tai Chi e Qigong', 'Tai Chi și Qigong', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Tai Chi & Qigong')
UNION ALL
SELECT 'Travel & Cultural Exchange', 'Viajes e Intercambio Cultural', 'Viagens e Intercâmbio Cultural', 'Călătorii și Schimb Cultural', 'culture'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Travel & Cultural Exchange')
UNION ALL
SELECT 'Urban Exploration', 'Exploración Urbana', 'Exploração Urbana', 'Explorare Urbană', 'lifestyle'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Urban Exploration');