
import React from "react";
import { MapPin } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  location: string;
  price_per_month: number;
}

interface HotelsMapProps {
  hotels: Hotel[];
  selectedHotel?: string;
  onHotelSelect?: (hotelId: string) => void;
}

export function HotelsMap({ hotels, selectedHotel, onHotelSelect }: HotelsMapProps) {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl border border-purple-400/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-fuchsia-400" />
        <h3 className="text-lg font-semibold text-[#f9d3f6]">Hotel Locations</h3>
      </div>
      
      <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-fuchsia-400/50 mx-auto mb-2" />
          <p className="text-gray-400">Interactive map coming soon</p>
          <p className="text-sm text-gray-500">{hotels.length} hotels to display</p>
        </div>
      </div>
      
      {hotels.length > 0 && (
        <div className="mt-4 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium text-[#f9d3f6] mb-2">Locations:</h4>
          <div className="space-y-1">
            {hotels.slice(0, 5).map((hotel) => (
              <div
                key={hotel.id}
                className={`text-sm p-2 rounded cursor-pointer transition-colors ${
                  selectedHotel === hotel.id 
                    ? 'bg-fuchsia-600/20 text-fuchsia-200' 
                    : 'text-gray-300 hover:bg-fuchsia-600/10'
                }`}
                onClick={() => onHotelSelect?.(hotel.id)}
              >
                {hotel.name} - {hotel.location}
              </div>
            ))}
            {hotels.length > 5 && (
              <p className="text-xs text-gray-500 pt-1">
                And {hotels.length - 5} more...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
