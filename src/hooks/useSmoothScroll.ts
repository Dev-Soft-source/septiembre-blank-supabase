import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    // Enhanced smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (!target || target.tagName !== 'A') return;
      
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      const targetElement = document.getElementById(href.slice(1));
      if (!targetElement) return;
      
      e.preventDefault();
      
      // Add smooth scroll target class for better positioning
      targetElement.classList.add('smooth-scroll-target');
      
      // Perform smooth scroll with options for better browser support
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Update URL without causing jump
      history.pushState(null, '', href);
      
      // Focus target for accessibility
      setTimeout(() => {
        targetElement.focus({ preventScroll: true });
      }, 500);
    };

    // Attach to document for all anchor links
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Utility function for programmatic smooth scrolling
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('smooth-scroll-target');
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    scrollToElement,
    scrollToTop
  };
}