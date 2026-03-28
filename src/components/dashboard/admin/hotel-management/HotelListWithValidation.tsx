import React from 'react';
import { HotelImageValidation } from '../hotel-validation/HotelImageValidation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Hotel {
  id: string;
  name: string;
  main_image_url?: string | null;
  hotel_images?: Array<{
    id: string;
    image_url: string;
    is_main?: boolean;
  }>;
  status?: string;
  city?: string;
  country?: string;
}

interface HotelListWithValidationProps {
  hotels: Hotel[];
  onImageRequired?: (hotelId: string) => void;
}

export const HotelListWithValidation: React.FC<HotelListWithValidationProps> = ({
  hotels,
  onImageRequired
}) => {
  // Separate hotels by validation status
  const criticalHotels = hotels.filter(hotel => 
    hotel.status === 'approved' && 
    !hotel.main_image_url && 
    (!hotel.hotel_images || hotel.hotel_images.length === 0 || 
     !hotel.hotel_images.some(img => img.image_url && img.image_url !== "/placeholder.svg"))
  );

  const warningHotels = hotels.filter(hotel => 
    hotel.status !== 'approved' && 
    !hotel.main_image_url && 
    (!hotel.hotel_images || hotel.hotel_images.length === 0 || 
     !hotel.hotel_images.some(img => img.image_url && img.image_url !== "/placeholder.svg"))
  );

  const validHotels = hotels.filter(hotel => 
    hotel.main_image_url || 
    (hotel.hotel_images && hotel.hotel_images.some(img => 
      img.image_url && img.image_url !== "/placeholder.svg" && img.image_url.trim() !== ''
    ))
  );

  return (
    <div className="space-y-6">
      {criticalHotels.length > 0 && (
        <Card className="border-red-500 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              🚨 Critical: Published Hotels Without Images ({criticalHotels.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalHotels.map(hotel => (
              <div key={hotel.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">{hotel.name}</h4>
                    <p className="text-sm text-gray-400">{hotel.city}, {hotel.country}</p>
                  </div>
                </div>
                <HotelImageValidation hotel={hotel} onImageRequired={onImageRequired} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {warningHotels.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              ⚠️ Warning: Draft Hotels Need Images ({warningHotels.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {warningHotels.map(hotel => (
              <div key={hotel.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">{hotel.name}</h4>
                    <p className="text-sm text-gray-400">{hotel.city}, {hotel.country}</p>
                  </div>
                </div>
                <HotelImageValidation hotel={hotel} onImageRequired={onImageRequired} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {validHotels.length > 0 && (
        <Card className="border-green-500 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              ✅ Hotels with Valid Images ({validHotels.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validHotels.slice(0, 5).map(hotel => (
              <div key={hotel.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">{hotel.name}</h4>
                    <p className="text-sm text-gray-400">{hotel.city}, {hotel.country}</p>
                  </div>
                </div>
                <HotelImageValidation hotel={hotel} onImageRequired={onImageRequired} />
              </div>
            ))}
            {validHotels.length > 5 && (
              <p className="text-sm text-gray-400">... and {validHotels.length - 5} more hotels with valid images</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};