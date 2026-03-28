
import { useEffect } from 'react';

export const JoinUsScrollHandler = () => {
  useEffect(() => {
    // Listen for section toggle events
    const handleSectionToggle = (event: CustomEvent) => {
      setTimeout(() => {
        // Find the open section (the one that was just clicked)
        const openSection = document.querySelector('[data-state="open"]');
        if (openSection) {
          // Scroll to the top of the section
          openSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Small delay to ensure the section is fully open
    };

    // Add event listener
    window.addEventListener('section-toggle-event', handleSectionToggle as EventListener);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('section-toggle-event', handleSectionToggle as EventListener);
    };
  }, []);

  return null;
};
