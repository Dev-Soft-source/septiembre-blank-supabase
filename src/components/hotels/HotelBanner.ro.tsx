import React from "react";

export function HotelBannerRO() {
  return (
    <div className="w-full flex justify-center mb-16 animate-fade-in">
      <div className="relative max-w-4xl mx-auto px-4">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-fuchsia-800/70 to-purple-900/80 rounded-2xl blur-xl animate-pulse"></div>
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl border border-[#7E26A6]/50 shadow-[0_0_30px_rgba(126,38,166,0.3)]"></div>
        
        {/* Main content container */}
        <div className="relative bg-gradient-to-br from-purple-900/40 via-fuchsia-900/30 to-purple-800/40 backdrop-blur-sm rounded-2xl p-8 border border-[#7E26A6]/30">
          {/* Subtle floating animation */}
          <div className="animate-[float_6s_ease-in-out_infinite]">
            {/* Line 1 - Mobile responsive, no periods */}
            <h2 className="text-[#FFD700] font-bold uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-4 drop-shadow-[0_2px_4px_rgba(255,215,0,0.3)]">
              NU EXISTĂ SEZOANE MEDII SAU JOASE
            </h2>
            
            {/* Line 2 - Correct mobile line breaks, no stars */}
            <p className="text-[#FFD700] font-bold uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl text-center leading-relaxed drop-shadow-[0_2px_4px_rgba(255,215,0,0.2)]">
              <span className="block sm:inline">EXISTĂ DOAR HOTELURI</span>{' '}
              <span className="block sm:inline">FĂRĂ HOTEL-LIVING</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}