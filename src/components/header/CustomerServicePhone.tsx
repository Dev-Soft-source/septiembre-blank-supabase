import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export function CustomerServicePhone() {
  const { t } = useTranslation('header');
  const isMobile = useIsMobile();
  const [isGlowing, setIsGlowing] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Mobile starts hidden, desktop shows after useEffect

  useEffect(() => {
    
    // All devices (desktop, tablet, mobile): follow same timing pattern
    setIsVisible(false); // Explicitly ensure hidden state
    
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Hide after 7 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        
        // Start repeating cycle every 180 seconds (3 minutes)
        const repeatInterval = setInterval(() => {
          setIsVisible(true);
          
          setTimeout(() => {
            setIsVisible(false);
          }, 7000);
        }, 180000); // 3 minutes
        
        return () => clearInterval(repeatInterval);
      }, 7000); // 7 seconds visible
      
    }, 45000); // 45 seconds initial delay

    return () => {
      clearTimeout(initialTimer);
    };
  }, [isMobile]);

  // Don't render when not visible (applies to all devices)
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`
        bg-[#8017B0] rounded-lg transition-all duration-1000 ease-out
        ${isGlowing ? 'animate-pulse-glow' : ''}
        ${isMobile 
          ? 'fixed top-1/2 right-2 transform -translate-y-1/2 z-50 text-[9px] px-1 py-0.5 scale-[1.35] text-center' 
          : 'relative z-10 text-[11px] px-1.5 py-0.5 scale-[1.125] text-right'
        }
      `}
    >
      <div className="text-[#FFEB3B] font-bold leading-tight">
        {t('header.customerService.label')}
      </div>
      <div className="text-[#FFEB3B] font-semibold">
        {t('header.customerService.phone')}
      </div>
    </div>
  );
}