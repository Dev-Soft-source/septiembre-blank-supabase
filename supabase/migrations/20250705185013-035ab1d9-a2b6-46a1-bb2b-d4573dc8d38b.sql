-- Add missing filter categories that should come from JotForm
INSERT INTO filters (category, value, source_type) VALUES
-- Meal Plans
('meal_plans', 'Solo alojamiento', 'manual'),
('meal_plans', 'Desayuno incluido', 'manual'),
('meal_plans', 'Media pensión', 'manual'),
('meal_plans', 'Pensión completa', 'manual'),

-- Room Types
('room_types', 'Habitación individual', 'manual'),
('room_types', 'Habitación doble', 'manual'),
('room_types', 'Apartamento', 'manual'),
('room_types', 'Suite', 'manual'),
('room_types', 'Estudio', 'manual'),

-- Hotel Features
('hotel_features', 'Piscina', 'manual'),
('hotel_features', 'WiFi gratuito', 'manual'),
('hotel_features', 'Gimnasio', 'manual'),
('hotel_features', 'Restaurante', 'manual'),
('hotel_features', 'Bar', 'manual'),
('hotel_features', 'Spa', 'manual'),
('hotel_features', 'Parking', 'manual'),
('hotel_features', 'Aire acondicionado', 'manual'),
('hotel_features', 'Recepción 24h', 'manual'),
('hotel_features', 'Servicio de limpieza', 'manual'),

-- Room Features
('room_features', 'Baño privado', 'manual'),
('room_features', 'Cocina equipada', 'manual'),
('room_features', 'Balcón', 'manual'),
('room_features', 'Vista al mar', 'manual'),
('room_features', 'TV', 'manual'),
('room_features', 'Minibar', 'manual'),
('room_features', 'Escritorio', 'manual'),
('room_features', 'Caja fuerte', 'manual'),

-- Property Styles
('property_styles', 'Moderno', 'manual'),
('property_styles', 'Clásico', 'manual'),
('property_styles', 'Boutique', 'manual'),
('property_styles', 'Familiar', 'manual'),
('property_styles', 'Luxury', 'manual'),
('property_styles', 'Rústico', 'manual'),
('property_styles', 'Minimalista', 'manual');