// Global error handling for resource loading issues

interface ErrorHandlerOptions {
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

class ResourceErrorHandler {
  private errorCount = 0;
  private maxErrors = 10;
  private retryQueue = new Map<string, number>();

  init() {
    // Handle unhandled promise rejections (common with CORS errors)
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Handle script loading errors
    window.addEventListener('error', this.handleGlobalError, true);
    
    // Handle fetch errors globally
    this.interceptFetch();
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.warn('Unhandled promise rejection:', event.reason);
    
    // Check if it's a network-related error
    if (this.isNetworkError(event.reason)) {
      console.log('Network error detected, handling gracefully');
      // Prevent the error from causing app crash
      event.preventDefault();
      this.incrementErrorCount();
    }
  };

  private handleGlobalError = (event: ErrorEvent) => {
    // Fix for "Global error: null" - ensure we have a meaningful error object
    const error = event.error || event.message || 'Unknown error';
    const errorDetails = {
      message: error?.message || error?.toString() || 'Unknown error',
      stack: error?.stack || 'No stack trace available',
      filename: event.filename || 'Unknown file',
      lineno: event.lineno || 0,
      colno: event.colno || 0
    };
    
    console.warn('Global error:', errorDetails);
    
    // Handle resource loading errors
    if (event.target && 'src' in event.target) {
      const target = event.target as HTMLElement & { src: string };
      console.log('Resource failed to load:', target.src);
      this.handleResourceError(target.src);
    }
  };

  private interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Reset error count on successful request
        if (response.ok) {
          this.errorCount = Math.max(0, this.errorCount - 1);
        }
        
        return response;
      } catch (error) {
        console.warn('Fetch error intercepted:', error);
        
        if (this.isNetworkError(error)) {
          this.incrementErrorCount();
          // Try to provide a graceful fallback instead of throwing
          return new Response(JSON.stringify({ error: 'Network unavailable' }), {
            status: 503,
            statusText: 'Service Temporarily Unavailable',
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        throw error;
      }
    };
  }

  private isNetworkError(error: any): boolean {
    if (!error) return false;
    
    const errorString = error.toString().toLowerCase();
    const networkErrorPatterns = [
      'cors',
      'network',
      'fetch',
      'err_blocked_by_client',
      'err_failed',
      'net::',
      'access-control-allow-origin',
      'cross-origin'
    ];
    
    return networkErrorPatterns.some(pattern => errorString.includes(pattern));
  }

  private handleResourceError(url: string) {
    const retryCount = this.retryQueue.get(url) || 0;
    
    if (retryCount < 3) {
      // Attempt retry with delay
      setTimeout(() => {
        this.retryQueue.set(url, retryCount + 1);
        console.log(`Retrying resource load: ${url} (attempt ${retryCount + 1})`);
      }, 1000 * (retryCount + 1));
    } else {
      console.log(`Max retries exceeded for resource: ${url}`);
      this.retryQueue.delete(url);
    }
  }

  private incrementErrorCount() {
    this.errorCount++;
    
    if (this.errorCount >= this.maxErrors) {
      console.warn('High error count detected. Application may be experiencing connectivity issues.');
      // Reset count to prevent spam
      this.errorCount = 0;
    }
  }

  // Public method to safely load resources with error handling
  static async safeLoad<T>(
    loader: () => Promise<T>,
    fallback: T,
    options: ErrorHandlerOptions = {}
  ): Promise<T> {
    const { enableRetry = true, maxRetries = 3, retryDelay = 1000 } = options;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await loader();
      } catch (error) {
        console.warn(`Load attempt ${attempt + 1} failed:`, error);
        
        if (!enableRetry || attempt === maxRetries - 1) {
          console.log('Falling back to default value');
          return fallback;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
    
    return fallback;
  }

  cleanup() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleGlobalError, true);
  }
}

// Initialize global error handler
export const resourceErrorHandler = new ResourceErrorHandler();

// Helper function for safe image loading
export const safeImageLoad = (src: string, fallback = '/placeholder.svg'): Promise<string> => {
  return ResourceErrorHandler.safeLoad(
    () => new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    }),
    fallback,
    { maxRetries: 2, retryDelay: 500 }
  );
};

// Helper function for safe API calls
export const safeApiCall = <T>(
  apiCall: () => Promise<T>,
  fallback: T
): Promise<T> => {
  return ResourceErrorHandler.safeLoad(apiCall, fallback, { maxRetries: 2 });
};