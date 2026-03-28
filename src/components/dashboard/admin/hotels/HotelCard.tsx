
import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Star } from "lucide-react";

interface HotelCardProps {
  hotel: any;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="bg-purple-800/30 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Stars above hotel name */}
          {hotel.category && hotel.category > 0 && (
            <div className="flex justify-start mb-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.max(3, Math.min(5, hotel.category)) }).map((_, i) => (
                  <Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          )}
          
          <h3 className="text-white font-medium text-lg">{hotel.name}</h3>
          <p className="text-white/80 text-sm">{hotel.city}, {hotel.country}</p>
          {hotel.is_featured && (
            <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded mt-1 inline-block">
              Featured
            </span>
          )}
        </div>
        <StatusBadge status={hotel.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-white/60">Price/Month:</span>
          <span className="text-white ml-2">€{hotel.price_per_month || 'N/A'}</span>
        </div>
        <div>
          <span className="text-white/60">Category:</span>
          <span className="text-white ml-2">{hotel.category ? `${hotel.category} ⭐` : 'N/A'}</span>
        </div>
        <div>
          <span className="text-white/60">Owner:</span>
          <span className="text-white ml-2">
            {hotel.profiles ? 
              `${hotel.profiles.first_name || ''} ${hotel.profiles.last_name || ''}`.trim() || 'Unknown'
              : 'Unknown'
            }
          </span>
        </div>
        <div>
          <span className="text-white/60">Created:</span>
          <span className="text-white ml-2">{new Date(hotel.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button size="sm" variant="outline" className="flex-1">
          <Eye className="w-4 h-4 mr-2" /> View
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button size="sm" className="bg-red-600 hover:bg-red-700">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
