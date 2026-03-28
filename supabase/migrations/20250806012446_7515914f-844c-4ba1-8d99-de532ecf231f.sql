-- Add missing hotel feature translations for raw database keys that don't exist yet
INSERT INTO filter_value_mappings (category, english_value, spanish_value, portuguese_value, romanian_value, is_active) VALUES
-- Hotel Features (only new ones)
('hotel_features', 'Concierge', 'Conserjería', 'Concierge', 'Concierge', true),
('hotel_features', 'Courtyard', 'Patio', 'Pátio', 'Curte', true),
('hotel_features', 'Historic_tour', 'Tour histórico', 'Tour histórico', 'Tur istoric', true),
('hotel_features', 'Valet_parking', 'Aparcacoches', 'Valet parking', 'Parcare cu valet', true),
('hotel_features', 'Business_center', 'Centro de negocios', 'Centro de negócios', 'Centru de afaceri', true),
('hotel_features', 'Conference_room', 'Sala de conferencias', 'Sala de conferências', 'Sală de conferințe', true),
('hotel_features', 'Laundry_service', 'Servicio de lavandería', 'Serviço de lavanderia', 'Serviciu de spălătorie', true),
('hotel_features', 'Room_service', 'Servicio de habitaciones', 'Serviço de quarto', 'Serviciul de cameră', true),
('hotel_features', 'Reception_24h', 'Recepción 24h', 'Recepção 24h', 'Recepție 24h', true),
('hotel_features', 'Library', 'Biblioteca', 'Biblioteca', 'Bibliotecă', true),
('hotel_features', 'Game_area', 'Zona de juegos', 'Área de jogos', 'Zonă de jocuri', true),
('hotel_features', 'Transport_service', 'Servicio de transporte', 'Serviço de transporte', 'Serviciu de transport', true),
('hotel_features', 'Bike_rental', 'Alquiler de bicicletas', 'Aluguel de bicicletas', 'Închiriere biciclete', true),
('hotel_features', 'Pets_allowed', 'Mascotas permitidas', 'Animais permitidos', 'Animale de companie permise', true),

-- Room Features (only new ones)
('room_features', 'Work_desk', 'Escritorio', 'Mesa de trabalho', 'Birou de lucru', true),
('room_features', 'Coffee_maker', 'Cafetera', 'Máquina de café', 'Expresor de cafea', true),
('room_features', 'Air_conditioning', 'Aire acondicionado', 'Ar condicionado', 'Aer condiționat', true),
('room_features', 'Period_furniture', 'Mobiliario de época', 'Móveis de época', 'Mobilier de epocă', true),
('room_features', 'Private_bathroom', 'Baño privado', 'Banheiro privado', 'Baie privată', true),
('room_features', 'WiFi', 'WiFi', 'WiFi', 'WiFi', true),
('room_features', 'Iron_ironing_board', 'Plancha y tabla de planchar', 'Ferro e tábua de passar', 'Fier de călcat și masă de călcat', true),
('room_features', 'Workspace', 'Zona de trabajo', 'Espaço de trabalho', 'Spațiu de lucru', true)

ON CONFLICT (category, english_value) DO NOTHING;