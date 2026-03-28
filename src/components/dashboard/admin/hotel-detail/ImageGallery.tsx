
import React from "react";
import { AdminHotelDetail } from "@/types/hotel";

interface ImageGalleryProps {
  images: AdminHotelDetail['hotel_images'];
  hotel: AdminHotelDetail;
}

export function ImageGallery({ images, hotel }: ImageGalleryProps) {
  // Ensure images is always an array and filter for valid image URLs
  const validImages = Array.isArray(images) ? images.filter(img => {
    console.log("ImageGallery - Checking image:", img);
    return img && img.image_url && img.image_url.trim() !== '';
  }) : [];
  
  console.log("ImageGallery - Processing hotel images:", validImages);
  console.log("ImageGallery - Hotel main_image_url:", hotel.main_image_url);
  
  // Determine the main image URL
  const mainImageUrl = hotel.main_image_url || 
                      validImages.find(img => img.is_main)?.image_url || 
                      (validImages.length > 0 ? validImages[0].image_url : null);
  
  const handleImageError = (imageUrl: string) => {
    console.log("ImageGallery - Image failed to load:", imageUrl);
  };

  const handleImageLoad = (imageUrl: string) => {
    console.log("ImageGallery - Image loaded successfully:", imageUrl);
  };
  
  return (
    <div className="rounded-xl p-6 bg-[#5C0869]">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-purple-700">Hotel Images</h3>
      {validImages && validImages.length > 0 ? (
        <div>
          {mainImageUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Main Image</p>
              <div className="w-full aspect-video border rounded-lg overflow-hidden bg-gray-800">
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
            <p className="text-sm text-gray-400 mb-2">All Images ({validImages.length})</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {validImages.map((image, index) => (
                <div key={image.id || index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={image.image_url} 
                    alt={`${hotel.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(image.image_url)}
                    onLoad={() => handleImageLoad(image.image_url)}
                  />
                  {image.is_main && (
                    <div className="absolute top-1 right-1 bg-[#5A0080] text-white text-xs px-2 py-1 rounded">
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
          <p className="text-xs text-gray-500 mt-2">Debug: Images count: {images?.length || 0}</p>
        </div>
      )}
    </div>
  );
}
