import React from 'react';
import { usePageTransition } from '@/hooks/usePageTransition';
import { LoadingBar } from '@/components/ui/loading-bar';

export function PageTransitionBar() {
  const { isTransitioning, progress } = usePageTransition();

  if (!isTransitioning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <LoadingBar 
        progress={progress} 
        height="thin"
        className="bg-transparent"
      />
    </div>
  );
}