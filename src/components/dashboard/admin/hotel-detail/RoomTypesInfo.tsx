
import React from "react";
import { Card } from "@/components/ui/card";
import { Bed } from "lucide-react";

export function RoomTypesInfo({ hotel }: { hotel: any }) {
  const roomTypes = hotel.room_types || [];
  
  return (
    <Card className="p-6 bg-[#5A0080]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700 flex items-center gap-2">
        <Bed className="w-5 h-5 text-purple-400" />
        Room Types
      </h3>
      
      {roomTypes && roomTypes.length > 0 ? (
        <div className="space-y-4">
          {roomTypes.map((room: any, index: number) => (
            <div key={index} className="p-4 border border-purple-700/30 rounded-lg bg-purple-900/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-400">Room Type</p>
                  <p className="font-medium text-purple-300">{room.name || `Room Type ${index + 1}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Room Count</p>
                  <p className="font-medium text-purple-300">{room.roomCount || room.room_count || 0}</p>
                </div>
                {room.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-white">{room.description}</p>
                  </div>
                )}
                {room.rates && Object.keys(room.rates).length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400">Rates</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(room.rates).map(([duration, price]) => (
                        <span 
                          key={duration} 
                          className="px-2 py-1 bg-fuchsia-900/50 rounded text-xs text-white"
                        >
                          {duration}: ${String(price)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No room types specified for this hotel.</p>
      )}
    </Card>
  );
}
