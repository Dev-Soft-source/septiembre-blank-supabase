import React from "react";
import { HotelDetailProps } from "@/types/hotel";
import { useTranslation } from "react-i18next";

interface HotelPropertyDetailsSectionProps {
  hotel: HotelDetailProps;
}

export function HotelPropertyDetailsSection({ hotel }: HotelPropertyDetailsSectionProps) {
  const { t } = useTranslation('hotels');
  
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-800/30 via-fuchsia-800/20 to-purple-900/30 backdrop-blur-sm border border-white/20 shadow-lg">
      <div className="space-y-4">
        {/* Description of the Property */}
        {hotel.description && (
          <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="font-bold text-purple-100 mb-2">{t('descriptionOfProperty')}</h3>
            <p className="text-white leading-relaxed">
              {hotel.description}
            </p>
          </div>
        )}
        
        {/* Ideal for those who enjoy */}
        {hotel.ideal_guests && (
          <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="font-bold text-purple-100 mb-2">{t('idealForThoseWhoEnjoy')}</h3>
            <p className="text-white leading-relaxed">
              {hotel.ideal_guests}
            </p>
          </div>
        )}
        
        {/* The atmosphere is */}
        {hotel.atmosphere && (
          <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="font-bold text-purple-100 mb-2">{t('theAtmosphereIs')}</h3>
            <p className="text-white leading-relaxed">
              {hotel.atmosphere}
            </p>
          </div>
        )}
        
        {/* The location is perfect for */}
        {hotel.perfect_location && (
          <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="font-bold text-purple-100 mb-2">{t('theLocationIsPerfectFor')}</h3>
            <p className="text-white leading-relaxed">
              {hotel.perfect_location}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}