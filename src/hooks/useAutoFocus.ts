import { useEffect, useRef } from 'react';

interface AutoFocusOptions {
  enabled?: boolean;
  delay?: number;
  selector?: string;
}

export function useAutoFocus<T extends HTMLElement = HTMLFormElement>(options: AutoFocusOptions = {}) {
  const {
    enabled = true,
    delay = 100,
    selector = 'input:not([type="hidden"]), select, textarea'
  } = options;
  
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const focusFirstField = () => {
      const container = containerRef.current || document;
      const firstField = container.querySelector(selector) as HTMLElement;
      
      if (firstField && typeof firstField.focus === 'function') {
        // Check if field is visible and not disabled
        const isVisible = firstField.offsetWidth > 0 && firstField.offsetHeight > 0;
        const isDisabled = firstField.hasAttribute('disabled');
        const isReadOnly = firstField.hasAttribute('readonly');
        
        if (isVisible && !isDisabled && !isReadOnly) {
          setTimeout(() => {
            firstField.focus();
          }, delay);
        }
      }
    };

    // Focus on mount
    focusFirstField();
    
  }, [enabled, delay, selector]);

  return containerRef;
}