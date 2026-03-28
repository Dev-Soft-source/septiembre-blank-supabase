import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
export function HeroSection() {
  const isMobile = useIsMobile();
  const {
    t,
    language
  } = useTranslation('home');

  // Common slogans data to avoid duplication
  const slogans = [t('heroSection.slogans.getRidOfChores'), t('heroSection.slogans.selectHotelsByThemes'), t('heroSection.slogans.boostSocialLife'), t('heroSection.slogans.meetLikeMinded')];

  // Render a single slogan item consistently
  const renderSlogan = (slogan: string, index: number) => <div key={index} className={`flex items-center ${isMobile ? "gap-2 pl-1 mb-3" : "gap-2"} p-0.5 rounded-lg`} style={{
    backgroundColor: "transparent"
  }}>
      <div className="w-5 h-5 rounded-full bg-[#A2169A] flex-shrink-0 flex items-center justify-center">
        <Check className="w-3 h-3 text-white" />
      </div>
      <p className={`text-left font-bold ${isMobile ? "text-lg whitespace-normal" : ['es', 'en', 'pt', 'ro'].includes(language) ? "text-base sm:text-lg" : "text-sm sm:text-base"}`} style={{
      fontFamily: "'Franklin Gothic Medium Condensed', 'Arial Narrow', sans-serif",
      color: "#FEF38F"
    }}>
        {slogan}
      </p>
    </div>;
  return <section className="py-0 px-4 overflow-hidden pt-1.5 w-full">
      <div className="container relative z-10 max-w-6xl mx-auto text-center">
        <div className={`pt-2 ${isMobile ? "mb-3" : "mb-0.25"}`}>
          {/* New 1950s style neon sign slogan - with adjusted spacing: 50% bigger above, 50% smaller below */}
          <div className={`flex justify-center ${isMobile ? "mb-6 mt-7" : "mb-3 mt-2.5"}`}>
            <div className={`relative ${isMobile ? "w-[85%]" : "w-[26%]"} mx-auto`}>
              {/* Blue glow effect background - updated to #006EF5 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#006EF5] via-[#006EF5] to-purple-600 rounded-lg blur-xl opacity-75"></div>
              {/* Deep purple background */}
              <div className="relative rounded-lg border-2 border-[#D946EF] bg-[#8017B0] backdrop-blur-sm shadow-[0_0_15px_rgba(0,110,245,0.7)] px-[11px] my-0 py-0">
                <p className={`${isMobile ? "text-xl" : "text-sm sm:text-base md:text-lg"} font-bold max-w-full text-center whitespace-nowrap`} style={{
                color: "#FFF9B0"
              }}>{t('heroSection.revolutionHasCome')}</p>
              </div>
            </div>
          </div>
          
          {/* LIVE IN HOTELS with blue glow effect only - updated to #006EF5 */}
          <h1 className={`${isMobile ? "text-[43.2px] leading-[1.1]" : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"} font-bold mb-2 bg-size-200 animate-text bg-gradient-to-r from-[#ffff00] via-[#D4AF37] to-[#ffff00] bg-clip-text text-transparent`} style={{
          filter: 'drop-shadow(0 0 10px rgba(0, 110, 245, 0.8)) drop-shadow(0 0 20px rgba(0, 110, 245, 0.6)) drop-shadow(0 0 30px rgba(0, 110, 245, 0.4))'
        }}>
            {t('heroSection.liveInHotels')}
          </h1>

          {/* Boost Your Life! with 30% reduced size and updated color to #FFF7BD */}
          <h2 className={`${isMobile ? "text-[1.6rem]" : "text-[1.3rem] sm:text-[1.6rem] md:text-[2.1rem] lg:text-[2.7rem]"} font-semibold mb-6 bg-size-200 animate-text bg-gradient-to-r from-[#FFF7BD] via-[#FFF7BD] to-[#FFF7BD] bg-clip-text text-transparent`} style={{
          filter: 'drop-shadow(0 0 10px rgba(255, 247, 189, 0.8)) drop-shadow(0 0 20px rgba(255, 247, 189, 0.6)) drop-shadow(0 0 30px rgba(255, 247, 189, 0.4))'
        }}>
            {t('heroSection.boostYourLife')}
          </h2>
        </div>
        
        {/* Updated slogan container with purple background and blue glow effect - width adjusted to match filter bar */}
        {/* Doubled the spacing below on mobile (from mb-6 to mb-12) */}
        <div className={`max-w-3xl mx-auto rounded-lg backdrop-blur-sm p-1 ${isMobile ? "mb-12 mt-3 px-0 w-[90%]" : "mb-3 w-[90%]"} relative`}>
          {/* Blue glow effect background - updated to #006EF5 */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#006EF5] via-[#006EF5] to-purple-600 rounded-lg blur-xl opacity-75"></div>
          {/* Purple background */}
          <div className="relative bg-[#8017B0] rounded-lg">
            {/* For mobile: render all slogans in a single column */}
            {isMobile ? <div className="pl-0 py-[4px] px-[8px]">
                {slogans.map(renderSlogan)}
              </div> :
          // For desktop: Special layout for Spanish, English, Portuguese, and Romanian (2x2) vs other languages (2 columns with first 2 and last 2)
          ['es', 'en', 'pt', 'ro'].includes(language) ? <div className="grid grid-cols-2 gap-x-6 gap-y-0.125">
              <div className="space-y-0.125 py-1">
                {renderSlogan(slogans[0], 0)}
                {renderSlogan(slogans[2], 2)}
              </div>
              <div className="space-y-0.125 py-1">
                {renderSlogan(slogans[1], 1)}
                {renderSlogan(slogans[3], 3)}
              </div>
            </div> : <div className="grid grid-cols-2 gap-x-6 gap-y-0.125">
              <div className="space-y-0.125 py-1">
                {slogans.slice(0, 2).map(renderSlogan)}
              </div>
              <div className="space-y-0.125 py-1">
                {slogans.slice(2, 4).map(renderSlogan)}
              </div>
            </div>}
          </div>
        </div>
      </div>
    </section>;
}