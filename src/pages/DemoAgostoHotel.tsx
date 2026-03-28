import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelDetailContentEnhanced } from "@/components/hotel-detail/HotelDetailContentEnhanced";
import BubbleCounter from "@/components/common/BubbleCounter";

// Simple demo hotel data
const demoAgostoHotel = {
  id: "demo-agosto-001",
  name: "1 de agosto Demo",
  city: "Ciudad Demo",
  country: "País",
  category: 4,
  price_per_month: 1200,
  address: "Calle Ficticia 123, Ciudad Demo, País",
  main_image_url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=400&fit=crop",
  description: "Un hotel rural de estilo tradicional ubicado en un entorno natural privilegiado, perfecto para descansar y conectar con la naturaleza.",
  ideal_guests: "Ideal para personas que buscan tranquilidad, actividades al aire libre y una experiencia auténtica en contacto con la naturaleza.",
  atmosphere: "Ambiente rural y acogedor, con un enfoque en la sostenibilidad y la conexión con el entorno natural local.",
  perfect_location: "Ubicación perfecta para senderismo, montañismo y avistamiento de aves, con acceso a playas cercanas y rutas de montaña.",
  average_rating: 4.6,
  available_months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  hotel_images: [
    { 
      id: "img-1", 
      hotel_id: "demo-agosto-001",
      image_url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=400&fit=crop", 
      is_main: true,
      created_at: "2024-01-01"
    },
    { 
      id: "img-2", 
      hotel_id: "demo-agosto-001",
      image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", 
      is_main: false,
      created_at: "2024-01-01"
    }
  ],
  hotel_themes: ["Naturaleza"],
  hotelFeatures: [
    "Jardín Natural",
    "Senderos Privados",
    "WiFi Gratuito"
  ],
  roomFeatures: [
    "Vistas a la Naturaleza",
    "WiFi de Alta Velocidad",
    "TV Smart"
  ],
  created_at: "2024-01-01",
  updated_at: "2024-01-01"
};

export default function DemoAgostoHotel() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BubbleCounter />
      <main className="flex-1 relative">
        {/* Gradient background for upper section only */}
        <div 
          className="absolute top-0 left-0 w-full h-[80vh]"
          style={{
            background: 'linear-gradient(180deg, #00DCF9 0%, #68178D 100%)'
          }}
        />
        {/* Solid dark blue background for the rest */}
        <div 
          className="absolute top-[80vh] left-0 w-full"
          style={{
            background: '#68178D',
            height: 'calc(100vh + 200px)' // Extra height to ensure coverage
          }}
        />
        <div className="relative z-10">
          <HotelDetailContentEnhanced hotel={demoAgostoHotel} isLoading={false} />
        </div>
      </main>
      <Footer />
    </div>
  );
}