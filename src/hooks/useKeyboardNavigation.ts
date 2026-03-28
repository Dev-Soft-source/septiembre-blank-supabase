import { useEffect, useCallback } from 'react';

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Tab navigation enhancement
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
    
    // ESC key handling for modals/overlays
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
      if (activeModal) {
        const closeButton = activeModal.querySelector('[aria-label="Close"], [data-dismiss]');
        if (closeButton instanceof HTMLElement) {
          closeButton.click();
        }
      }
    }
    
    // Arrow key navigation for lists and grids
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const focusedElement = document.activeElement;
      const focusableParent = focusedElement?.closest('[role="grid"], [role="listbox"], [role="menu"]');
      
      if (focusableParent) {
        event.preventDefault();
        handleArrowNavigation(event.key, focusableParent as HTMLElement);
      }
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    document.body.classList.remove('keyboard-navigation');
  }, []);

  const handleArrowNavigation = useCallback((key: string, container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).findIndex(
      el => el === document.activeElement
    );
    
    let nextIndex = currentIndex;
    
    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % focusableElements.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        break;
    }
    
    const nextElement = focusableElements[nextIndex] as HTMLElement;
    if (nextElement) {
      nextElement.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  return {
    // Utility functions for components to use
    focusFirst: (container: HTMLElement) => {
      const firstFocusable = container.querySelector(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (firstFocusable) firstFocusable.focus();
    },
    
    focusLast: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
      if (lastFocusable) lastFocusable.focus();
    }
  };
}