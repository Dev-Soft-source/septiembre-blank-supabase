import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

// Starfield background component
const StarfieldBackground = () => {
  const [stars, setStars] = useState<Array<{
    id: number;
    left: number;
    top: number;
    size: number;
    animationDelay: number;
    driftDelay: number;
    isAccent: boolean;
  }>>([]);

  useEffect(() => {
    setStars(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      animationDelay: Math.random() * 10,
      driftDelay: Math.random() * 20,
      isAccent: Math.random() > 0.8
    })));
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .starfield-container {
            position: absolute;
            top: -80px;
            left: -80px;
            right: -80px;
            bottom: -80px;
            pointer-events: none;
            overflow: hidden;
            z-index: 0;
          }
          
          .star-particle {
            position: absolute;
            border-radius: 50%;
            will-change: transform, opacity;
            box-shadow: 0 0 3px currentColor;
          }
          
          @media (prefers-reduced-motion: no-preference) {
            .star-particle {
              animation: 
                starFloat 20s infinite ease-in-out,
                starFlicker 4s infinite ease-in-out;
            }
          }
          
          @keyframes starFloat {
            0% { transform: translate3d(0, 0, 0); }
            25% { transform: translate3d(8px, -12px, 0); }
            50% { transform: translate3d(-6px, -8px, 0); }
            75% { transform: translate3d(-8px, 6px, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          
          @keyframes starFlicker {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.9; }
          }
        `
      }} />
      <div className="starfield-container">
        {stars.map(star => (
          <div
            key={star.id}
            className="star-particle"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.isAccent ? '#B794D6' : '#FFFFFF',
              color: star.isAccent ? '#B794D6' : '#FFFFFF',
              animationDelay: `${star.driftDelay}s, ${star.animationDelay}s`,
              animationDuration: `${15 + Math.random() * 10}s, ${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export function ExpandableIntro() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation('aboutUs');

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Get the hidden paragraphs with proper fallback
  const hiddenParagraphs = (() => {
    try {
      const result = t('intro.hidden', { returnObjects: true });
      console.log('Translation result:', result);
      if (Array.isArray(result)) {
        return result;
      }
      // Fallback if translation fails
      return [
        "Since 2021, we have been developing the Hotel-Living model to solve multiple challenges of modern society and the hotel industry simultaneously.",
        "This model not only tackles the massive underutilization of hotel rooms worldwide but also eliminates one of today's greatest social problems: loneliness. Traditional living models are outdated, based on large family households that no longer exist, leaving millions of people isolated in fixed locations while modern life demands flexibility, mobility, and shared experiences.",
        "Hotel Living proposes a complete transformation of the way we live and travel, creating better lifestyles for people who want more freedom and social connection, while giving hotels a new opportunity to fully use their resources.",
        "Today, what you see publicly is only 20% of the full model. Over time, entirely new modules and services—never seen before in the sector—will be deployed, offering unique solutions for both guests and hotels, aiming to reshape the global accommodation industry."
      ];
    } catch (error) {
      console.error('Translation error:', error);
      return [
        "Since 2021, we have been developing the Hotel-Living model to solve multiple challenges of modern society and the hotel industry simultaneously.",
        "This model not only tackles the massive underutilization of hotel rooms worldwide but also eliminates one of today's greatest social problems: loneliness. Traditional living models are outdated, based on large family households that no longer exist, leaving millions of people isolated in fixed locations while modern life demands flexibility, mobility, and shared experiences.",
        "Hotel Living proposes a complete transformation of the way we live and travel, creating better lifestyles for people who want more freedom and social connection, while giving hotels a new opportunity to fully use their resources.",
        "Today, what you see publicly is only 20% of the full model. Over time, entirely new modules and services—never seen before in the sector—will be deployed, offering unique solutions for both guests and hotels, aiming to reshape the global accommodation industry."
      ];
    }
  })();

  return (
    <div className="w-full max-w-[900px] mx-auto mt-6 mb-4 px-4">
      <style dangerouslySetInnerHTML={{
        __html: `
          .floating-card-container {
            position: relative;
            will-change: transform;
          }
          
          .floating-card {
            border-radius: 12px;
            padding: 16px 20px;
            background-color: #7E26A6;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
            position: relative;
            z-index: 1;
            will-change: transform, box-shadow;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          @media (prefers-reduced-motion: no-preference) {
            .floating-card {
              animation: cardFloat 7s ease-in-out infinite;
            }
            
            .floating-card::before {
              content: '';
              position: absolute;
              top: -8px;
              left: -8px;
              right: -8px;
              bottom: -8px;
              background: radial-gradient(circle, rgba(126, 38, 166, 0.3) 0%, transparent 60%);
              border-radius: 16px;
              filter: blur(20px);
              z-index: -1;
              opacity: 0.5;
              animation: glowPulse 7s ease-in-out infinite;
            }
            
            .floating-card:hover {
              transform: scale(1.02) translateY(-4px);
              box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.3);
            }
            
            .floating-card:hover::before {
              opacity: 0.7;
              filter: blur(25px);
            }
          }
          
          @keyframes cardFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          
          @keyframes glowPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.6; }
          }
          
          @media (hover: none) {
            .floating-card:hover {
              transform: none !important;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25) !important;
            }
            
            .floating-card:hover::before {
              opacity: 0.6 !important;
              filter: blur(25px) !important;
            }
          }
        `
      }} />
      
      <div className="floating-card-container">
        <StarfieldBackground />
        
        <div className="floating-card">
          <p className="text-white text-sm md:text-base font-medium" style={{ lineHeight: '1.4' }}>
            {t('intro.visible') || "Hotel Living is an American company founded in California by a multidisciplinary team with extensive experience in the hotel sector."}{' '}
            <button
              onClick={toggleExpansion}
              className="text-[#FFE266] font-medium hover:text-[#FFE266] transition-colors duration-300 cursor-pointer underline"
            >
              {isExpanded ? (t('intro.readLess') || "Read less") : (t('intro.readMore') || "Read more")}
            </button>
          </p>
          
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            {hiddenParagraphs.map((paragraph: string, index: number) => (
              <p key={index} className="text-white text-sm md:text-base font-medium mb-3 last:mb-0" style={{ lineHeight: '1.4' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}