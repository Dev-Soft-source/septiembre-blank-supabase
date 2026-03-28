import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after 400px scroll
      setIsVisible(window.pageYOffset > 400);
    };

    const throttledScroll = () => {
      let timeout: NodeJS.Timeout;
      clearTimeout(timeout);
      timeout = setTimeout(toggleVisibility, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return <></>;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/30 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label="Back to top"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <ChevronUp className="w-5 h-5 text-primary-foreground" />
    </button>
  );
}