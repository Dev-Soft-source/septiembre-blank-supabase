-- Insert Countries data (first batch - 25 countries)
INSERT INTO countries (iso_code, name_en, name_es, name_pt, name_ro)
SELECT 'AR', 'Argentina', 'Argentina', 'Argentina', 'Argentina'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'AR')
UNION ALL
SELECT 'AU', 'Australia', 'Australia', 'Australia', 'Australia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'AU')
UNION ALL
SELECT 'AT', 'Austria', 'Austria', 'Austria', 'Austria'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'AT')
UNION ALL
SELECT 'BE', 'Belgium', 'Bélgica', 'Bélgica', 'Belgia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'BE')
UNION ALL
SELECT 'BR', 'Brazil', 'Brasil', 'Brasil', 'Brazilia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'BR')
UNION ALL
SELECT 'BG', 'Bulgaria', 'Bulgaria', 'Bulgária', 'Bulgaria'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'BG')
UNION ALL
SELECT 'CA', 'Canada', 'Canadá', 'Canadá', 'Canada'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'CA')
UNION ALL
SELECT 'CO', 'Colombia', 'Colombia', 'Colômbia', 'Columbia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'CO')
UNION ALL
SELECT 'CR', 'Costa Rica', 'Costa Rica', 'Costa Rica', 'Costa Rica'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'CR')
UNION ALL
SELECT 'HR', 'Croatia', 'Croacia', 'Croácia', 'Croația'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'HR')
UNION ALL
SELECT 'CZ', 'Czech Republic', 'República Checa', 'República Tcheca', 'Republica Cehă'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'CZ')
UNION ALL
SELECT 'DK', 'Denmark', 'Dinamarca', 'Dinamarca', 'Danemarca'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'DK')
UNION ALL
SELECT 'DO', 'Dominican Republic', 'República Dominicana', 'República Dominicana', 'Republica Dominicană'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'DO')
UNION ALL
SELECT 'EC', 'Ecuador', 'Ecuador', 'Equador', 'Ecuador'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'EC')
UNION ALL
SELECT 'EG', 'Egypt', 'Egipto', 'Egito', 'Egipt'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'EG')
UNION ALL
SELECT 'EE', 'Estonia', 'Estonia', 'Estônia', 'Estonia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'EE')
UNION ALL
SELECT 'FI', 'Finland', 'Finlandia', 'Finlândia', 'Finlanda'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'FI')
UNION ALL
SELECT 'FR', 'France', 'Francia', 'França', 'Franța'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'FR')
UNION ALL
SELECT 'GE', 'Georgia', 'Georgia', 'Geórgia', 'Georgia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'GE')
UNION ALL
SELECT 'DE', 'Germany', 'Alemania', 'Alemanha', 'Germania'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'DE')
UNION ALL
SELECT 'GR', 'Greece', 'Grecia', 'Grécia', 'Grecia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'GR')
UNION ALL
SELECT 'HU', 'Hungary', 'Hungría', 'Hungria', 'Ungaria'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'HU')
UNION ALL
SELECT 'IS', 'Iceland', 'Islandia', 'Islândia', 'Islanda'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'IS')
UNION ALL
SELECT 'ID', 'Indonesia', 'Indonesia', 'Indonésia', 'Indonezia'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'ID')
UNION ALL
SELECT 'IE', 'Ireland', 'Irlanda', 'Irlanda', 'Irlanda'
WHERE NOT EXISTS (SELECT 1 FROM countries WHERE iso_code = 'IE');

-- Insert remaining countries and activities in next migration due to size limits