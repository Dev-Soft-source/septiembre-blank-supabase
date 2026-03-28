
import React from 'react';
import { Card } from "@/components/ui/card";
import { Hotel } from "@/integrations/supabase/types-custom";

interface ImageGalleryProps {
  hotel: Hotel;
}

export const ImageGallery = ({ hotel }: ImageGalleryProps) => {
  const hotelImages = Array.isArray(hotel.hotel_images) ? hotel.hotel_images.filter(img => {
    console.log("Property ImageGallery - Checking image:", img);
    return img && img.image_url && img.image_url.trim() !== '';
  }) : [];
  
  console.log("Property ImageGallery - Processing hotel images:", hotelImages);
  console.log("Property ImageGallery - Hotel main_image_url:", hotel.main_image_url);
  
  // Determine the main image URL
  const mainImageUrl = hotel.main_image_url || 
                      hotelImages.find(img => img.is_main)?.image_url || 
                      (hotelImages.length > 0 ? hotelImages[0].image_url : null);

  const handleImageError = (imageUrl: string) => {
    console.error("Property image failed to load:", imageUrl);
  };

  const handleImageLoad = (imageUrl: string) => {
    console.log("Property image loaded successfully:", imageUrl);
  };
  
  return (
    <Card className="p-6 bg-[#7204B8]">
      <h3 className="text-base font-semibold mb-4 border-b pb-2 border-purple-700">Hotel Images</h3>
      {hotelImages.length > 0 ? (
        <div>
          {mainImageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Main Image</p>
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                <img 
                  src={mainImageUrl} 
                  alt={`${hotel.name} - Main`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(mainImageUrl)}
                  onLoad={() => handleImageLoad(mainImageUrl)}
                />
              </div>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-400 mb-2">All Images ({hotelImages.length})</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {hotelImages.map((image, index) => (
                <div key={image.id || index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={image.image_url} 
                    alt={`${hotel.name} - Gallery Image`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(image.image_url)}
                    onLoad={() => handleImageLoad(image.image_url)}
                  />
                  {image.is_main && (
                    <div className="absolute top-1 right-1 bg-purple-700 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-800/50 rounded-lg">
          <p className="text-gray-400">No images available for this hotel.</p>
          <p className="text-xs text-gray-500 mt-2">Debug: Images count: {hotel.hotel_images?.length || 0}</p>
        </div>
      )}
    </Card>
  );
};
