import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function HotelDiagram() {
  const { language } = useTranslation();
  
  // Get the correct diagram URL based on language
  const getDiagramUrl = () => {
    const baseUrl = "https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/DIAGRAM%20HOTEL-LIVING";
    
    switch (language) {
      case 'en':
        return `${baseUrl}/diagrama%20hotel%20living%20INGLES.png`;
      case 'pt':
        return "/lovable-uploads/650c3d3b-d703-4ca6-8ab0-37a2cc588055.png";
      case 'ro':
        return `${baseUrl}/diagrama%20hotel%20living%20ROMANIAN-1.png`;
      case 'es':
      default:
        return "/lovable-uploads/650c3d3b-d703-4ca6-8ab0-37a2cc588055.png";
    }
  };

  // Get localized alt text
  const getAltText = () => {
    switch (language) {
      case 'en':
        return "Hotel-Living process diagram";
      case 'pt':
        return "Diagrama do processo Hotel-Living";
      case 'ro':
        return "Diagrama procesului Hotel-Living";
      case 'es':
      default:
        return "Diagrama del proceso Hotel-Living";
    }
  };
  
  return (
    <div className="w-full mx-auto my-8 animate-fade-in">
      <div className="relative w-full">
        {/* Image container - full width, preserve aspect ratio */}
        <div className="w-full">
          <img 
            src={getDiagramUrl()} 
            alt={getAltText()}
            className="w-full h-auto object-contain"
            style={{ 
              maxWidth: '100vw',
              width: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  );
}