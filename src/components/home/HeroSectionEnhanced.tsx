import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";

export function HeroSectionEnhanced() {
  const isMobile = useIsMobile();
  const { t, language } = useTranslation('home');
  const [isVisible, setIsVisible] = useState(false);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Animated slogan rotation for subtle engagement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex(prev => {
        const nextIndex = (prev + 1) % 4;
        // When we complete a full cycle of 4 slogans, move to next block
        if (nextIndex === 0) {
          setCurrentBlockIndex(prevBlock => (prevBlock + 1) % 3);
        }
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const slogans = t(`heroSection.slogans.block${currentBlockIndex + 1}`, { returnObjects: true }) as string[];

  const renderSlogan = (slogan: string, index: number) => (
    <div 
      key={index} 
      className={`
        flex items-center gap-2 p-0.5 rounded-lg transition-all duration-500 hover:scale-[1.02]
        ${isMobile ? "pl-1 mb-3" : ""}
        ${index === currentSloganIndex ? "animate-pulse" : ""}
      `}
      style={{
        backgroundColor: "transparent",
        animationDelay: `${index * 150}ms`
      }}
    >
      <div className="w-5 h-5 rounded-full bg-[#A2169A] flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12">
        <Check className="w-3 h-3 text-white transition-all duration-300" />
      </div>
      <p 
        className={`
          text-left font-bold transition-all duration-300 hover:tracking-wide
          ${isMobile ? "text-base whitespace-normal" : ['es', 'en', 'pt', 'ro'].includes(language) ? "text-sm sm:text-base md:text-lg" : "text-xs sm:text-sm md:text-base"}
        `}
        style={{
          fontFamily: "'Franklin Gothic Medium Condensed', 'Arial Narrow', sans-serif",
          color: "#FEF38F"
        }}
      >
        {slogan}
      </p>
    </div>
  );

  return (
    <section className="py-0 px-2 sm:px-4 overflow-hidden pt-1.5 w-full">
      <div className="container relative z-10 max-w-6xl mx-auto text-center">
        <div className={`pt-2 ${isMobile ? "mb-3" : "mb-0.25"}`}>
          {/* Enhanced neon sign with breathing effect */}
          <div className={`flex justify-center ${isMobile ? "mb-6 mt-7" : "mb-3 mt-2.5"}`}>
            <div 
              className={`
                relative ${isMobile ? "w-[85%]" : "w-[26%]"} mx-auto
                transform transition-all duration-1000 ease-out
                ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
              `}
              style={{ animationDelay: "200ms" }}
            >
              {/* Enhanced blue glow with breathing animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#006EF5] via-[#006EF5] to-purple-600 rounded-lg blur-xl opacity-75 animate-pulse"></div>
              <div className="relative rounded-lg border-2 border-[#D946EF] bg-[#8017B0] backdrop-blur-sm shadow-[0_0_15px_rgba(0,110,245,0.7)] px-[11px] my-0 py-0 hover:shadow-[0_0_25px_rgba(0,110,245,0.9)] transition-all duration-300 hover:scale-[1.02]">
                <p 
                  className={`
                    ${isMobile ? "text-xl" : "text-sm sm:text-base md:text-lg"} 
                    font-bold max-w-full text-center whitespace-nowrap
                    transition-all duration-300 hover:tracking-wider
                  `}
                  style={{ color: "#FFF9B0" }}
                >
                  {t('heroSection.revolutionHasCome')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Enhanced main title with sophisticated entrance */}
          <h1 
            className={`
              hero-slogan-main
              ${isMobile ? "" : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"} 
              font-bold mb-2 bg-size-200 animate-text bg-gradient-to-r from-[#ffff00] via-[#D4AF37] to-[#ffff00] bg-clip-text text-transparent
              transform transition-all duration-1000 ease-out hover:scale-[1.02]
              ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
            `}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 110, 245, 0.8)) drop-shadow(0 0 20px rgba(0, 110, 245, 0.6)) drop-shadow(0 0 30px rgba(0, 110, 245, 0.4))',
              animationDelay: "400ms",
              animationDuration: isMobile ? "3s" : "1s",
              animationTimingFunction: "ease-out"
            }}
          >
            {t('heroSection.liveInHotels')}
          </h1>

          {/* Enhanced subtitle with delayed entrance */}
          <h2 
            className={`
              hero-slogan-sub
              ${isMobile ? "" : "text-[1.3rem] sm:text-[1.6rem] md:text-[2.1rem] lg:text-[2.7rem]"} 
              font-semibold mb-6 bg-size-200 animate-text bg-gradient-to-r from-[#FFF7BD] via-[#FFF7BD] to-[#FFF7BD] bg-clip-text text-transparent
              transform transition-all duration-1000 ease-out hover:scale-[1.01]
              ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
            `}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 247, 189, 0.8)) drop-shadow(0 0 20px rgba(255, 247, 189, 0.6)) drop-shadow(0 0 30px rgba(255, 247, 189, 0.4))',
              animationDelay: "600ms",
              animationDuration: isMobile ? "3s" : "1s",
              animationTimingFunction: "ease-out"
            }}
          >
            {t('heroSection.boostYourLife')}
          </h2>
        </div>
        
        {/* Enhanced slogan container with sophisticated animations */}
        <div 
          className={`
            max-w-3xl mx-auto rounded-lg backdrop-blur-sm p-1 
            ${isMobile ? "mb-12 mt-3 px-0 w-[90%]" : "mb-3 w-[90%]"} 
            relative transform transition-all duration-1000 ease-out hover:scale-[1.01]
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
          `}
          style={{ animationDelay: "800ms" }}
        >
          {/* Enhanced glow with breathing effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#006EF5] via-[#006EF5] to-purple-600 rounded-lg blur-xl opacity-75 animate-pulse"></div>
          
          <div className="relative bg-[#8017B0] rounded-lg hover:bg-[#8e1bb7] transition-colors duration-300 group">
            {/* Mobile layout */}
            {isMobile ? (
              <div className="pl-0 py-[4px] px-[8px]">
                {slogans.map(renderSlogan)}
              </div>
            ) : (
              // Desktop layout
              ['es', 'en', 'pt', 'ro'].includes(language) ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-0.125">
                  <div className="space-y-0.125 py-1">
                    {renderSlogan(slogans[0], 0)}
                    {renderSlogan(slogans[2], 2)}
                  </div>
                  <div className="space-y-0.125 py-1">
                    {renderSlogan(slogans[1], 1)}
                    {renderSlogan(slogans[3], 3)}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-0.125">
                  <div className="space-y-0.125 py-1">
                    {slogans.slice(0, 2).map(renderSlogan)}
                  </div>
                  <div className="space-y-0.125 py-1">
                    {slogans.slice(2, 4).map(renderSlogan)}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}