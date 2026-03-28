
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDatesForDisplay } from "@/utils/availabilityUtils";

interface HotelRoomTypesProps {
  roomTypes?: any[];
  hotelId?: string;
  hotel?: any;
  isLoading?: boolean;
}

export function HotelRoomTypes({ roomTypes, hotelId, hotel, isLoading }: HotelRoomTypesProps) {
  // Use roomTypes if passed directly, otherwise use hotel.room_types
  const displayRoomTypes = roomTypes || (hotel?.room_types || []);

  if (!displayRoomTypes || displayRoomTypes.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-fuchsia-950/40 pb-4">
        <CardTitle className="text-xl font-bold">Room Types</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {displayRoomTypes.map((room: any, index: number) => (
          <div 
            key={room.id || index} 
            className={`p-6 ${index < displayRoomTypes.length - 1 ? 'border-b border-fuchsia-900/30' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <span className="bg-fuchsia-700 text-white text-xs px-2 py-1 rounded-full">
                {room.roomCount || 1} {room.roomCount === 1 ? 'Room' : 'Rooms'} Available
              </span>
            </div>
            
            {room.description && (
              <p className="text-gray-300 mb-4">{room.description}</p>
            )}
            
            {/* Room Images */}
            {room.images && room.images.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {room.images.slice(0, 4).map((image: string, imgIndex: number) => (
                    <div key={imgIndex} className="aspect-video rounded overflow-hidden bg-fuchsia-900/40">
                      <img 
                        src={image} 
                        alt={`${room.name} image ${imgIndex + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Room Rates */}
              {room.rates && Object.keys(room.rates).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-fuchsia-200">Rates per Stay Length:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(room.rates).map(([duration, rate]: [string, any]) => (
                      <div key={duration} className="flex justify-between bg-fuchsia-900/20 p-2 rounded">
                        <span className="text-gray-300">{duration} days:</span>
                        <span className="font-medium">${rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Room Availability */}
              {room.availabilityDates && room.availabilityDates.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-fuchsia-200">Available on:</h4>
                  <div className="bg-fuchsia-900/20 p-3 rounded">
                    {formatDatesForDisplay(room.availabilityDates, hotel?.available_months || []).join(', ')}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-fuchsia-900/30 flex flex-wrap gap-4">
              <div className="text-sm">
                <span className="text-gray-300">Max Occupancy:</span> {room.maxOccupancy || '1'} persons
              </div>
              {room.size && (
                <div className="text-sm">
                  <span className="text-gray-300">Room Size:</span> {room.size} sq. ft.
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
