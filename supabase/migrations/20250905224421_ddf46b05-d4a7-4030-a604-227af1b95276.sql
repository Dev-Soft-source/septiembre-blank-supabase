-- Complete remaining affinities data restoration (batch 2 - next 25)
INSERT INTO affinities (name_en, name_es, name_pt, name_ro, category)
SELECT 'Digital Nomadism', 'Trabajo remoto', 'Trabalho remoto', 'Muncă la distanță', 'lifestyle'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Digital Nomadism')
UNION ALL
SELECT 'Engineering & Technology', 'Ingeniería', 'Engenharia', 'Inginerie', 'technology'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Engineering & Technology')
UNION ALL
SELECT 'English Language & Culture', 'Cultura europea', 'Cultura europeia', 'Cultură europeană', 'culture'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'English Language & Culture')
UNION ALL
SELECT 'Finance & Investment', 'Finanzas personales', 'Finanças pessoais', 'Finanțe personale', 'business'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Finance & Investment')
UNION ALL
SELECT 'Folk & Traditional Music', 'Música tradicional', 'Música tradicional', 'Muzică tradițională', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Folk & Traditional Music')
UNION ALL
SELECT 'Forests & Greenery', 'Naturaleza', 'Natureza', 'Natură', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Forests & Greenery')
UNION ALL
SELECT 'French Cuisine & Gastronomy', 'Cocina francesa', 'Culinária francesa', 'Bucătărie franceză', 'food_drinks'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'French Cuisine & Gastronomy')
UNION ALL
SELECT 'Friendship & Socializing', 'Relaciones personales', 'Relacionamentos pessoais', 'Relații personale', 'social'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Friendship & Socializing')
UNION ALL
SELECT 'Gardening & Horticulture', 'Jardinería y Horticultura', 'Jardinagem e Horticultura', 'Grădinărit și Horticultură', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Gardening & Horticulture')
UNION ALL
SELECT 'Gourmet Experiences', 'Gastronomía', 'Gastronomia', 'Gastronomie', 'food_drinks'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Gourmet Experiences')
UNION ALL
SELECT 'Holistic Therapies', 'Salud holística', 'Saúde holística', 'Sănătate holistică', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Holistic Therapies')
UNION ALL
SELECT 'Illustration & Comics', 'Arte digital', 'Arte digital', 'Artă digitală', 'art'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Illustration & Comics')
UNION ALL
SELECT 'Innovation & Future Trends', 'Innovación', 'Inovação', 'Inovație', 'technology'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Innovation & Future Trends')
UNION ALL
SELECT 'Italian Cuisine & Pasta Culture', 'Cocina italiana', 'Culinária italiana', 'Bucătărie italiană', 'food_drinks'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Italian Cuisine & Pasta Culture')
UNION ALL
SELECT 'Jazz & Blues', 'Jazz', 'Jazz', 'Jazz', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Jazz & Blues')
UNION ALL
SELECT 'Language Exchange', 'Idiomas', 'Idiomas', 'Limbi străine', 'education'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Language Exchange')
UNION ALL
SELECT 'Latin Music', 'Música latina', 'Música latina', 'Muzică latină', 'music'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Latin Music')
UNION ALL
SELECT 'Leadership & Strategy', 'Liderazgo', 'Liderança', 'Leadership', 'business'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Leadership & Strategy')
UNION ALL
SELECT 'Live Entertainment', 'Teatro', 'Teatro', 'Teatru', 'entertainment'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Live Entertainment')
UNION ALL
SELECT 'Marine Life & Oceans', 'Vida Marina y Océanos', 'Vida Marinha e Oceanos', 'Viața Marină și Oceane', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Marine Life & Oceans')
UNION ALL
SELECT 'Marketing & Branding', 'Marketing y Marca', 'Marketing e Branding', 'Marketing și Branding', 'business'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Marketing & Branding')
UNION ALL
SELECT 'Mathematics', 'Matemáticas', 'Matemática', 'Matematică', 'science'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Mathematics')
UNION ALL
SELECT 'Media & Digital Culture', 'Series de Netflix y Televisión', 'Séries Netflix e Televisão', 'Seriale Netflix și Televiziune', 'entertainment'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Media & Digital Culture')
UNION ALL
SELECT 'Meditation & Mindfulness', 'Mindfulness', 'Mindfulness', 'Mindfulness', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Meditation & Mindfulness')
UNION ALL
SELECT 'Mediterranean Cuisine', 'Cocina mediterránea', 'Culinária mediterrânea', 'Bucătărie mediteraneană', 'food_drinks'
WHERE NOT EXISTS (SELECT 1 FROM affinities WHERE name_en = 'Mediterranean Cuisine');