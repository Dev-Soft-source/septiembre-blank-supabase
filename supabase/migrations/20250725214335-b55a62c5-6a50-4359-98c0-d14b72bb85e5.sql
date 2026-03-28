-- Phase 1: Database Translation Setup
-- Insert English translations for the specific hotel
INSERT INTO hotel_translations (
  hotel_id,
  language_code,
  translated_name,
  translated_description,
  translated_ideal_guests,
  translated_atmosphere,
  translated_perfect_location,
  translation_status,
  auto_generated
) VALUES 
(
  'aed93b0e-b60e-4575-8683-ac8c9590f747',
  'en',
  'Hostal La Fuente',
  'A charming family-run hostel located in the heart of the historic center. Our traditional establishment offers comfortable accommodations with authentic local charm, perfect for travelers seeking an authentic cultural experience.',
  'Budget-conscious travelers, backpackers, cultural enthusiasts, and young professionals looking for authentic local experiences in a historic setting.',
  'Warm, welcoming, and family-oriented with a traditional Spanish charm. The atmosphere is relaxed and friendly, creating a home-away-from-home feeling for all guests.',
  'Exploring the historic center, walking to major attractions, experiencing local culture, and enjoying authentic Spanish cuisine in nearby traditional restaurants.',
  'completed',
  false
),
(
  'aed93b0e-b60e-4575-8683-ac8c9590f747',
  'pt',
  'Hostal La Fuente',
  'Um hostel encantador e familiar localizado no coração do centro histórico. Nosso estabelecimento tradicional oferece acomodações confortáveis com charme local autêntico, perfeito para viajantes que buscam uma experiência cultural autêntica.',
  'Viajantes econômicos, mochileiros, entusiastas culturais e jovens profissionais em busca de experiências locais autênticas em um ambiente histórico.',
  'Calorosa, acolhedora e familiar com charme espanhol tradicional. O ambiente é relaxado e amigável, criando uma sensação de lar longe de casa para todos os hóspedes.',
  'Explorar o centro histórico, caminhar até as principais atrações, vivenciar a cultura local e desfrutar da culinária espanhola autêntica em restaurantes tradicionais próximos.',
  'completed',
  false
),
(
  'aed93b0e-b60e-4575-8683-ac8c9590f747',
  'ro',
  'Hostal La Fuente',
  'Un hostel fermecător condus de o familie, situat în inima centrului istoric. Stabilimentul nostru tradițional oferă cazare confortabilă cu farmec local autentic, perfect pentru călătorii care caută o experiență culturală autentică.',
  'Călători conștienți de buget, backpackeri, pasionați de cultură și tineri profesioniști care caută experiențe locale autentice într-un cadru istoric.',
  'Caldă, primitoare și orientată spre familie, cu farmecul tradițional spaniol. Atmosfera este relaxată și prietenoasă, creând o senzație de acasă departe de casă pentru toți oaspeții.',
  'Explorarea centrului istoric, mersul pe jos către atracțiile principale, experimentarea culturii locale și bucuria din bucătăria spaniolă autentică în restaurantele tradiționale din apropiere.',
  'completed',
  false
);

-- Phase 2: Expand Filter Translation System
-- Add Portuguese and Romanian columns to filter_value_mappings
ALTER TABLE filter_value_mappings 
ADD COLUMN IF NOT EXISTS portuguese_value text,
ADD COLUMN IF NOT EXISTS romanian_value text;

-- Update existing mappings with Portuguese and Romanian translations
UPDATE filter_value_mappings SET 
  portuguese_value = CASE 
    WHEN english_value = 'Pool' THEN 'Piscina'
    WHEN english_value = 'Gym' THEN 'Academia'
    WHEN english_value = 'Spa' THEN 'Spa'
    WHEN english_value = 'Restaurant' THEN 'Restaurante'
    WHEN english_value = 'Bar' THEN 'Bar'
    WHEN english_value = 'WiFi' THEN 'WiFi'
    WHEN english_value = 'Parking' THEN 'Estacionamento'
    WHEN english_value = 'Air Conditioning' THEN 'Ar Condicionado'
    WHEN english_value = 'Room Service' THEN 'Serviço de Quarto'
    WHEN english_value = '24h Reception' THEN 'Recepção 24h'
    WHEN english_value = 'Laundry Service' THEN 'Serviço de Lavanderia'
    WHEN english_value = 'Business Center' THEN 'Centro de Negócios'
    WHEN english_value = 'Conference Room' THEN 'Sala de Conferências'
    WHEN english_value = 'Elevator' THEN 'Elevador'
    WHEN english_value = 'Garden' THEN 'Jardim'
    WHEN english_value = 'Terrace' THEN 'Terraço'
    WHEN english_value = 'Library' THEN 'Biblioteca'
    WHEN english_value = 'Game Area' THEN 'Área de Jogos'
    WHEN english_value = 'Transport Service' THEN 'Serviço de Transporte'
    WHEN english_value = 'Bike Rental' THEN 'Aluguel de Bicicletas'
    ELSE english_value
  END,
  romanian_value = CASE 
    WHEN english_value = 'Pool' THEN 'Piscină'
    WHEN english_value = 'Gym' THEN 'Sală de sport'
    WHEN english_value = 'Spa' THEN 'Spa'
    WHEN english_value = 'Restaurant' THEN 'Restaurant'
    WHEN english_value = 'Bar' THEN 'Bar'
    WHEN english_value = 'WiFi' THEN 'WiFi'
    WHEN english_value = 'Parking' THEN 'Parcare'
    WHEN english_value = 'Air Conditioning' THEN 'Aer condiționat'
    WHEN english_value = 'Room Service' THEN 'Serviciu în cameră'
    WHEN english_value = '24h Reception' THEN 'Recepție 24h'
    WHEN english_value = 'Laundry Service' THEN 'Serviciu de spălătorie'
    WHEN english_value = 'Business Center' THEN 'Centru de afaceri'
    WHEN english_value = 'Conference Room' THEN 'Sală de conferințe'
    WHEN english_value = 'Elevator' THEN 'Ascensor'
    WHEN english_value = 'Garden' THEN 'Grădină'
    WHEN english_value = 'Terrace' THEN 'Terasă'
    WHEN english_value = 'Library' THEN 'Bibliotecă'
    WHEN english_value = 'Game Area' THEN 'Zonă de jocuri'
    WHEN english_value = 'Transport Service' THEN 'Serviciu de transport'
    WHEN english_value = 'Bike Rental' THEN 'Închiriere biciclete'
    ELSE english_value
  END
WHERE category = 'hotel_features';

-- Add meal plan translations
INSERT INTO filter_value_mappings (category, english_value, spanish_value, portuguese_value, romanian_value, is_active) VALUES
('meal_plans', 'Room only', 'Solo alojamiento', 'Apenas acomodação', 'Doar cazare', true),
('meal_plans', 'Breakfast included', 'Desayuno', 'Café da manhã incluído', 'Mic dejun inclus', true),
('meal_plans', 'Half board', 'Media pensión', 'Meia pensão', 'Demipensiune', true),
('meal_plans', 'Full board', 'Pensión completa', 'Pensão completa', 'Pensiune completă', true),
('meal_plans', 'All inclusive', 'Todo incluido', 'Tudo incluído', 'Totul inclus', true)
ON CONFLICT (english_value, category) DO UPDATE SET
  spanish_value = EXCLUDED.spanish_value,
  portuguese_value = EXCLUDED.portuguese_value,
  romanian_value = EXCLUDED.romanian_value;