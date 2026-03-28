import { useState } from 'react';

interface PanelTransitionOptions {
  animationDuration?: number;
  animationType?: 'fade' | 'slide';
}

export function usePanelTransition(options: PanelTransitionOptions = {}) {
  const { animationDuration = 200, animationType = 'fade' } = options;
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = async (callback: () => void) => {
    setIsTransitioning(true);
    
    // Add exit animation
    const container = document.querySelector('[data-panel-container]');
    if (container) {
      container.classList.add(
        animationType === 'fade' ? 'animate-fade-out' : 'animate-slide-out-right'
      );
    }

    // Wait for exit animation
    await new Promise(resolve => setTimeout(resolve, animationDuration));
    
    // Execute the transition (change content)
    callback();
    
    // Add enter animation
    if (container) {
      container.classList.remove(
        animationType === 'fade' ? 'animate-fade-out' : 'animate-slide-out-right'
      );
      container.classList.add(
        animationType === 'fade' ? 'animate-fade-in' : 'animate-slide-in-right'
      );
    }

    setTimeout(() => setIsTransitioning(false), animationDuration);
  };

  return { transitionTo, isTransitioning };
}