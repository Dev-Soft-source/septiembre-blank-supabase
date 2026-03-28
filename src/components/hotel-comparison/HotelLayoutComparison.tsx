import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HotelCard } from "@/components/HotelCard";
import { HotelDetailContentEnhanced } from "@/components/hotel-detail/HotelDetailContentEnhanced";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Layers, Eye, ArrowLeftRight } from "lucide-react";

// Extract "28 DE JULIO" hotel data from the current search results
const julyHotelData = {
  id: "6795bc8a-be23-4454-a158-1b101147e55b",
  name: "28 DE JULIO",
  city: "Madrid",
  country: "Spain",
  location: "Madrid, Spain",
  address: "C. de la Palma, 2, Centro, 28004 Madrid, Spain",
  price_per_month: 805,
  category: null,
  hotel_images: [],
  hotel_themes: [],
  hotel_activities: [],
  available_months: [],
  features_hotel: {
    "NO": true,
    "Salón": true,
    "Restaurante": true,
    "Estacionamiento": true,
    "Centro de Negocios": true
  },
  features_room: {
    "Ducha": true,
    "Baño Privado": true,
    "Hervidor de Agua": true,
    "Máquina de Café": true,
    "Aire Acondicionado": true
  },
  meal_plans: ["Media pensión"],
  stay_lengths: [8],
  atmosphere: "ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  ",
  property_type: "Rural House",
  style: "Urban",
  rates: {},
  room_types: [
    {
      description: "ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  ddddddddd ddddddd  ddddddd ddddddd ddddddd ddddddd  "
    }
  ],
  pricingMatrix: [
    {
      roomType: "Double Room",
      stayLength: "8 nights",
      mealPlan: "Half Board",
      price: 222
    },
    {
      roomType: "Single Room", 
      stayLength: "8 nights",
      mealPlan: "Half Board",
      price: 222
    }
  ]
};

// Transform the data for DemoHotel layout (Enhanced)
const transformedJulyHotelForDemo = {
  ...julyHotelData,
  main_image_url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
  description: "Experience authentic Madrid living in the heart of the city center. 28 DE JULIO combines traditional Spanish charm with modern amenities, offering an ideal base for extended stays in Spain's vibrant capital.",
  ideal_guests: "Perfect for digital nomads, business travelers, and culture enthusiasts seeking an authentic Madrid experience with convenient access to the city's main attractions.",
  perfect_location: "Located in Madrid's historic center, walking distance to Puerta del Sol, Royal Palace, and world-class museums. Excellent transport connections throughout the city.",
  average_rating: 4.5,
  // Transform features into arrays for compatibility
  hotelFeatures: Object.keys(julyHotelData.features_hotel).filter(key => julyHotelData.features_hotel[key as keyof typeof julyHotelData.features_hotel]),
  roomFeatures: Object.keys(julyHotelData.features_room).filter(key => julyHotelData.features_room[key as keyof typeof julyHotelData.features_room]),
  // Add demo images for better visualization
  hotel_images: [
    { 
      id: "img-1", 
      hotel_id: julyHotelData.id,
      image_url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", 
      is_main: true,
      created_at: "2024-01-01"
    },
    { 
      id: "img-2", 
      hotel_id: julyHotelData.id,
      image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800", 
      is_main: false,
      created_at: "2024-01-01"
    },
    { 
      id: "img-3", 
      hotel_id: julyHotelData.id,
      image_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800", 
      is_main: false,
      created_at: "2024-01-01"
    }
  ],
  // Add missing required fields
  owner_id: "demo-owner",
  created_at: "2025-07-28",
  updated_at: "2025-07-28",
  status: "approved" as const,
  is_featured: false
};

interface HotelLayoutComparisonProps {
  className?: string;
}

export function HotelLayoutComparison({ className }: HotelLayoutComparisonProps) {
  const [selectedLayout, setSelectedLayout] = useState<"model-a" | "model-b">("model-a");
  const [viewMode, setViewMode] = useState<"card" | "detail">("card");

  const handleHotelClick = () => {
    // Don't navigate, just switch to detail view for comparison
    setViewMode("detail");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Comparison Header */}
      <div className="bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 rounded-xl border border-purple-200/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-white">Hotel Layout Comparison</h2>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                28 DE JULIO
              </Badge>
            </div>
            <p className="text-white/80 text-sm">
              Compare two different layout designs for the same hotel data
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Mode Toggle */}
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value: "card" | "detail") => value && setViewMode(value)}
              className="bg-white/10 rounded-lg p-1"
            >
              <ToggleGroupItem value="card" className="data-[state=on]:bg-white/20">
                <Eye className="w-4 h-4 mr-2" />
                Card View
              </ToggleGroupItem>
              <ToggleGroupItem value="detail" className="data-[state=on]:bg-white/20">
                <Layers className="w-4 h-4 mr-2" />
                Detail View
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Layout Toggle */}
            <ToggleGroup 
              type="single" 
              value={selectedLayout} 
              onValueChange={(value: "model-a" | "model-b") => value && setSelectedLayout(value)}
              className="bg-white/10 rounded-lg p-1"
            >
              <ToggleGroupItem value="model-a" className="data-[state=on]:bg-white/20">
                Model A (Current)
              </ToggleGroupItem>
              <ToggleGroupItem value="model-b" className="data-[state=on]:bg-white/20">
                Model B (Enhanced)
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Layout Display */}
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="p-6">
          {/* Layout Info Banner */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedLayout === "model-a" ? "Model A - Current Layout" : "Model B - Enhanced Layout"}
                  </h3>
                  <p className="text-sm text-white/70">
                    {selectedLayout === "model-a" 
                      ? "Standard hotel card layout currently used in search results"
                      : "Enhanced detail layout with richer content presentation"
                    }
                  </p>
                </div>
              </div>
              <Badge variant={selectedLayout === "model-a" ? "default" : "secondary"}>
                {viewMode === "card" ? "Card Layout" : "Detail Layout"}
              </Badge>
            </div>
          </div>

          {/* Render Selected Layout */}
          <div className="space-y-6">
            {viewMode === "card" ? (
              // Card View Comparison
              <div className="max-w-md mx-auto">
                {selectedLayout === "model-a" ? (
                  // Model A - Current HotelCard Layout
                  <HotelCard
                    id={julyHotelData.id}
                    name={julyHotelData.name}
                    city={julyHotelData.city}
                    country={julyHotelData.country}
                    category={julyHotelData.category}
                    pricePerMonth={julyHotelData.price_per_month}
                    themes={[]}
                    image="/placeholder.svg"
                    availableMonths={julyHotelData.available_months}
                    rates={julyHotelData.rates}
                    hotel_themes={julyHotelData.hotel_themes}
                    hotel_activities={julyHotelData.hotel_activities}
                    meal_plans={julyHotelData.meal_plans}
                    location={julyHotelData.location}
                    onClick={handleHotelClick}
                    stayLengths={[]}
                    availabilityPackages={[]}
                  />
                ) : (
                  // Model B - Enhanced Card Preview (simplified version of the detail layout)
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800" 
                        alt={julyHotelData.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-purple-600 text-white">Enhanced Layout</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button size="sm" variant="ghost" className="bg-white/20 hover:bg-white/30">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{julyHotelData.name}</h3>
                        <p className="text-white/70 text-sm flex items-center gap-2">
                          <span>📍 {julyHotelData.city}, {julyHotelData.country}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <p className="text-white/60 text-sm">Monthly Rate</p>
                          <p className="text-2xl font-bold text-white">€{julyHotelData.price_per_month}</p>
                        </div>
                        <Button onClick={handleHotelClick} className="bg-gradient-to-r from-purple-600 to-fuchsia-600">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              // Detail View Comparison
              <div className="space-y-4">
                {selectedLayout === "model-a" ? (
                  // Model A - Basic detail layout (simplified)
                  <div className="bg-gradient-to-br from-purple-800/20 to-purple-900/20 rounded-xl p-8 border border-purple-400/20">
                    <div className="text-center space-y-4">
                      <h1 className="text-3xl font-bold text-white">{julyHotelData.name}</h1>
                      <p className="text-white/70">{julyHotelData.city}, {julyHotelData.country}</p>
                      <div className="text-2xl font-bold text-purple-300">€{julyHotelData.price_per_month}/month</div>
                      <p className="text-white/60 max-w-2xl mx-auto">
                        Basic hotel detail layout - simplified presentation of hotel information in a traditional format.
                      </p>
                      <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400/10">
                        Current Layout Style
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Model B - Enhanced detail layout
                  <div className="bg-gradient-to-br from-blue-50/5 via-purple-50/5 to-pink-50/5 rounded-xl overflow-hidden">
                    <HotelDetailContentEnhanced 
                      hotel={transformedJulyHotelForDemo} 
                      isLoading={false} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Toggle Instructions */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/60 text-sm text-center">
              💡 Use the toggles above to switch between layouts and view modes. 
              Both versions use the same "28 DE JULIO" hotel data with different presentation styles.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}