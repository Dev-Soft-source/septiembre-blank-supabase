import { useEffect, useCallback } from 'react';
import { authCircuitBreaker, availabilityCircuitBreaker, bookingCircuitBreaker } from '@/utils/circuitBreaker';

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  navigationType: string;
}

interface PerformanceData {
  CLS: number | null;
  FCP: number | null;
  FID: number | null;
  LCP: number | null;
  TTFB: number | null;
  dbPoolUsage?: number;
  apiResponseTime?: number;
  errorRate?: number;
}

interface AlertThresholds {
  dbPoolUsage: number;      // 80% for 2 minutes
  apiResponseTimeP95: number; // 700ms for 2 minutes  
  errorRate: number;        // 1% for 1 minute
}

export function usePerformanceMonitoring() {
  const metrics: PerformanceData = {
    CLS: null,
    FCP: null,
    FID: null,
    LCP: null,
    TTFB: null,
    dbPoolUsage: null,
    apiResponseTime: null,
    errorRate: null
  };

  const alertThresholds: AlertThresholds = {
    dbPoolUsage: 80,      // 80%
    apiResponseTimeP95: 700, // 700ms
    errorRate: 1          // 1%
  };

  const reportMetric = useCallback((metric: WebVitalsMetric) => {
    // Store metric (could be sent to analytics service in production)
    // Update local metrics
    if (metric.name in metrics) {
      (metrics as any)[metric.name] = metric.value;
    }

    // Check for alert conditions
    checkAlertThresholds(metric);
    
    // Optional: Send to analytics service
    // This would be configured based on project needs
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_value: 'value' }
      });
    }
  }, []);

  const checkAlertThresholds = useCallback((metric: WebVitalsMetric) => {
    // API Response Time P95 monitoring
    if (metric.name === 'api_response_time_p95' && metric.value > alertThresholds.apiResponseTimeP95) {
      console.warn(`[ALERT] API P95 response time exceeded: ${metric.value}ms > ${alertThresholds.apiResponseTimeP95}ms`);
      triggerAlert('api_response_time_high', {
        value: metric.value,
        threshold: alertThresholds.apiResponseTimeP95
      });
    }

    // Database pool usage monitoring  
    if (metric.name === 'db_pool_usage' && metric.value > alertThresholds.dbPoolUsage) {
      console.warn(`[ALERT] DB pool usage exceeded: ${metric.value}% > ${alertThresholds.dbPoolUsage}%`);
      triggerAlert('db_pool_usage_high', {
        value: metric.value,
        threshold: alertThresholds.dbPoolUsage
      });
    }

    // Error rate monitoring
    if (metric.name === 'error_rate' && metric.value > alertThresholds.errorRate) {
      console.error(`[ALERT] Error rate exceeded: ${metric.value}% > ${alertThresholds.errorRate}%`);
      triggerAlert('error_rate_high', {
        value: metric.value,
        threshold: alertThresholds.errorRate
      });
    }
  }, [alertThresholds]);

  const triggerAlert = useCallback((alertType: string, data: any) => {
    // In production, this would send to Slack/email
    console.error(`[PRODUCTION ALERT] ${alertType}:`, data);
    
    // Store alert in session for debugging
    const alerts = JSON.parse(sessionStorage.getItem('performance-alerts') || '[]');
    alerts.push({
      type: alertType,
      data,
      timestamp: Date.now(),
      circuitBreakerStates: {
        auth: authCircuitBreaker.getState(),
        availability: availabilityCircuitBreaker.getState(), 
        booking: bookingCircuitBreaker.getState()
      }
    });
    sessionStorage.setItem('performance-alerts', JSON.stringify(alerts.slice(-20)));
  }, []);

  const trackCircuitBreakerMetrics = useCallback(() => {
    const authMetrics = authCircuitBreaker.getMetrics();
    const availabilityMetrics = availabilityCircuitBreaker.getMetrics();
    const bookingMetrics = bookingCircuitBreaker.getMetrics();

    // Report circuit breaker health
    reportMetric({
      name: 'circuit_breaker_auth_error_rate',
      value: authMetrics.requests > 0 ? (authMetrics.failures / authMetrics.requests) * 100 : 0,
      id: 'cb-auth-' + Date.now(),
      navigationType: 'circuit-breaker'
    });

    reportMetric({
      name: 'circuit_breaker_availability_error_rate',
      value: availabilityMetrics.requests > 0 ? (availabilityMetrics.failures / availabilityMetrics.requests) * 100 : 0,
      id: 'cb-avail-' + Date.now(),
      navigationType: 'circuit-breaker'
    });

    reportMetric({
      name: 'circuit_breaker_booking_error_rate',
      value: bookingMetrics.requests > 0 ? (bookingMetrics.failures / bookingMetrics.requests) * 100 : 0,
      id: 'cb-book-' + Date.now(),
      navigationType: 'circuit-breaker'
    });
  }, [reportMetric]);

  const observeWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Observe Core Web Vitals using Performance Observer API
    try {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          reportMetric({
            name: 'LCP',
            value: lastEntry.startTime,
            id: 'lcp-' + Date.now(),
            navigationType: 'navigate'
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            reportMetric({
              name: 'FCP',
              value: entry.startTime,
              id: 'fcp-' + Date.now(),
              navigationType: 'navigate'
            });
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        reportMetric({
          name: 'CLS',
          value: clsValue,
          id: 'cls-' + Date.now(),
          navigationType: 'navigate'
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          reportMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            id: 'fid-' + Date.now(),
            navigationType: 'navigate'
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // TTFB (Time to First Byte)
      const navigationEntries = performance.getEntriesByType('navigation') as any[];
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        reportMetric({
          name: 'TTFB',
          value: ttfb,
          id: 'ttfb-' + Date.now(),
          navigationType: navEntry.type
        });
      }

    } catch (error) {
      console.warn('[Performance] Web Vitals observation failed:', error);
    }
  }, [reportMetric]);

  useEffect(() => {
    // Start monitoring when component mounts
    observeWebVitals();
    
    // Track circuit breaker metrics every 30 seconds
    const circuitBreakerInterval = setInterval(trackCircuitBreakerMetrics, 30000);
    
    return () => {
      clearInterval(circuitBreakerInterval);
    };
  }, [observeWebVitals, trackCircuitBreakerMetrics]);

  return {
    metrics,
    reportMetric,
    getCircuitBreakerStatus: () => ({
      auth: authCircuitBreaker.getMetrics(),
      availability: availabilityCircuitBreaker.getMetrics(),
      booking: bookingCircuitBreaker.getMetrics()
    }),
    getAlerts: () => JSON.parse(sessionStorage.getItem('performance-alerts') || '[]')
  };
}