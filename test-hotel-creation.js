// Test script to create "Prioridad 1" hotel for end-to-end validation

// Comprehensive test data for all 16 sections of hotel registration
const testHotelData = {
  // Section 1: Basic Information
  name: "Prioridad 1",
  total_rooms: 25,
  address: "Calle de Prueba 123",
  city: "Madrid",
  country: "España",
  postal_code: "28001",
  contact_name: "Manager Test",
  contact_email: "prioridad1@test-hotel.com", 
  contact_phone: "+34 123 456 789",
  
  // Section 2: Hotel Classification
  category: 4,
  
  // Section 3: Property Type
  property_type: "hotel",
  
  // Section 4: Property Style  
  style: "modern",
  
  // Section 5: Hotel Description
  description: "Hotel de prueba para validación completa del sistema Hotel-Living. Ubicado estratégicamente en el corazón de Madrid, ofrece una experiencia única combinando la elegancia moderna con la calidez del servicio personalizado.",
  
  // Section 6: Room Description
  room_description: "Habitaciones modernas y elegantes equipadas con todas las comodidades necesarias para una estancia perfecta. Cada habitación cuenta con baño privado, aire acondicionado, WiFi gratuito y vistas espectaculares de la ciudad.",
  
  // Section 7: Complete Phrases
  ideal_guests: "Ideal para viajeros profesionales y turistas que buscan comodidad, ubicación central y un servicio excepcional en el corazón de Madrid",
  atmosphere: "Ambiente moderno y acogedor que combina la sofisticación urbana con la calidez del hogar, creando un espacio perfecto para el descanso y el trabajo",
  perfect_location: "Ubicación perfecta para explorar el centro histórico de Madrid, con fácil acceso a museos, restaurantes, centros comerciales y transporte público",
  
  // Section 8-9: Features (will be handled as JSON objects)
  features_hotel: {
    "wifi_gratuito": true,
    "aire_acondicionado": true,
    "recepcion_24h": true,
    "servicio_habitaciones": true,
    "gimnasio": true,
    "spa": true,
    "restaurante": true,
    "bar": true,
    "parking": true,
    "piscina": false,
    "centro_negocios": true,
    "sala_conferencias": true
  },
  
  features_room: {
    "bano_privado": true,
    "ducha": true,
    "secador_pelo": true,
    "television": true,
    "minibar": true,
    "caja_fuerte": true,
    "telefono": true,
    "escritorio": true,
    "armario": true,
    "plancha": true,
    "balcon": false,
    "vista_ciudad": true
  },
  
  // Section 10-11: Activities & Affinities (will be mapped to IDs)
  // These will be handled separately as arrays
  
  // Section 12: Meal Plans
  meals_offered: ["room_only", "breakfast", "half_board"],
  
  // Section 13: Stay Lengths
  stay_lengths: [8, 15, 22, 29],
  
  // Section 14: Check-in Day
  check_in_weekday: "Monday",
  
  // Section 15: Availability Packages (will be handled separately)
  
  // Section 16: Pricing Matrix (will be handled separately)
  
  // Additional fields
  weekly_laundry_included: true,
  external_laundry_available: false,
  main_image_url: "https://example.com/prioridad1-main.jpg",
  price_per_month: 2500,
  terms: "Términos de prueba aceptados para validación del sistema",
  available_months: ["10", "11", "12", "01", "02", "03"]
};

// Availability packages for all durations (8, 15, 22, 29 days)
const availabilityPackages = [
  {
    start_date: "2024-10-01",
    end_date: "2024-10-08", 
    duration_days: 8,
    total_rooms: 5,
    available_rooms: 5,
 //   occupancy_mode: "double",
    base_price_usd: 800,
    current_price_usd: 800,
    meal_plan: "half_board",
    room_type: "double"
  },
  {
    start_date: "2024-10-15",
    end_date: "2024-10-29",
    duration_days: 15, 
    total_rooms: 5,
    available_rooms: 5,
//    occupancy_mode: "double", 
    base_price_usd: 1400,
    current_price_usd: 1400,
    meal_plan: "half_board",
    room_type: "double"
  },
  {
    start_date: "2024-11-01", 
    end_date: "2024-11-22",
    duration_days: 22,
    total_rooms: 5,
    available_rooms: 5,
 //   occupancy_mode: "double",
    base_price_usd: 2000, 
    current_price_usd: 2000,
    meal_plan: "half_board",
    room_type: "double"
  },
  {
    start_date: "2024-12-01",
    end_date: "2024-12-29", 
    duration_days: 29,
    total_rooms: 5,
    available_rooms: 5,
 //   occupancy_mode: "double",
    base_price_usd: 2600,
    current_price_usd: 2600,
    meal_plan: "half_board", 
    room_type: "double"
  }
];

// Hotel themes/affinities
const hotelThemes = ["wellness", "urban_exploration", "business_travel"];

// Hotel activities  
const hotelActivities = ["spa_massage", "fitness", "city_tours"];

// Export for use in test
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testHotelData,
    availabilityPackages,
    hotelThemes,
    hotelActivities
  };
}

console.log('Test data prepared for Prioridad 1 hotel registration');
console.log('Hotel Data:', testHotelData);
console.log('Availability Packages:', availabilityPackages); 
console.log('Themes:', hotelThemes);
console.log('Activities:', hotelActivities);