import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelDetailContentEnhanced } from "@/components/hotel-detail/HotelDetailContentEnhanced";
import BubbleCounter from "@/components/common/BubbleCounter";

// Simple demo hotel data
const demoHotel = {
  id: "demo-hotel-001",
  name: "The Aurora Palace",
  city: "Barcelona", 
  country: "Spain",
  category: 5,
  price_per_month: 2500,
  address: "Passeig de Gràcia, 92",
  main_image_url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800",
  description: "Experience luxury at its finest in the heart of Barcelona. The Aurora Palace combines contemporary elegance with traditional Catalan charm, offering an unparalleled hospitality experience in one of Europe's most vibrant cities.",
  ideal_guests: "Perfect for digital nomads, business travelers, and culture enthusiasts seeking a sophisticated urban retreat with world-class amenities.",
  atmosphere: "Sophisticated yet welcoming, with an emphasis on artistic expression and cultural immersion. The ambiance balances modern luxury with authentic local character.",
  perfect_location: "Ideal for exploring Gaudí's masterpieces, high-end shopping, and Barcelona's renowned culinary scene. Walking distance to Casa Batlló, La Pedrera, and the Gothic Quarter.",
  average_rating: 4.8,
  available_months: ["January", "February", "March", "April", "May", "September", "October", "November", "December"],
  hotel_images: [
    { 
      id: "img-1", 
      hotel_id: "demo-hotel-001",
      image_url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800", 
      is_main: true,
      created_at: "2024-01-01"
    },
    { 
      id: "img-2", 
      hotel_id: "demo-hotel-001",
      image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", 
      is_main: false,
      created_at: "2024-01-01"
    }
  ],
  hotel_themes: ["Luxury Living", "Business Traveler", "Cultural Explorer"],
  hotelFeatures: [
    "24/7 Concierge Service",
    "Rooftop Infinity Pool", 
    "Michelin-Star Restaurant"
  ],
  roomFeatures: [
    "High-Speed WiFi",
    "Smart TV with Streaming",
    "Marble Bathroom"
  ],
  created_at: "2024-01-01",
  updated_at: "2024-01-01"
};

export default function DemoHotelDetail() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BubbleCounter />
      
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-center py-3">
        <div className="container mx-auto px-4">
          <span className="font-semibold">✨ Demo Page</span>
          <span className="mx-2">•</span>
          <span>Showcasing Enhanced Hotel Detail Experience</span>
        </div>
      </div>
      
      <main className="flex-1">
        <HotelDetailContentEnhanced hotel={demoHotel} isLoading={false} />
      </main>
      
      <Footer />
    </div>
  );
}