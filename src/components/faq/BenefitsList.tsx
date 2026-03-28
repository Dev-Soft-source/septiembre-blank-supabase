
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BenefitsListProps {
  benefits: string[];
  className?: string;
}

export function BenefitsList({ benefits, className = "" }: BenefitsListProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`mb-16 ${className}`}>
      <h2 className={`text-center font-bold ${isMobile ? "text-3xl" : "text-4xl"} mb-10 text-[#FFF9B0] tracking-tight uppercase`}>
        EXPERIENCE THE BENEFITS OF HOTEL-LIVING
      </h2>
      <div className="glass-card bg-[#460F54]/30 backdrop-blur-md rounded-xl p-8 border border-fuchsia-500/30 shadow-xl">
        <div className="grid grid-cols-1 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <span className="inline-block w-7 h-7 rounded-full bg-[#FFF9B0] mr-4 mt-1 flex-shrink-0 animate-pulse-glow"></span>
              <p className="text-[#FFF9B0] text-base md:text-xl font-medium">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
