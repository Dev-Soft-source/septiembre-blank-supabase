-- Insert final batch of countries and all activities
INSERT INTO countries (iso_code, name_en, name_es, name_pt, name_ro)
SELECT 'SE', 'Sweden', 'Suecia', 'Suécia', 'Suedia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'SE')
UNION ALL
SELECT 'CH', 'Switzerland', 'Suiza', 'Suíça', 'Elveția'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'CH')
UNION ALL
SELECT 'TW', 'Taiwan', 'Taiwán', 'Taiwan', 'Taiwan'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'TW')
UNION ALL
SELECT 'TH', 'Thailand', 'Tailandia', 'Tailândia', 'Thailanda'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'TH')
UNION ALL
SELECT 'TR', 'Turkey', 'Turquía', 'Turquia', 'Turcia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'TR')
UNION ALL
SELECT 'AE', 'United Arab Emirates', 'Emiratos Árabes Unidos', 'Emirados Árabes Unidos', 'Emiratele Arabe Unite'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'AE')
UNION ALL
SELECT 'GB', 'United Kingdom', 'Reino Unido', 'Reino Unido', 'Regatul Unit'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'GB')
UNION ALL
SELECT 'US', 'United States', 'Estados Unidos', 'Estados Unidos', 'Statele Unite'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'US')
UNION ALL
SELECT 'UY', 'Uruguay', 'Uruguay', 'Uruguai', 'Uruguay'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'UY')
UNION ALL
SELECT 'VN', 'Vietnam', 'Vietnam', 'Vietnã', 'Vietnam'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'VN');

-- Insert Activities
INSERT INTO activities (name_en, name_es, name_pt, name_ro, category)
SELECT 'Bachata Dancing', 'Baile Bachata', 'Dança Bachata', 'Dans Bachata', 'dance'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Bachata Dancing')
UNION ALL
SELECT 'Classical Dancing', 'Baile Clásico', 'Dança Clássica', 'Dans Clasic', 'dance'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Classical Dancing')
UNION ALL
SELECT 'Ballroom Dancing', 'Baile de Salón', 'Dança de Salão', 'Dans de Salon', 'dance'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Ballroom Dancing')
UNION ALL
SELECT 'Rock & Roll Dancing', 'Baile Rock & Roll', 'Dança Rock & Roll', 'Dans Rock & Roll', 'dance'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Rock & Roll Dancing')
UNION ALL
SELECT 'Salsa Dancing', 'Baile Salsa', 'Dança Salsa', 'Dans Salsa', 'dance'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Salsa Dancing')
UNION ALL
SELECT 'Tango Dancing', 'Baile Tango', 'Dança Tango', 'Dans Tango', 'dance'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Tango Dancing')
UNION ALL
SELECT 'Ballet & Dance', 'Ballet & Danza', 'Ballet e Dança', 'Balet și Dans', 'dance'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Ballet & Dance')
UNION ALL
SELECT 'Relaxing Yoga', 'Yoga Relax', 'Yoga Relaxante', 'Yoga Relaxant', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Relaxing Yoga')
UNION ALL
SELECT 'Spanish Cooking Workshop', 'Taller Cocina Española', 'Workshop de Culinária Espanhola', 'Atelier de Gătit Spaniol', 'culinary'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Spanish Cooking Workshop')
UNION ALL
SELECT 'Hiking', 'Senderismo', 'Caminhadas', 'Drumeții', 'outdoor'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Hiking')
UNION ALL
SELECT 'Spa & Massage', 'Spa & Masaje', 'Spa e Massagem', 'Spa și Masaj', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Spa & Massage')
UNION ALL
SELECT 'Wine Tasting', 'Cata de Vinos', 'Degustação de Vinhos', 'Degustare de Vinuri', 'culinary'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Wine Tasting')
UNION ALL
SELECT 'Fitness', 'Fitness', 'Fitness', 'Fitness', 'sports'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Fitness')
UNION ALL
SELECT 'Meditation', 'Meditación', 'Meditação', 'Meditație', 'wellness'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Meditation')
UNION ALL
SELECT 'Live Music', 'Música en Vivo', 'Música ao Vivo', 'Muzică Live', 'entertainment'
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name_en = 'Live Music');