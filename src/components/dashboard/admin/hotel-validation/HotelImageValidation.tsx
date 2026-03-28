import React from 'react';
import { AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface HotelImageValidationProps {
  hotel: {
    id: string;
    name: string;
    main_image_url?: string | null;
    hotel_images?: Array<{
      id: string;
      image_url: string;
      is_main?: boolean;
    }>;
    status?: string;
  };
  onImageRequired?: (hotelId: string) => void;
}

export const HotelImageValidation: React.FC<HotelImageValidationProps> = ({ 
  hotel, 
  onImageRequired 
}) => {
  // Check if hotel has valid images
  const validateImages = () => {
    const hasMainImage = hotel.main_image_url && 
                        hotel.main_image_url !== "/placeholder.svg" && 
                        hotel.main_image_url.trim() !== '';
    
    const hasValidHotelImages = hotel.hotel_images && 
                               hotel.hotel_images.length > 0 && 
                               hotel.hotel_images.some(img => 
                                 img.image_url && 
                                 img.image_url !== "/placeholder.svg" && 
                                 img.image_url.trim() !== ''
                               );
    
    return {
      hasValidImages: hasMainImage || hasValidHotelImages,
      imageCount: hotel.hotel_images?.length || 0,
      validImageCount: hotel.hotel_images?.filter(img => 
        img.image_url && 
        img.image_url !== "/placeholder.svg" && 
        img.image_url.trim() !== ''
      ).length || 0
    };
  };

  const validation = validateImages();

  // If hotel is published/approved but has no valid images, show critical warning
  if (hotel.status === 'approved' && !validation.hasValidImages) {
    return (
      <Alert className="border-red-500 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-200">
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-red-400">⚠️ CRITICAL: Missing Hotel Images</strong>
              <p className="mt-1 text-sm">
                This hotel is published but has no authentic images. 
                Customers will see a generic placeholder instead of real hotel photos.
              </p>
            </div>
            {onImageRequired && (
              <button
                onClick={() => onImageRequired(hotel.id)}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
              >
                Require Images
              </button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // For draft/pending hotels without images, show warning
  if (!validation.hasValidImages) {
    return (
      <Alert className="border-yellow-500 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-yellow-400">⚠️ You must upload at least one real image of the hotel to publish it.</strong>
              <p className="mt-1 text-sm">
                Add authentic photos showing the hotel's exterior, lobby, rooms, or amenities.
              </p>
            </div>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              <Camera className="w-3 h-3 mr-1" />
              {validation.imageCount} images
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Hotel has valid images - show success
  return (
    <Alert className="border-green-500 bg-green-500/10">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertDescription className="text-green-200">
        <div className="flex items-center justify-between">
          <span className="text-green-400">
            ✅ Hotel has {validation.validImageCount} authentic image{validation.validImageCount !== 1 ? 's' : ''}
          </span>
          <Badge variant="outline" className="border-green-500 text-green-400">
            <Camera className="w-3 h-3 mr-1" />
            {validation.validImageCount} valid
          </Badge>
        </div>
      </AlertDescription>
    </Alert>
  );
};