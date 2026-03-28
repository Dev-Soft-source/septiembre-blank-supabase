
import React from "react";
import { HotelDetailProps } from "@/types/hotel";
import { useTranslation } from "react-i18next";

interface HotelAtAGlanceSectionProps {
  hotel: HotelDetailProps;
  formatStayLengths: () => string;
  getIdealGuestsText: () => string;
  getPerfectLocationText: () => string;
  getAtmosphereText: () => string;
  lowercase: (text: string | null | undefined) => string;
}

export function HotelAtAGlanceSection({ 
  hotel, 
  formatStayLengths, 
  getIdealGuestsText, 
  getPerfectLocationText, 
  getAtmosphereText, 
  lowercase 
}: HotelAtAGlanceSectionProps) {
  const { t } = useTranslation('hotels');
  
  return (
    <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-800/30 via-fuchsia-800/20 to-purple-900/30 backdrop-blur-sm border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white text-left">{t('atAGlance')}</h2>
      
      {/* Enhanced descriptive blocks with purple background and strong glow */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
          <p className="text-white leading-relaxed">
            {t('propertyDescription', { 
              propertyType: hotel.property_type ? hotel.property_type.toLowerCase() : "property",
              style: hotel.property_style || "welcoming",
              stayLengths: formatStayLengths()
            })}
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
          <p className="text-white leading-relaxed">
            <span className="font-bold text-purple-100">{t('idealFor')}</span> {getIdealGuestsText()}
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
          <p className="text-white leading-relaxed">
            <span className="font-bold text-purple-100">{t('atmosphere')}</span> {getAtmosphereText()}
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
          <p className="text-white leading-relaxed">
            <span className="font-bold text-purple-100">{t('locationPerfectFor')}</span> {getPerfectLocationText()}
          </p>
        </div>
        
        {/* Description with enhanced styling */}
        {hotel.description && (
          <div className="p-4 rounded-lg bg-[#6000B3] backdrop-blur-sm border border-white/20 shadow-[0_0_50px_rgba(96,0,179,0.8),0_0_80px_rgba(96,0,179,0.4)] hover:shadow-[0_0_60px_rgba(96,0,179,1),0_0_100px_rgba(96,0,179,0.6)] transition-all duration-300 transform hover:scale-[1.02]">
            <p className="text-white leading-relaxed">
              {hotel.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
