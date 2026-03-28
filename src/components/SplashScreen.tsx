import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/Logo';
import { useTranslation as useI18n } from 'react-i18next';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [phraseVisible, setPhraseVisible] = useState(false);
  const { t } = useTranslation('splash');
  const { i18n } = useI18n();
  const isMobile = useIsMobile();
  
  const backgroundColor = '#7204B8';

  const phrases = [
    t('phrase1'),
    t('phrase2'),
    t('phrase3')
  ];

  const desktopPhrases = [
    {
      line1: t('phrase1Desktop.line1'),
      line2: t('phrase1Desktop.line2')
    },
    {
      line1: t('phrase2Desktop.line1'),
      line2: t('phrase2Desktop.line2')
    },
    {
      line1: t('phrase3Desktop.line1'),
      line2: t('phrase3Desktop.line2')
    }
  ];

  const mobilePhrases = [
    {
      line1: t('phrase1Mobile.line1'),
      line2: t('phrase1Mobile.line2')
    },
    {
      line1: t('phrase2Mobile.line1'),
      line2: t('phrase2Mobile.line2')
    },
    {
      line1: t('phrase3Mobile.line1'),
      line2: t('phrase3Mobile.line2')
    }
  ];

  useEffect(() => {
    // Start first phrase animation
    const initialDelay = setTimeout(() => {
      setPhraseVisible(true);
    }, 200);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (currentPhraseIndex >= phrases.length) {
      // All phrases shown, fade out splash screen
      const exitDelay = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 800); // Wait for fade out animation
      }, 500);
      return () => clearTimeout(exitDelay);
    }

    // Show current phrase for 3 seconds
    const phraseTimer = setTimeout(() => {
      setPhraseVisible(false);
      
      // After fade out, move to next phrase
      setTimeout(() => {
        setCurrentPhraseIndex(prev => prev + 1);
        setPhraseVisible(true);
      }, 800);
    }, 3000);

    return () => clearTimeout(phraseTimer);
  }, [currentPhraseIndex, phrases.length, onComplete]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(onComplete, 800);
  };

  if (!isVisible) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-800 opacity-0 pointer-events-none"
        style={{ backgroundColor }}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-800"
      style={{ backgroundColor }}
      onClick={handleClick}
    >
      {/* Logo */}
      <div className="absolute top-16 md:top-20">
        <Logo className="text-white" />
      </div>

      {/* Phrases */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div 
          className={`text-center transition-all duration-1000 ease-in-out transform ${
            phraseVisible && currentPhraseIndex < phrases.length 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          {isMobile ? (
            // Mobile: Two lines
            currentPhraseIndex < mobilePhrases.length && (
              <div className="space-y-2">
                <div className="text-white text-2xl md:text-4xl font-bold">
                  {mobilePhrases[currentPhraseIndex].line1}
                </div>
                <div className="text-white text-2xl md:text-4xl font-bold">
                  {mobilePhrases[currentPhraseIndex].line2}
                </div>
              </div>
            )
          ) : (
            // Desktop: Two lines (same as mobile now)
            currentPhraseIndex < desktopPhrases.length && (
              <div className="space-y-3">
                <div className="text-white text-3xl md:text-5xl font-bold">
                  {desktopPhrases[currentPhraseIndex].line1}
                </div>
                <div className="text-white text-3xl md:text-5xl font-bold">
                  {desktopPhrases[currentPhraseIndex].line2}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-8 text-white/70 text-sm animate-pulse">
        {t('clickToSkip')}
      </div>
    </div>
  );
}