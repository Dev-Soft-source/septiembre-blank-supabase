import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    setProgress(0);

    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIsTransitioning(false), 200);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    return () => {
      clearInterval(progressTimer);
    };
  }, [location.pathname]);

  return {
    isTransitioning,
    progress: Math.min(progress, 100)
  };
}