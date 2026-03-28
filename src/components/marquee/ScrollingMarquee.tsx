import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isPublicPage } from '@/utils/pageUtils';
import { useMarqueeMessages } from '@/hooks/useMarqueeMessages';

export const ScrollingMarquee: React.FC = () => {
  const location = useLocation();
  const { messages, isLoading } = useMarqueeMessages();
  const [displayText, setDisplayText] = useState('');
  const [randomStartIndex, setRandomStartIndex] = useState(0);

  // Determine if component should be visible
  const shouldShow = isPublicPage(location.pathname) && !isLoading && messages.length > 0;

  useEffect(() => {
    if (!shouldShow || messages.length === 0) return;

    // Start from a random message index for variety - set once per session
    const startIndex = Math.floor(Math.random() * messages.length);
    setRandomStartIndex(startIndex);
    
    // Create a continuous marquee text by concatenating messages
    // Reorder messages starting from random index
    const reorderedMessages = [
      ...messages.slice(startIndex),
      ...messages.slice(0, startIndex)
    ];
    
    // Create continuous text with proper spacing between messages
    // Repeat the text twice to ensure seamless continuous scrolling
    const singleLoop = reorderedMessages.join('     •     ');
    const continuousText = singleLoop + '     •     ' + singleLoop + '     •     ';
    setDisplayText(continuousText);
    
    console.log(`Marquee: Starting with message ${startIndex + 1}/${messages.length}, continuous scrolling enabled`);
  }, [shouldShow, messages]);

  // Don't render anything if component shouldn't show
  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-6 md:h-6 max-md:h-8 overflow-hidden z-40"
      style={{ 
        backgroundColor: '#9526A6',
        marginBottom: '0px'
      }}
      role="status"
      aria-live="polite"
      aria-label="Live updates from Hotel Living"
    >
      <div
        className="whitespace-nowrap text-[#FFFFFF] font-semibold py-0.5 marquee-scroll"
        style={{
          fontSize: '11px',
          fontWeight: 600,
          lineHeight: '14px',
          animation: 'scroll-left 13s linear infinite',
          willChange: 'transform'
        }}
      >
        {displayText}
      </div>
    </div>
  );
};