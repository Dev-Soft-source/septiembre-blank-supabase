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

-- Phase 2: Add meal plan translations  
INSERT INTO filter_value_mappings (category, english_value, spanish_value, portuguese_value, romanian_value, is_active) VALUES
('meal_plans', 'Room only', 'Solo alojamiento', 'Apenas acomodação', 'Doar cazare', true),
('meal_plans', 'Breakfast included', 'Desayuno', 'Café da manhã incluído', 'Mic dejun inclus', true),
('meal_plans', 'Half board', 'Media pensión', 'Meia pensão', 'Demipensiune', true),
('meal_plans', 'Full board', 'Pensión completa', 'Pensão completa', 'Pensiune completă', true),
('meal_plans', 'All inclusive', 'Todo incluido', 'Tudo incluído', 'Totul inclus', true)
ON CONFLICT DO NOTHING;