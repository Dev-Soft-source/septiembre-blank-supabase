// Fix for ResizeObserver loop errors
// This utility provides debounced ResizeObserver to prevent infinite loops

let debounceTimer: number | null = null;
const observerCallbacks = new Map<Element, () => void>();

// Debounced ResizeObserver to prevent loops
const debouncedResizeObserver = new ResizeObserver((entries) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = window.setTimeout(() => {
    // Use requestAnimationFrame to ensure DOM is stable
    requestAnimationFrame(() => {
      entries.forEach((entry) => {
        const callback = observerCallbacks.get(entry.target);
        if (callback) {
          try {
            callback();
          } catch (error) {
            console.warn('ResizeObserver callback error:', error);
          }
        }
      });
    });
  }, 16); // ~60fps
});

export const safeResizeObserver = {
  observe: (element: Element, callback: () => void) => {
    observerCallbacks.set(element, callback);
    debouncedResizeObserver.observe(element);
  },
  
  unobserve: (element: Element) => {
    observerCallbacks.delete(element);
    debouncedResizeObserver.unobserve(element);
  },
  
  disconnect: () => {
    observerCallbacks.clear();
    debouncedResizeObserver.disconnect();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }
};

// Patch native ResizeObserver to suppress loop warnings
const originalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class extends originalResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super((entries, observer) => {
      try {
        // Wrap callback in requestAnimationFrame to prevent loops
        requestAnimationFrame(() => {
          callback(entries, observer);
        });
      } catch (error) {
        // Suppress ResizeObserver loop errors that don't affect functionality
        if (error.message.includes('ResizeObserver loop')) {
          console.debug('ResizeObserver loop suppressed (non-critical)');
          return;
        }
        throw error;
      }
    });
  }
};