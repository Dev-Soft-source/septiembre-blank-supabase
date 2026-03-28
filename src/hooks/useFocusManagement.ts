import React, { useEffect, useRef, useCallback } from 'react';

interface FocusTrapOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  allowOutsideClick?: boolean;
}

export function useFocusTrap({
  autoFocus = true,
  restoreFocus = true,
  allowOutsideClick = false
}: FocusTrapOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
      .filter(el => {
        const element = el as HTMLElement;
        return element.offsetWidth > 0 && 
               element.offsetHeight > 0 && 
               !element.hidden;
      }) as HTMLElement[];
  }, []);

  // Handle Tab key navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift+Tab: move to previous element
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: move to next element  
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [getFocusableElements]);

  // Handle click outside (if not allowed)
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (allowOutsideClick) return;
    
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      event.preventDefault();
      event.stopPropagation();
      
      // Refocus the first focusable element
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [allowOutsideClick, getFocusableElements]);

  // Initialize focus trap
  useEffect(() => {
    if (!containerRef.current) return;

    // Store previously focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Auto-focus first element if enabled
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);

      // Restore focus if enabled
      if (restoreFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [autoFocus, restoreFocus, handleKeyDown, handleClickOutside, getFocusableElements]);

  return containerRef;
}

/**
 * Hook for managing roving tabindex navigation (for lists, grids, etc.)
 */
interface RovingTabIndexOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  wrap?: boolean;
  autoFocus?: boolean;
}

export function useRovingTabIndex({
  orientation = 'vertical',
  wrap = true,
  autoFocus = true
}: RovingTabIndexOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const getNavigableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    return Array.from(containerRef.current.children)
      .filter(el => {
        const element = el as HTMLElement;
        return !element.hidden && 
               !element.hasAttribute('disabled') &&
               element.getAttribute('aria-disabled') !== 'true';
      }) as HTMLElement[];
  }, []);

  const updateTabIndices = useCallback((newActiveIndex: number) => {
    const elements = getNavigableElements();
    
    elements.forEach((element, index) => {
      element.setAttribute('tabindex', index === newActiveIndex ? '0' : '-1');
      if (index === newActiveIndex) {
        element.focus();
      }
    });
    
    setActiveIndex(newActiveIndex);
  }, [getNavigableElements]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const elements = getNavigableElements();
    if (elements.length === 0) return;

    let newIndex = activeIndex;
    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = activeIndex + 1;
          handled = true;
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = activeIndex - 1;
          handled = true;
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = activeIndex + 1;
          handled = true;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = activeIndex - 1;
          handled = true;
        }
        break;
      case 'Home':
        newIndex = 0;
        handled = true;
        break;
      case 'End':
        newIndex = elements.length - 1;
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      
      // Handle wrapping
      if (wrap) {
        if (newIndex < 0) newIndex = elements.length - 1;
        if (newIndex >= elements.length) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(newIndex, elements.length - 1));
      }
      
      updateTabIndices(newIndex);
    }
  }, [activeIndex, orientation, wrap, getNavigableElements, updateTabIndices]);

  // Initialize roving tabindex
  useEffect(() => {
    if (!containerRef.current) return;

    const elements = getNavigableElements();
    if (elements.length === 0) return;

    // Set initial tabindex values
    elements.forEach((element, index) => {
      element.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });

    if (autoFocus) {
      elements[0].focus();
    }

    // Add event listener
    containerRef.current.addEventListener('keydown', handleKeyDown);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleKeyDown, getNavigableElements, autoFocus]);

  return {
    containerRef,
    activeIndex,
    setActiveIndex: updateTabIndices
  };
}