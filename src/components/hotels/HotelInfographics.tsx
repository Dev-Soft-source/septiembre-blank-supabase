import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function HotelInfographics() {
  const { language } = useTranslation();
  
  // Get the correct infographic URL based on language
  const getInfographicUrl = () => {
    switch (language) {
      case 'en':
        return "/lovable-uploads/7d994f04-fb2a-4f53-87b9-981db09b5f32.png";
      case 'pt':
        return "/lovable-uploads/5bcbe13f-8ad6-4a50-bf74-0339d414cf9c.png";
      case 'ro':
        return "/lovable-uploads/9a936f13-fb90-49b9-8c95-0694bad50742.png";
      case 'es':
      default:
        return "/lovable-uploads/5bcbe13f-8ad6-4a50-bf74-0339d414cf9c.png";
    }
  };

  // Get localized alt text
  const getAltText = () => {
    switch (language) {
      case 'en':
        return "500 million people benefits infographic";
      case 'pt':
        return "Infográfico dos benefícios para 500 milhões de pessoas";
      case 'ro':
        return "Infografic cu beneficiile pentru 500 milioane de persoane";
      case 'es':
      default:
        return "Infografía de beneficios para 500 millones de personas";
    }
  };
  
  return (
    <div className="w-full flex justify-center my-8 animate-fade-in">
      <div className="w-[80%] max-w-5xl">
        <img 
          src={getInfographicUrl()} 
          alt={getAltText()}
          className="w-full h-auto object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}