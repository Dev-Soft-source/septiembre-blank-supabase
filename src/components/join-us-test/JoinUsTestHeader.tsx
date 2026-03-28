
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Flame } from "lucide-react";

export function JoinUsTestHeader() {
  const isMobile = useIsMobile();
  
  return (
    <header className="mb-16 text-center">
      <div className="flex justify-center mb-4">
        <h1 className={`
          ${isMobile ? "text-4xl" : "text-3xl md:text-4xl"} 
          font-bold mb-4 text-[#FFF9B0] tracking-tight leading-tight
          bg-[#8017B0] py-2 px-8 rounded-lg inline-block
        `}>
          JOIN-US TEST
        </h1>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <Flame className="h-7 w-7 text-[#FFF9B0] mr-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          JOIN THE TEAM THAT'S RESHAPING HOW THE WORLD LIVES.
        </h2>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <p className="text-white text-xl mb-2">It's not a startup. It's a revolution. Be there from the start</p>
        <p className="text-white text-xl mb-2">Zero friction. Zero waste. Infinite potential</p>
        <p className="text-white text-xl mb-2">Fully Scalable. Full Legality. Hugely Profitable</p>
      </div>
    </header>
  );
}
