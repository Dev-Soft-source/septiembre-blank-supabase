import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export function ScrollingMessage() {
  const { t } = useTranslation('header');
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (isMobile) {
      // Mobile: First appearance at 2:30 (150 seconds), then every 3 minutes
      const startMobileScroll = () => {
        setIsVisible(true);
        setIsScrolling(true);
        
        // Hide after scroll completes (15 seconds for mobile)
        setTimeout(() => {
          setIsVisible(false);
          setIsScrolling(false);
        }, 15000);
      };

      // First appearance at 2 minutes 30 seconds (150 seconds)
      const initialDelay = setTimeout(() => {
        startMobileScroll();
        
        // Repeat every 3 minutes (180 seconds)
        const mobileInterval = setInterval(() => {
          startMobileScroll();
        }, 180000);
        
        return () => clearInterval(mobileInterval);
      }, 150000); // 2.5 minutes = 150 seconds

      return () => {
        clearTimeout(initialDelay);
      };
    } else {
      // Desktop: original behavior
      let initialTimer: NodeJS.Timeout;
      let recurringTimer: NodeJS.Timeout;

      initialTimer = setTimeout(() => {
        showScrollingMessage();
        
        recurringTimer = setInterval(() => {
          showScrollingMessage();
        }, 5 * 60 * 1000); // 5 minutes
      }, 90 * 1000); // 90 seconds

      return () => {
        clearTimeout(initialTimer);
        clearInterval(recurringTimer);
      };
    }
  }, [isMobile]);

  const showScrollingMessage = () => {
    setIsVisible(true);
    setIsScrolling(true);
    
    // Hide after one scroll pass (32 seconds for desktop)
    setTimeout(() => {
      setIsVisible(false);
      setIsScrolling(false);
    }, 32000);
  };

  if (!isVisible) return null;

  const message = t('header.scrollingMessage');

  return (
    <div 
      className={`overflow-hidden whitespace-nowrap relative ${
        isMobile 
          ? 'w-full bg-[#8017B0] py-2 text-center' 
          : 'w-[118px] h-[20px]'
      }`}
      style={{ 
        zIndex: isMobile ? 150 : 10
      }}
    >
      <div
        className={`
          inline-block text-[#FFEB3B] font-semibold
          ${isMobile ? 'text-sm w-full px-4' : 'text-[12px]'}
          ${isScrolling ? 'marquee-scroll' : ''}
        `}
        style={{
          animation: isScrolling 
            ? (isMobile ? 'scroll-left 15s linear 1' : 'scroll-left 32s linear 1') 
            : 'none',
          animationFillMode: 'forwards'
        }}
      >
        {message}
      </div>
    </div>
  );
}