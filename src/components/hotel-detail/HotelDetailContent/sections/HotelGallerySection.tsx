import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface HotelGallerySectionProps {
  images: string[];
  hotelName: string;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}
export function HotelGallerySection({
  images,
  hotelName,
  currentImageIndex,
  setCurrentImageIndex
}: HotelGallerySectionProps) {
  if (!images || images.length === 0) return null;
  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  };
  return <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">
    </h2>
      <div className="relative rounded-lg overflow-hidden">
        <img src={images[currentImageIndex]} alt={`${hotelName} - Image ${currentImageIndex + 1}`} className="w-full h-64 object-cover" />
        {images.length > 1 && <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#68178D]/50 text-white p-2 rounded-full hover:bg-[#68178D]/70">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#68178D]/50 text-white p-2 rounded-full hover:bg-[#68178D]/70">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => <button key={`gallery-dot-${index}`} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />)}
            </div>
          </>}
      </div>
    </div>;
}