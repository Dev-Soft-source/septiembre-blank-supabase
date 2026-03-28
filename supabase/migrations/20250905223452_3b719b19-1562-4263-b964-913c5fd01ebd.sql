-- Insert Countries safely (check first)
DO $$
DECLARE
    country_record RECORD;
    countries_data CONSTANT TEXT[][] := ARRAY[
        ['AR', 'Argentina', 'Argentina', 'Argentina', 'Argentina'],
        ['AU', 'Australia', 'Australia', 'Australia', 'Australia'],
        ['AT', 'Austria', 'Austria', 'Austria', 'Austria'],
        ['BE', 'Belgium', 'Bélgica', 'Bélgica', 'Belgia'],
        ['BR', 'Brazil', 'Brasil', 'Brasil', 'Brazilia'],
        ['BG', 'Bulgaria', 'Bulgaria', 'Bulgária', 'Bulgaria'],
        ['CA', 'Canada', 'Canadá', 'Canadá', 'Canada'],
        ['CO', 'Colombia', 'Colombia', 'Colômbia', 'Columbia'],
        ['CR', 'Costa Rica', 'Costa Rica', 'Costa Rica', 'Costa Rica'],
        ['HR', 'Croatia', 'Croacia', 'Croácia', 'Croația'],
        ['CZ', 'Czech Republic', 'República Checa', 'República Tcheca', 'Republica Cehă'],
        ['DK', 'Denmark', 'Dinamarca', 'Dinamarca', 'Danemarca'],
        ['DO', 'Dominican Republic', 'República Dominicana', 'República Dominicana', 'Republica Dominicană'],
        ['EC', 'Ecuador', 'Ecuador', 'Equador', 'Ecuador'],
        ['EG', 'Egypt', 'Egipto', 'Egito', 'Egipt'],
        ['EE', 'Estonia', 'Estonia', 'Estônia', 'Estonia'],
        ['FI', 'Finland', 'Finlandia', 'Finlândia', 'Finlanda'],
        ['FR', 'France', 'Francia', 'França', 'Franța'],
        ['GE', 'Georgia', 'Georgia', 'Geórgia', 'Georgia'],
        ['DE', 'Germany', 'Alemania', 'Alemanha', 'Germania'],
        ['GR', 'Greece', 'Grecia', 'Grécia', 'Grecia'],
        ['HU', 'Hungary', 'Hungría', 'Hungria', 'Ungaria'],
        ['IS', 'Iceland', 'Islandia', 'Islândia', 'Islanda'],
        ['ID', 'Indonesia', 'Indonesia', 'Indonésia', 'Indonezia'],
        ['IE', 'Ireland', 'Irlanda', 'Irlanda', 'Irlanda'],
        ['IT', 'Italy', 'Italia', 'Itália', 'Italia'],
        ['JP', 'Japan', 'Japón', 'Japão', 'Japonia'],
        ['KZ', 'Kazakhstan', 'Kazajistán', 'Cazaquistão', 'Kazahstan'],
        ['KR', 'South Korea', 'Corea del Sur', 'Coreia do Sul', 'Coreea de Sud'],
        ['LV', 'Latvia', 'Letonia', 'Letônia', 'Letonia'],
        ['LT', 'Lithuania', 'Lituania', 'Lituânia', 'Lituania'],
        ['LU', 'Luxembourg', 'Luxemburgo', 'Luxemburgo', 'Luxemburg'],
        ['MY', 'Malaysia', 'Malasia', 'Malásia', 'Malaezia'],
        ['MT', 'Malta', 'Malta', 'Malta', 'Malta'],
        ['MX', 'Mexico', 'México', 'México', 'Mexic'],
        ['MA', 'Morocco', 'Marruecos', 'Marrocos', 'Maroc'],
        ['NL', 'Netherlands', 'Países Bajos', 'Países Baixos', 'Țările de Jos'],
        ['NZ', 'New Zealand', 'Nueva Zelanda', 'Nova Zelândia', 'Noua Zeelandă'],
        ['NO', 'Norway', 'Noruega', 'Noruega', 'Norvegia'],
        ['PA', 'Panama', 'Panamá', 'Panamá', 'Panama'],
        ['PY', 'Paraguay', 'Paraguay', 'Paraguai', 'Paraguay'],
        ['PE', 'Peru', 'Perú', 'Peru', 'Peru'],
        ['PH', 'Philippines', 'Filipinas', 'Filipinas', 'Filipine'],
        ['PL', 'Poland', 'Polonia', 'Polônia', 'Polonia'],
        ['PT', 'Portugal', 'Portugal', 'Portugal', 'Portugalia'],
        ['RO', 'Romania', 'Rumania', 'Romênia', 'România'],
        ['SG', 'Singapore', 'Singapur', 'Singapura', 'Singapore'],
        ['SK', 'Slovakia', 'Eslovaquia', 'Eslováquia', 'Slovacia'],
        ['ES', 'Spain', 'España', 'Espanha', 'Spania'],
        ['LK', 'Sri Lanka', 'Sri Lanka', 'Sri Lanka', 'Sri Lanka'],
        ['SE', 'Sweden', 'Suecia', 'Suécia', 'Suedia'],
        ['CH', 'Switzerland', 'Suiza', 'Suíça', 'Elveția'],
        ['TW', 'Taiwan', 'Taiwán', 'Taiwan', 'Taiwan'],
        ['TH', 'Thailand', 'Tailandia', 'Tailândia', 'Thailanda'],
        ['TR', 'Turkey', 'Turquía', 'Turquia', 'Turcia'],
        ['AE', 'United Arab Emirates', 'Emiratos Árabes Unidos', 'Emirados Árabes Unidos', 'Emiratele Arabe Unite'],
        ['GB', 'United Kingdom', 'Reino Unido', 'Reino Unido', 'Regatul Unit'],
        ['US', 'United States', 'Estados Unidos', 'Estados Unidos', 'Statele Unite'],
        ['UY', 'Uruguay', 'Uruguay', 'Uruguai', 'Uruguay'],
        ['VN', 'Vietnam', 'Vietnam', 'Vietnã', 'Vietnam']
    ];
BEGIN
    FOREACH country_record IN ARRAY countries_data LOOP
        INSERT INTO countries (iso_code, name_en, name_es, name_pt, name_ro)
        SELECT country_record[1], country_record[2], country_record[3], country_record[4], country_record[5]
        WHERE NOT EXISTS (
            SELECT 1 FROM countries WHERE iso_code = country_record[1]
        );
    END LOOP;
END $$;

-- Insert Activities safely
DO $$
DECLARE
    activity_record RECORD;
    activities_data CONSTANT TEXT[][] := ARRAY[
        ['Bachata Dancing', 'Baile Bachata', 'Dança Bachata', 'Dans Bachata', 'dance'],
        ['Classical Dancing', 'Baile Clásico', 'Dança Clássica', 'Dans Clasic', 'dance'],
        ['Ballroom Dancing', 'Baile de Salón', 'Dança de Salão', 'Dans de Salon', 'dance'],
        ['Rock & Roll Dancing', 'Baile Rock & Roll', 'Dança Rock & Roll', 'Dans Rock & Roll', 'dance'],
        ['Salsa Dancing', 'Baile Salsa', 'Dança Salsa', 'Dans Salsa', 'dance'],
        ['Tango Dancing', 'Baile Tango', 'Dança Tango', 'Dans Tango', 'dance'],
        ['Ballet & Dance', 'Ballet & Danza', 'Ballet e Dança', 'Balet și Dans', 'dance'],
        ['Relaxing Yoga', 'Yoga Relax', 'Yoga Relaxante', 'Yoga Relaxant', 'wellness'],
        ['Spanish Cooking Workshop', 'Taller Cocina Española', 'Workshop de Culinária Espanhola', 'Atelier de Gătit Spaniol', 'culinary'],
        ['Hiking', 'Senderismo', 'Caminhadas', 'Drumeții', 'outdoor'],
        ['Spa & Massage', 'Spa & Masaje', 'Spa e Massagem', 'Spa și Masaj', 'wellness'],
        ['Wine Tasting', 'Cata de Vinos', 'Degustação de Vinhos', 'Degustare de Vinuri', 'culinary'],
        ['Fitness', 'Fitness', 'Fitness', 'Fitness', 'sports'],
        ['Meditation', 'Meditación', 'Meditação', 'Meditație', 'wellness'],
        ['Live Music', 'Música en Vivo', 'Música ao Vivo', 'Muzică Live', 'entertainment']
    ];
BEGIN
    FOREACH activity_record IN ARRAY activities_data LOOP
        INSERT INTO activities (name_en, name_es, name_pt, name_ro, category)
        SELECT activity_record[1], activity_record[2], activity_record[3], activity_record[4], activity_record[5]
        WHERE NOT EXISTS (
            SELECT 1 FROM activities WHERE name_en = activity_record[1]
        );
    END LOOP;
END $$;