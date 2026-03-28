-- Insert remaining countries (batch 2)
INSERT INTO countries (iso_code, name_en, name_es, name_pt, name_ro)
SELECT 'IT', 'Italy', 'Italia', 'Itália', 'Italia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'IT')
UNION ALL
SELECT 'JP', 'Japan', 'Japón', 'Japão', 'Japonia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'JP')
UNION ALL
SELECT 'KZ', 'Kazakhstan', 'Kazajistán', 'Cazaquistão', 'Kazahstan'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'KZ')
UNION ALL
SELECT 'KR', 'South Korea', 'Corea del Sur', 'Coreia do Sul', 'Coreea de Sud'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'KR')
UNION ALL
SELECT 'LV', 'Latvia', 'Letonia', 'Letônia', 'Letonia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'LV')
UNION ALL
SELECT 'LT', 'Lithuania', 'Lituania', 'Lituânia', 'Lituania'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'LT')
UNION ALL
SELECT 'LU', 'Luxembourg', 'Luxemburgo', 'Luxemburgo', 'Luxemburg'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'LU')
UNION ALL
SELECT 'MY', 'Malaysia', 'Malasia', 'Malásia', 'Malaezia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'MY')
UNION ALL
SELECT 'MT', 'Malta', 'Malta', 'Malta', 'Malta'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'MT')
UNION ALL
SELECT 'MX', 'Mexico', 'México', 'México', 'Mexic'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'MX')
UNION ALL
SELECT 'MA', 'Morocco', 'Marruecos', 'Marrocos', 'Maroc'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'MA')
UNION ALL
SELECT 'NL', 'Netherlands', 'Países Bajos', 'Países Baixos', 'Țările de Jos'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'NL')
UNION ALL
SELECT 'NZ', 'New Zealand', 'Nueva Zelanda', 'Nova Zelândia', 'Noua Zeelandă'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'NZ')
UNION ALL
SELECT 'NO', 'Norway', 'Noruega', 'Noruega', 'Norvegia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'NO')
UNION ALL
SELECT 'PA', 'Panama', 'Panamá', 'Panamá', 'Panama'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'PA')
UNION ALL
SELECT 'PY', 'Paraguay', 'Paraguay', 'Paraguai', 'Paraguay'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'PY')
UNION ALL
SELECT 'PE', 'Peru', 'Perú', 'Peru', 'Peru'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'PE')
UNION ALL
SELECT 'PH', 'Philippines', 'Filipinas', 'Filipinas', 'Filipine'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'PH')
UNION ALL
SELECT 'PL', 'Poland', 'Polonia', 'Polônia', 'Polonia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'PL')
UNION ALL
SELECT 'PT', 'Portugal', 'Portugal', 'Portugal', 'Portugalia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'PT')
UNION ALL
SELECT 'RO', 'Romania', 'Rumania', 'Romênia', 'România'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'RO')
UNION ALL
SELECT 'SG', 'Singapore', 'Singapur', 'Singapura', 'Singapore'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'SG')
UNION ALL
SELECT 'SK', 'Slovakia', 'Eslovaquia', 'Eslováquia', 'Slovacia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'SK')
UNION ALL
SELECT 'ES', 'Spain', 'España', 'Espanha', 'Spania'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'ES')
UNION ALL
SELECT 'LK', 'Sri Lanka', 'Sri Lanka', 'Sri Lanka', 'Sri Lanka'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'LK');