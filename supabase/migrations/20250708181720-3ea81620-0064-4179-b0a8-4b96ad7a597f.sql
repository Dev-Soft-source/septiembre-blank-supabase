-- Add missing meal plan options
INSERT INTO public.filters (category, value, source_type, is_active) VALUES
('meal_plans', 'Servicio lavandería incluida', 'manual', true),
('meal_plans', 'Servicio lavandería exterior', 'manual', true)
ON CONFLICT DO NOTHING;

-- Add comprehensive hotel features from JotForm
INSERT INTO public.filters (category, value, source_type, is_active) VALUES
('hotel_features', 'Piscina', 'manual', true),
('hotel_features', 'Gimnasio', 'manual', true),
('hotel_features', 'Spa', 'manual', true),
('hotel_features', 'Restaurante', 'manual', true),
('hotel_features', 'Bar', 'manual', true),
('hotel_features', 'WiFi', 'manual', true),
('hotel_features', 'Parking', 'manual', true),
('hotel_features', 'Aire acondicionado', 'manual', true),
('hotel_features', 'Servicio de habitaciones', 'manual', true),
('hotel_features', 'Recepción 24h', 'manual', true),
('hotel_features', 'Servicio de lavandería', 'manual', true),
('hotel_features', 'Centro de negocios', 'manual', true),
('hotel_features', 'Sala de conferencias', 'manual', true),
('hotel_features', 'Ascensor', 'manual', true),
('hotel_features', 'Jardín', 'manual', true),
('hotel_features', 'Terraza', 'manual', true),
('hotel_features', 'Biblioteca', 'manual', true),
('hotel_features', 'Zona de juegos', 'manual', true),
('hotel_features', 'Servicio de transporte', 'manual', true),
('hotel_features', 'Alquiler de bicicletas', 'manual', true),
('hotel_features', 'Mascotas permitidas', 'manual', true)
ON CONFLICT DO NOTHING;

-- Add comprehensive room features from JotForm
INSERT INTO public.filters (category, value, source_type, is_active) VALUES
('room_features', 'Balcón', 'manual', true),
('room_features', 'Cocina', 'manual', true),
('room_features', 'Zona de trabajo', 'manual', true),
('room_features', 'TV', 'manual', true),
('room_features', 'Minibar', 'manual', true),
('room_features', 'Caja fuerte', 'manual', true),
('room_features', 'Baño privado', 'manual', true),
('room_features', 'Ducha', 'manual', true),
('room_features', 'Bañera', 'manual', true),
('room_features', 'Secador de pelo', 'manual', true),
('room_features', 'Plancha y tabla de planchar', 'manual', true),
('room_features', 'Cafetera/Tetera', 'manual', true),
('room_features', 'Frigorífico', 'manual', true),
('room_features', 'Microondas', 'manual', true),
('room_features', 'Lavavajillas', 'manual', true),
('room_features', 'Armario', 'manual', true),
('room_features', 'Escritorio', 'manual', true),
('room_features', 'Sofá', 'manual', true),
('room_features', 'Vistas al mar', 'manual', true),
('room_features', 'Vistas a la montaña', 'manual', true),
('room_features', 'Vistas al jardín', 'manual', true)
ON CONFLICT DO NOTHING;

-- Add English translations for meal plans
INSERT INTO public.filter_value_mappings (category, spanish_value, english_value, is_active) VALUES
('meal_plans', 'Solo alojamiento', 'Accommodation Only', true),
('meal_plans', 'Desayuno', 'Breakfast Included', true),
('meal_plans', 'Media pensión', 'Half Board', true),
('meal_plans', 'Pensión completa', 'Full Board', true),
('meal_plans', 'Servicio lavandería incluida', 'Laundry Service Included', true),
('meal_plans', 'Servicio lavandería exterior', 'External Laundry Service', true)
ON CONFLICT DO NOTHING;

-- Add English translations for hotel features
INSERT INTO public.filter_value_mappings (category, spanish_value, english_value, is_active) VALUES
('hotel_features', 'Piscina', 'Pool', true),
('hotel_features', 'Gimnasio', 'Gym', true),
('hotel_features', 'Spa', 'Spa', true),
('hotel_features', 'Restaurante', 'Restaurant', true),
('hotel_features', 'Bar', 'Bar', true),
('hotel_features', 'WiFi', 'WiFi', true),
('hotel_features', 'Parking', 'Parking', true),
('hotel_features', 'Aire acondicionado', 'Air Conditioning', true),
('hotel_features', 'Servicio de habitaciones', 'Room Service', true),
('hotel_features', 'Recepción 24h', '24h Reception', true),
('hotel_features', 'Servicio de lavandería', 'Laundry Service', true),
('hotel_features', 'Centro de negocios', 'Business Center', true),
('hotel_features', 'Sala de conferencias', 'Conference Room', true),
('hotel_features', 'Ascensor', 'Elevator', true),
('hotel_features', 'Jardín', 'Garden', true),
('hotel_features', 'Terraza', 'Terrace', true),
('hotel_features', 'Biblioteca', 'Library', true),
('hotel_features', 'Zona de juegos', 'Game Area', true),
('hotel_features', 'Servicio de transporte', 'Transport Service', true),
('hotel_features', 'Alquiler de bicicletas', 'Bike Rental', true),
('hotel_features', 'Mascotas permitidas', 'Pets Allowed', true)
ON CONFLICT DO NOTHING;

-- Add English translations for room features
INSERT INTO public.filter_value_mappings (category, spanish_value, english_value, is_active) VALUES
('room_features', 'Balcón', 'Balcony', true),
('room_features', 'Cocina', 'Kitchen', true),
('room_features', 'Zona de trabajo', 'Workspace', true),
('room_features', 'TV', 'TV', true),
('room_features', 'Minibar', 'Minibar', true),
('room_features', 'Caja fuerte', 'Safe', true),
('room_features', 'Baño privado', 'Private Bathroom', true),
('room_features', 'Ducha', 'Shower', true),
('room_features', 'Bañera', 'Bathtub', true),
('room_features', 'Secador de pelo', 'Hair Dryer', true),
('room_features', 'Plancha y tabla de planchar', 'Iron & Ironing Board', true),
('room_features', 'Cafetera/Tetera', 'Coffee/Tea Maker', true),
('room_features', 'Frigorífico', 'Refrigerator', true),
('room_features', 'Microondas', 'Microwave', true),
('room_features', 'Lavavajillas', 'Dishwasher', true),
('room_features', 'Armario', 'Wardrobe', true),
('room_features', 'Escritorio', 'Desk', true),
('room_features', 'Sofá', 'Sofa', true),
('room_features', 'Vistas al mar', 'Sea View', true),
('room_features', 'Vistas a la montaña', 'Mountain View', true),
('room_features', 'Vistas al jardín', 'Garden View', true)
ON CONFLICT DO NOTHING;