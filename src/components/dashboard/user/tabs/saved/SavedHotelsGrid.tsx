
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface SavedHotel {
  id: string;
  hotel_id: string;
  created_at: string;
  hotels: {
    id: string;
    name: string;
    city: string;
    country: string;
    main_image_url: string | null;
    price_per_month: number;
    available_months: string[] | null;
    status: string;
  } | null;
}

interface SavedHotelsGridProps {
  hotels: SavedHotel[];
  onRemove: (favoriteId: string) => void;
}

export default function SavedHotelsGrid({ hotels, onRemove }: SavedHotelsGridProps) {
  const navigate = useNavigate();

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No saved hotels yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Start exploring hotels and save your favorites here
        </p>
        <Button onClick={() => navigate('/search')} variant="outline">
          Browse Hotels
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((savedHotel) => {
        const hotel = savedHotel.hotels;
        if (!hotel) return null;

        const isUnavailable = hotel.status !== 'approved';
        const hasAvailability = hotel.available_months && hotel.available_months.length > 0;

        return (
          <Card key={savedHotel.id} className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${isUnavailable ? 'opacity-60 grayscale' : ''}`}>
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={hotel.main_image_url || "/placeholder.svg"} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              {isUnavailable && (
                <div className="absolute inset-0 bg-[#68178D]/50 flex items-center justify-center">
                  <Badge variant="secondary" className="bg-gray-800 text-white">
                    Currently Unavailable
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{hotel.name}</h3>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm font-medium">From ${hotel.price_per_month}</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
                
                {hasAvailability && (
                  <Badge variant="outline" className="text-xs">
                    {hotel.available_months?.length} months available
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                
                {!isUnavailable && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemove(savedHotel.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
