import React, { createContext, useContext, ReactNode } from 'react';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { SkipLinks } from './SkipLinks';

interface AccessibilityContextType {
  focusFirst: (container: HTMLElement) => void;
  focusLast: (container: HTMLElement) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const { focusFirst, focusLast } = useKeyboardNavigation();

  return (
    <AccessibilityContext.Provider value={{ focusFirst, focusLast }}>
      <SkipLinks />
      {children}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Enhanced focus indicators for keyboard navigation */
        .keyboard-navigation *:focus {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
          border-radius: 2px;
        }
        
        .keyboard-navigation button:focus,
        .keyboard-navigation a:focus,
        .keyboard-navigation input:focus,
        .keyboard-navigation select:focus,
        .keyboard-navigation textarea:focus {
          box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--primary));
        }
        
        /* Screen reader only class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .sr-only.focus-within:not-sr-only {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .keyboard-navigation *:focus {
            outline: 3px solid;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        `
      }} />
    </AccessibilityContext.Provider>
  );
}