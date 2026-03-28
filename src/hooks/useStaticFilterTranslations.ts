import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/useTranslation";

interface FilterOption {
  id: string;
  value: string;
  category: string;
}

// Static translations for consistent language display
const STATIC_FILTER_TRANSLATIONS = {
  hotel_features: {
    en: [
      "Beach Access", "Pet Friendly", "Elevator", "Bar", "Library", 
      "Hotel Safe", "Business Center", "Fireplace", "Concierge", "Parking",
      "Gym", "Garden", "Pool", "24/7 Reception", "Restaurant", 
      "Game Room", "Conference Rooms", "Lounge", "Room Service", "Laundry Service",
      "Security Service", "Spa", "Terrace", "Airport Transfer", "Mountain View",
      "WiFi in Common Areas", "Free WiFi", "BBQ Area"
    ],
    es: [
      "Acceso a la Playa", "Acepta Mascotas", "Ascensor", "Bar", "Biblioteca",
      "Caja Fuerte del Hotel", "Centro de Negocios", "Chimenea", "Conserjería", "Estacionamiento",
      "Gimnasio", "Jardín", "Piscina", "Recepción 24/7", "Restaurante",
      "Sala de Juegos", "Salas de Conferencias", "Salón", "Servicio de Habitaciones", "Servicio de Lavandería",
      "Servicio de Seguridad", "Spa", "Terraza", "Traslado al Aeropuerto", "Vista a la Montaña",
      "WiFi en Zonas Comunes", "WiFi Gratis", "Zona de Barbacoa"
    ],
    pt: [
      "Acesso à Praia", "Aceita Animais", "Elevador", "Bar", "Biblioteca",
      "Cofre do Hotel", "Centro de Negócios", "Lareira", "Concierge", "Estacionamento",
      "Ginásio", "Jardim", "Piscina", "Recepção 24/7", "Restaurante",
      "Sala de Jogos", "Salas de Conferências", "Salão", "Serviço de Quartos", "Serviço de Lavanderia",
      "Serviço de Segurança", "Spa", "Terraço", "Transfer do Aeroporto", "Vista da Montanha",
      "WiFi em Áreas Comuns", "WiFi Grátis", "Área de Churrasco"
    ],
    ro: [
      "Acces la Plajă", "Prietenos cu Animalele", "Ascensor", "Bar", "Bibliotecă",
      "Seif Hotel", "Centru de Afaceri", "Șemineu", "Concierge", "Parcare",
      "Sală de Fitness", "Grădină", "Piscină", "Recepție 24/7", "Restaurant",
      "Sala de Jocuri", "Săli de Conferințe", "Salon", "Room Service", "Serviciu Spălătorie",
      "Serviciu Securitate", "Spa", "Terasă", "Transfer Aeroport", "Vedere la Munte",
      "WiFi în Zone Comune", "WiFi Gratuit", "Zonă BBQ"
    ]
  },
  room_features: {
    en: [
      "Air Conditioning", "Balcony", "Bathtub", "Private Bathroom", "Safe",
      "Blackout Curtains", "Shower", "Walk-in Shower", "Desk", "Water Heater",
      "Soundproof", "High-Speed Internet", "Coffee Machine", "Microwave", "Minibar",
      "Iron", "Hair Dryer", "Sofa", "Phone", "TV",
      "City View", "Mountain View", "Garden View", "Sea View", "WiFi"
    ],
    es: [
      "Aire Acondicionado", "Balcón", "Bañera", "Baño Privado", "Caja Fuerte",
      "Cortinas Opacas", "Ducha", "Ducha Walk-in", "Escritorio", "Calentador de Agua",
      "Insonorizado", "Internet de Alta Velocidad", "Máquina de Café", "Microondas", "Minibar",
      "Plancha", "Secador de Pelo", "Sofá", "Teléfono", "TV",
      "Vista a la Ciudad", "Vista a la Montaña", "Vista al Jardín", "Vista al Mar", "WiFi"
    ],
    pt: [
      "Ar Condicionado", "Varanda", "Banheira", "Banheiro Privado", "Cofre",
      "Cortinas Blackout", "Chuveiro", "Chuveiro Walk-in", "Mesa", "Aquecedor de Água",
      "À Prova de Som", "Internet de Alta Velocidade", "Máquina de Café", "Microondas", "Frigobar",
      "Ferro de Passar", "Secador de Cabelo", "Sofá", "Telefone", "TV",
      "Vista da Cidade", "Vista da Montanha", "Vista do Jardim", "Vista do Mar", "WiFi"
    ],
    ro: [
      "Aer Condiționat", "Balcon", "Cadă", "Baie Privată", "Seif",
      "Perdele Opace", "Duș", "Duș Walk-in", "Birou", "Fierbător de Apă",
      "Insonorizat", "Internet de Mare Viteză", "Mașină de Cafea", "Cuptor cu Microunde", "Minibar",
      "Fier de Călcat", "Uscător de Păr", "Canapea", "Telefon", "TV",
      "Vedere la Oraș", "Vedere la Munte", "Vedere la Grădină", "Vedere la Mare", "WiFi"
    ]
  }
};

export function useStaticFilterTranslations(category: string) {
  const { language } = useTranslation();
  
  return useQuery({
    queryKey: ['static-filter-translations', category, language],
    queryFn: async (): Promise<FilterOption[]> => {
      console.log(`🔍 Loading static translations for category: ${category}, language: ${language}`);
      
      const categoryData = STATIC_FILTER_TRANSLATIONS[category as keyof typeof STATIC_FILTER_TRANSLATIONS];
      
      if (!categoryData) {
        console.log(`⚠️ No static translations found for category: ${category}`);
        return [];
      }
      
      const languageData = categoryData[language as keyof typeof categoryData] || categoryData.en;
      
      const filterOptions: FilterOption[] = languageData.map((value, index) => ({
        id: `${category}-${index}`,
        value,
        category
      }));
      
      console.log(`✅ Generated ${filterOptions.length} static filter options for ${category} (${language}):`, 
                  filterOptions.slice(0, 5).map(f => f.value));
      
      return filterOptions;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - static data doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}