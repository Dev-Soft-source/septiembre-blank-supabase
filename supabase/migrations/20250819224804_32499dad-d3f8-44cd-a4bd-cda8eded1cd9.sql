-- Phase 1: Complete Database Translation Completion
-- Add missing Portuguese and Romanian translations for hotel_features

UPDATE filter_value_mappings 
SET 
  portuguese_value = CASE 
    WHEN english_value = 'Beach Access' THEN 'Acesso à Praia'
    WHEN english_value = 'Pet Friendly' THEN 'Aceita Animais'
    WHEN english_value = 'Elevator' THEN 'Elevador'
    WHEN english_value = 'Bar' THEN 'Bar'
    WHEN english_value = 'Library' THEN 'Biblioteca'
    WHEN english_value = 'Hotel Safe' THEN 'Cofre do Hotel'
    WHEN english_value = 'Business Center' THEN 'Centro de Negócios'
    WHEN english_value = 'Parking' THEN 'Estacionamento'
    WHEN english_value = 'Gym' THEN 'Ginásio'
    WHEN english_value = 'Pool' THEN 'Piscina'
    WHEN english_value = 'Restaurant' THEN 'Restaurante'
    WHEN english_value = 'Game Room' THEN 'Sala de Jogos'
    WHEN english_value = 'Conference Rooms' THEN 'Salas de Conferência'
    WHEN english_value = 'Room Service' THEN 'Serviço de Quartos'
    WHEN english_value = 'Security Service' THEN 'Serviço de Segurança'
    WHEN english_value = 'Spa' THEN 'Spa'
    WHEN english_value = 'Terrace' THEN 'Terraço'
    WHEN english_value = 'Airport Transfer' THEN 'Transfer para Aeroporto'
    WHEN english_value = 'WiFi in Common Areas' THEN 'WiFi em Áreas Comuns'
    WHEN english_value = 'Free WiFi' THEN 'WiFi Grátis'
    WHEN english_value = 'BBQ Area' THEN 'Área de Churrasco'
  END,
  romanian_value = CASE 
    WHEN english_value = 'Beach Access' THEN 'Acces la Plajă'
    WHEN english_value = 'Pet Friendly' THEN 'Prietenos cu Animalele'
    WHEN english_value = 'Elevator' THEN 'Lift'
    WHEN english_value = 'Bar' THEN 'Bar'
    WHEN english_value = 'Library' THEN 'Bibliotecă'
    WHEN english_value = 'Hotel Safe' THEN 'Seif Hotel'
    WHEN english_value = 'Business Center' THEN 'Centru de Afaceri'
    WHEN english_value = 'Parking' THEN 'Parcare'
    WHEN english_value = 'Gym' THEN 'Sala de Fitness'
    WHEN english_value = 'Pool' THEN 'Piscină'
    WHEN english_value = 'Restaurant' THEN 'Restaurant'
    WHEN english_value = 'Game Room' THEN 'Sală de Jocuri'
    WHEN english_value = 'Conference Rooms' THEN 'Săli de Conferință'
    WHEN english_value = 'Room Service' THEN 'Serviciu în Cameră'
    WHEN english_value = 'Security Service' THEN 'Serviciu de Securitate'
    WHEN english_value = 'Spa' THEN 'Spa'
    WHEN english_value = 'Terrace' THEN 'Terasă'
    WHEN english_value = 'Airport Transfer' THEN 'Transfer Aeroport'
    WHEN english_value = 'WiFi in Common Areas' THEN 'WiFi în Zone Comune'
    WHEN english_value = 'Free WiFi' THEN 'WiFi Gratuit'
    WHEN english_value = 'BBQ Area' THEN 'Zonă BBQ'
  END
WHERE category = 'hotel_features' AND is_active = true;

-- Add missing Portuguese and Romanian translations for room_features
UPDATE filter_value_mappings 
SET 
  portuguese_value = CASE 
    WHEN english_value = 'Air Conditioning' THEN 'Ar Condicionado'
    WHEN english_value = 'Safe' THEN 'Cofre'
    WHEN english_value = 'Fireplace' THEN 'Lareira'
    WHEN english_value = 'Blackout Curtains' THEN 'Cortinas Blackout'
    WHEN english_value = 'Shower' THEN 'Chuveiro'
    WHEN english_value = 'Walk-in Shower' THEN 'Chuveiro Walk-in'
    WHEN english_value = 'Desk' THEN 'Escritório'
    WHEN english_value = 'Water Kettle' THEN 'Chaleira'
    WHEN english_value = 'Soundproof' THEN 'À Prova de Som'
    WHEN english_value = 'High-Speed Internet' THEN 'Internet de Alta Velocidade'
    WHEN english_value = 'Microwave' THEN 'Microondas'
    WHEN english_value = 'Mini Bar' THEN 'Minibar'
    WHEN english_value = 'Iron' THEN 'Ferro de Passar'
    WHEN english_value = 'Hair Dryer' THEN 'Secador de Cabelo'
    WHEN english_value = 'TV' THEN 'TV'
    WHEN english_value = 'City View' THEN 'Vista da Cidade'
    WHEN english_value = 'Sea View' THEN 'Vista do Mar'
    WHEN english_value = 'WiFi' THEN 'WiFi'
  END,
  romanian_value = CASE 
    WHEN english_value = 'Air Conditioning' THEN 'Aer Condiționat'
    WHEN english_value = 'Safe' THEN 'Seif'
    WHEN english_value = 'Fireplace' THEN 'Șemineu'
    WHEN english_value = 'Blackout Curtains' THEN 'Perdele Opace'
    WHEN english_value = 'Shower' THEN 'Duș'
    WHEN english_value = 'Walk-in Shower' THEN 'Duș Walk-in'
    WHEN english_value = 'Desk' THEN 'Birou'
    WHEN english_value = 'Water Kettle' THEN 'Fierbător'
    WHEN english_value = 'Soundproof' THEN 'Insonorizat'
    WHEN english_value = 'High-Speed Internet' THEN 'Internet de Mare Viteză'
    WHEN english_value = 'Microwave' THEN 'Cuptor cu Microunde'
    WHEN english_value = 'Mini Bar' THEN 'Minibar'
    WHEN english_value = 'Iron' THEN 'Fier de Călcat'
    WHEN english_value = 'Hair Dryer' THEN 'Uscător de Păr'
    WHEN english_value = 'TV' THEN 'TV'
    WHEN english_value = 'City View' THEN 'Vedere la Oraș'
    WHEN english_value = 'Sea View' THEN 'Vedere la Mare'
    WHEN english_value = 'WiFi' THEN 'WiFi'
  END
WHERE category = 'room_features' AND is_active = true;

-- Add missing Portuguese and Romanian translations for property_styles
UPDATE filter_value_mappings 
SET 
  portuguese_value = CASE 
    WHEN english_value = 'Classic' THEN 'Clássico'
    WHEN english_value = 'Classic Elegant' THEN 'Clássico Elegante'
    WHEN english_value = 'Modern' THEN 'Moderno'
    WHEN english_value = 'Fusion' THEN 'Fusão'
    WHEN english_value = 'Urban' THEN 'Urbano'
    WHEN english_value = 'Minimalist' THEN 'Minimalista'
    WHEN english_value = 'Luxury' THEN 'Luxo'
    WHEN english_value = 'Rural' THEN 'Rural'
  END,
  romanian_value = CASE 
    WHEN english_value = 'Classic' THEN 'Clasic'
    WHEN english_value = 'Classic Elegant' THEN 'Clasic Elegant'
    WHEN english_value = 'Modern' THEN 'Modern'
    WHEN english_value = 'Fusion' THEN 'Fuziune'
    WHEN english_value = 'Urban' THEN 'Urban'
    WHEN english_value = 'Minimalist' THEN 'Minimalist'
    WHEN english_value = 'Luxury' THEN 'Lux'
    WHEN english_value = 'Rural' THEN 'Rural'
  END
WHERE category = 'property_styles' AND is_active = true;

-- Add missing Portuguese and Romanian translations for room_types  
UPDATE filter_value_mappings 
SET 
  portuguese_value = CASE 
    WHEN english_value = 'Single Room' THEN 'Quarto Individual'
    WHEN english_value = 'Double Room' THEN 'Quarto Duplo'
  END,
  romanian_value = CASE 
    WHEN english_value = 'Single Room' THEN 'Cameră Individuală'
    WHEN english_value = 'Double Room' THEN 'Cameră Dublă'
  END
WHERE category = 'room_types' AND is_active = true;