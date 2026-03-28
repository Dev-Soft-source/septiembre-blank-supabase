
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, Star } from "lucide-react";
import { SavedHotel } from "@/components/dashboard/hooks/useSavedHotels";
import { Link } from "react-router-dom";

interface SavedHotelCardProps {
  hotel: SavedHotel;
  onRemove: (id: string) => Promise<void>;
}

export default function SavedHotelCard({ hotel, onRemove }: SavedHotelCardProps) {
  if (!hotel.hotels) {
    return null;
  }

  return (
    <Card className="overflow-hidden bg-fuchsia-500/10 border-fuchsia-900/20">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-32 flex-shrink-0">
          {hotel.hotels.main_image_url ? (
            <img 
              src={hotel.hotels.main_image_url} 
              alt={hotel.hotels.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-fuchsia-950/30 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-fuchsia-400" />
            </div>
          )}
        </div>
        
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              {/* Stars above hotel name */}
              {hotel.hotels.category && hotel.hotels.category > 0 && (
                <div className="flex justify-center sm:justify-start mb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.max(3, Math.min(5, hotel.hotels.category)) }).map((_, i) => (
                      <Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              )}
              
              <h3 className="font-bold text-lg text-white mb-1">
                {hotel.hotels.name}
              </h3>
              <div className="flex items-center text-fuchsia-200 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{hotel.hotels.city}, {hotel.hotels.country}</span>
              </div>
              <div className="text-sm font-medium text-white">
                From ${hotel.hotels.price_per_month} per month
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(hotel.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Link to={`/hotel/${hotel.hotels.id}`} className="flex-1">
              <Button 
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                size="sm"
              >
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
