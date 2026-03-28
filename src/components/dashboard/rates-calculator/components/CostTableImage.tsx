
import React from "react";

interface CostTableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CostTableImage: React.FC<CostTableImageProps> = ({ 
  src, 
  alt, 
  className = "w-full h-auto rounded-lg mx-auto" 
}) => {
  return (
    <div className="mt-8 rounded-lg p-4 bg-[#68178D]">
      <img 
        src={src} 
        alt={alt} 
        className={className} 
      />
    </div>
  );
};
