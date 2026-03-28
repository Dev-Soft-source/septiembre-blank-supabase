// Test: Complete Hotel-Living Workflow Validation
// Creating "Prioridad 1" Hotel for End-to-End Testing

// This script will be executed to test the complete system workflow
const testWorkflow = async () => {
  
  console.log('🚀 STARTING HOTEL-LIVING END-TO-END WORKFLOW TEST');
  console.log('Creating test hotel: "Prioridad 1"');
  
  // Step 1: Prepare comprehensive test data for all 16 sections
  const testData = {
    hotel_data: {
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
      
      // Section 3-4: Property Type & Style
      property_type: "hotel",
      style: "modern",
      
      // Section 5: Hotel Description
      description: "Hotel de prueba para validación completa del sistema Hotel-Living. Ubicado estratégicamente en el corazón de Madrid, ofrece una experiencia única combinando la elegancia moderna con la calidez del servicio personalizado.",
      
      // Section 6: Room Description
      room_description: "Habitaciones modernas y elegantes equipadas con todas las comodidades necesarias para una estancia perfecta. Cada habitación cuenta con baño privado, aire acondicionado, WiFi gratuito y vistas espectaculares de la ciudad.",
      
      // Section 7: Complete Phrases
      ideal_guests: "Ideal para viajeros profesionales y turistas que buscan comodidad, ubicación central y un servicio excepcional en el corazón de Madrid",
      atmosphere: "Ambiente moderno y acogedor que combina la sofisticación urbana con la calidez del hogar",
      perfect_location: "Ubicación perfecta para explorar el centro histórico de Madrid, con fácil acceso a museos, restaurantes y transporte público",
      
      // Section 8-9: Features
      features_hotel: {
        "wifi_gratuito": true,
        "aire_acondicionado": true,
        "recepcion_24h": true,
        "gimnasio": true,
        "spa": true,
        "restaurante": true,
        "parking": true
      },
      
      features_room: {
        "bano_privado": true,
        "television": true,
        "minibar": true,
        "caja_fuerte": true,
        "escritorio": true,
        "vista_ciudad": true
      },
      
      // Section 12: Meal Plans
      meals_offered: ["room_only", "breakfast", "half_board"],
      
      // Section 13: Stay Lengths
      stay_lengths: [8, 15, 22, 29],
      
      // Section 14: Check-in Day
      check_in_weekday: "Monday",
      
      // Additional required fields
      weekly_laundry_included: true,
      external_laundry_available: false,
      main_image_url: "https://example.com/prioridad1-main.jpg",
      price_per_month: 2500,
      terms: "Términos de prueba aceptados para validación del sistema",
      available_months: ["10", "11", "12", "01", "02", "03"]
    },
    
    // Section 15: Availability Packages (8, 15, 22, 29 days)
    availability_packages: [
      {
        start_date: "2024-10-01",
        end_date: "2024-10-08",
        duration_days: 8,
        total_rooms: 5,
        available_rooms: 5,
        base_price_usd: 800,
        current_price_usd: 800
      },
      {
        start_date: "2024-11-01",
        end_date: "2024-11-15", 
        duration_days: 15,
        total_rooms: 5,
        available_rooms: 5,
        base_price_usd: 1400,
        current_price_usd: 1400
      },
      {
        start_date: "2024-12-01",
        end_date: "2024-12-22",
        duration_days: 22,
        total_rooms: 5,
        available_rooms: 5,
        base_price_usd: 2000,
        current_price_usd: 2000
      },
      {
        start_date: "2025-01-01",
        end_date: "2025-01-29",
        duration_days: 29,
        total_rooms: 5,
        available_rooms: 5,
        base_price_usd: 2600,
        current_price_usd: 2600
      }
    ],
    
    hotel_images: [],
    
    // Section 10-11: Themes & Activities using actual IDs from database
    hotel_themes: ["13b4974d-f6c5-4faf-a35f-d1ddce748714"], // Nutrition & Wellness
    hotel_activities: [
      "ac49156f-baa1-403c-a31a-7081d8b6a577", // Fitness
      "338dd4c9-7bbd-4e9c-942a-e2c165a56cdf"  // Spa & Masaje
    ],
    
    dev_mode: true
  };
  
  console.log('📝 Test data prepared for all 16 sections');
  console.log('Hotel Name:', testData.hotel_data.name);
  console.log('Total Rooms:', testData.hotel_data.total_rooms);
  console.log('Availability Packages:', testData.availability_packages.length);
  console.log('Themes:', testData.hotel_themes.length);
  console.log('Activities:', testData.hotel_activities.length);
  
  return testData;
};

// Export the test function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testWorkflow };
}

// Show test readiness
console.log('✅ Test data prepared for Prioridad 1 hotel');
console.log('🎯 Ready to execute complete workflow test');