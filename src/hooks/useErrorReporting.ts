import { useEffect, useCallback } from 'react';

interface ErrorReport {
  message: string;
  source: string;
  lineno: number;
  colno: number;
  stack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

export function useErrorReporting() {
  const reportError = useCallback((error: ErrorReport) => {
    // Log error for development
    console.error('[Error Report]:', error);
    
    // In production, this would send to error reporting service
    // For now, we'll just store in sessionStorage for debugging
    try {
      const existingErrors = JSON.parse(sessionStorage.getItem('app-errors') || '[]');
      existingErrors.push(error);
      
      // Keep only last 10 errors to prevent storage bloat
      const recentErrors = existingErrors.slice(-10);
      sessionStorage.setItem('app-errors', JSON.stringify(recentErrors));
      
      // Optional: Send to external service
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          event_category: 'Error',
          event_label: error.source
        });
      }
    } catch (storageError) {
      console.warn('[Error Reporting] Failed to store error:', storageError);
    }
  }, []);

  const handleGlobalError = useCallback((event: ErrorEvent) => {
    reportError({
      message: event.message,
      source: event.filename || 'unknown',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      stack: event.error?.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, [reportError]);

  const handleUnhandledRejection = useCallback((event: PromiseRejectionEvent) => {
    const error = event.reason;
    reportError({
      message: error?.message || 'Unhandled Promise Rejection',
      source: 'promise',
      lineno: 0,
      colno: 0,
      stack: error?.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }, [reportError]);

  useEffect(() => {
    // Listen for global JavaScript errors
    window.addEventListener('error', handleGlobalError);
    
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleGlobalError, handleUnhandledRejection]);

  const getStoredErrors = useCallback(() => {
    try {
      return JSON.parse(sessionStorage.getItem('app-errors') || '[]');
    } catch {
      return [];
    }
  }, []);

  const clearStoredErrors = useCallback(() => {
    try {
      sessionStorage.removeItem('app-errors');
    } catch (error) {
      console.warn('[Error Reporting] Failed to clear stored errors:', error);
    }
  }, []);

  return {
    reportError,
    getStoredErrors,
    clearStoredErrors
  };
}
