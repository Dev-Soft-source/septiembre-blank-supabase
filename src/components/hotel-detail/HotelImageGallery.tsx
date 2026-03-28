
import React, { useState, useEffect } from "react";
import { HotelImage } from "@/types/hotel";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface HotelImageGalleryProps {
  hotelImages: HotelImage[];
  hotelName: string;
}

export function HotelImageGallery({ hotelImages, hotelName }: HotelImageGalleryProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [processedImages, setProcessedImages] = useState<HotelImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (hotelImages && Array.isArray(hotelImages)) {
      // Filter out invalid images (those without valid URLs)
      const validImages = hotelImages.filter(img => 
        img && 
        img.image_url && 
        typeof img.image_url === 'string' &&
        img.image_url.trim() !== '' &&
        !failedImages.has(img.image_url)
      );
      
      // Prioritize main image - sort to ensure main image comes first
      const sortedImages = [
        ...validImages.filter(img => img.is_main),
        ...validImages.filter(img => !img.is_main)
      ];
      
      setProcessedImages(sortedImages);
      console.log(`HotelImageGallery: Processed ${sortedImages.length} images for ${hotelName}`);
    } else {
      setProcessedImages([]);
    }
  }, [hotelImages, failedImages, hotelName]);

  const handleImageError = (imageUrl: string) => {
    console.log("Image failed to load:", imageUrl);
    setFailedImages(prev => {
      const updated = new Set(prev);
      updated.add(imageUrl);
      return updated;
    });
  };

  if (!processedImages || processedImages.length === 0) {
    return (
      <div className="mt-4">
        <div className="w-full h-72 bg-fuchsia-900/20 flex items-center justify-center rounded-xl">
          <p className="text-white">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Main Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {processedImages.map((image, index) => (
              <CarouselItem key={image.id || index} className="flex justify-center">
                <div className="p-1 w-full">
                  <div className="overflow-hidden rounded-xl w-full relative">
                    <img
                      src={image.image_url}
                      alt={`${hotelName} view ${index + 1}`}
                      className="h-72 w-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={() => handleImageError(image.image_url)}
                    />
                    {image.is_main && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Main Photo
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {processedImages.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2" />
              <CarouselNext className="absolute right-2" />
            </>
          )}
        </Carousel>
        
        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-[#68178D]/50 text-white px-2 py-1 rounded text-xs">
          {activeIndex + 1} / {processedImages.length}
        </div>
      </div>
      
      {/* Thumbnail gallery */}
      {processedImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {processedImages.slice(0, 12).map((image, index) => (
            <button
              key={`thumb-${image.id || index}`} 
              className={cn(
                "aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-200",
                index === 0 && processedImages.length > 3 && "col-span-2 row-span-2",
                index === activeIndex ? "ring-2 ring-purple-500 opacity-100" : "opacity-70 hover:opacity-100"
              )}
              onClick={() => setActiveIndex(index)}
            >
              <img 
                src={image.image_url}
                alt={`${hotelName} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                onError={() => handleImageError(image.image_url)}
              />
            </button>
          ))}
          
          {processedImages.length > 12 && (
            <div className="aspect-square rounded-md bg-purple-800/50 flex items-center justify-center text-white text-xs font-medium">
              +{processedImages.length - 12}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
