
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function JoinUsHeader() {
  const isMobile = useIsMobile();
  
  return (
    <header className="mb-16 text-center">
      <div className="flex justify-center mb-4">
        {/* Added the same glow effect structure as the purple boxes */}
        <div className="relative group w-fit">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h1 className={`
            ${isMobile ? "text-2xl" : "text-2xl md:text-3xl"} 
            font-bold mb-4 text-[#FFF9B0] tracking-tight leading-tight
            bg-[#8017B0] py-2 px-8 rounded-lg inline-block relative
          `}>
            {isMobile ? (
              <>
                READY TO JOIN<br />
                THE REVOLUTION?
              </>
            ) : (
              "READY TO JOIN THE REVOLUTION?"
            )}
          </h1>
        </div>
      </div>
    </header>
  );
}
