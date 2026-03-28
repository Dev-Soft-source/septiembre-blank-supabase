/**
 * Enhanced stability monitoring hook for production scale
 * Tracks database performance, API response times, and system health
 */

import { useEffect, useCallback, useRef } from 'react';
import { globalCache } from '@/utils/caching';
import { authCircuitBreaker, availabilityCircuitBreaker, bookingCircuitBreaker } from '@/utils/circuitBreaker';

interface StabilityMetrics {
  dbOperations: {
    totalQueries: number;
    avgResponseTime: number;
    slowQueries: number; // queries > 1.5s
    failedQueries: number;
  };
  apiEndpoints: {
    totalRequests: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    errorRate: number;
  };
  cache: {
    hitRate: number;
    size: number;
    evictions: number;
  };
  system: {
    memoryUsage: number;
    connectionPool: number;
    isHealthy: boolean;
  };
}

export function useStabilityMonitoring() {
  const metricsRef = useRef<StabilityMetrics>({
    dbOperations: {
      totalQueries: 0,
      avgResponseTime: 0,
      slowQueries: 0,
      failedQueries: 0
    },
    apiEndpoints: {
      totalRequests: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      errorRate: 0
    },
    cache: {
      hitRate: 0,
      size: 0,
      evictions: 0
    },
    system: {
      memoryUsage: 0,
      connectionPool: 0,
      isHealthy: true
    }
  });

  const responseTimes = useRef<number[]>([]);
  const dbQueryTimes = useRef<number[]>([]);

  const trackDatabaseOperation = useCallback((
    operationType: string,
    duration: number,
    success: boolean
  ) => {
    const metrics = metricsRef.current.dbOperations;
    metrics.totalQueries++;
    
    if (success) {
      dbQueryTimes.current.push(duration);
      // Keep only last 100 measurements
      if (dbQueryTimes.current.length > 100) {
        dbQueryTimes.current = dbQueryTimes.current.slice(-100);
      }
      
      // Calculate average
      metrics.avgResponseTime = dbQueryTimes.current.reduce((a, b) => a + b, 0) / dbQueryTimes.current.length;
      
      // Track slow queries (> 1500ms per requirements)
      if (duration > 1500) {
        metrics.slowQueries++;
        console.warn(`[DB] Slow query detected: ${operationType} took ${duration}ms`);
      }
    } else {
      metrics.failedQueries++;
    }

    // Check for database performance degradation
    if (metrics.avgResponseTime > 1000 && metrics.totalQueries > 10) {
      console.warn(`[STABILITY] Database performance degraded: avg ${metrics.avgResponseTime}ms`);
    }
  }, []);

  const trackApiRequest = useCallback((
    endpoint: string,
    duration: number,
    success: boolean
  ) => {
    const metrics = metricsRef.current.apiEndpoints;
    metrics.totalRequests++;
    
    if (success) {
      responseTimes.current.push(duration);
      // Keep only last 100 measurements
      if (responseTimes.current.length > 100) {
        responseTimes.current = responseTimes.current.slice(-100);
      }
      
      // Calculate P95 and P99
      const sorted = [...responseTimes.current].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);
      const p99Index = Math.floor(sorted.length * 0.99);
      
      metrics.p95ResponseTime = sorted[p95Index] || 0;
      metrics.p99ResponseTime = sorted[p99Index] || 0;
      
      // Update error rate
      const errorCount = responseTimes.current.length - responseTimes.current.filter((_, i, arr) => 
        i === arr.length - 1 ? success : true
      ).length;
      metrics.errorRate = (errorCount / metrics.totalRequests) * 100;
    }

    // Alert if P95 exceeds 700ms for multiple requests
    if (metrics.p95ResponseTime > 700 && metrics.totalRequests > 5) {
      console.warn(`[STABILITY] API P95 response time high: ${metrics.p95ResponseTime}ms for ${endpoint}`);
    }

    // Alert if error rate exceeds 1%
    if (metrics.errorRate > 1 && metrics.totalRequests > 10) {
      console.error(`[STABILITY] Error rate high: ${metrics.errorRate}% for ${endpoint}`);
    }
  }, []);

  const updateCacheMetrics = useCallback(() => {
    const cacheStats = globalCache.getStats();
    const metrics = metricsRef.current.cache;
    
    metrics.hitRate = cacheStats.hitRate * 100;
    metrics.size = cacheStats.size;
    metrics.evictions = cacheStats.evictions;

    // Warn if cache hit rate is low
    if (metrics.hitRate < 50 && cacheStats.hits + cacheStats.misses > 20) {
      console.warn(`[STABILITY] Low cache hit rate: ${metrics.hitRate}%`);
    }
  }, []);

  const updateSystemMetrics = useCallback(() => {
    const metrics = metricsRef.current.system;
    
    // Estimate memory usage (simplified)
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memInfo = (performance as any).memory;
      metrics.memoryUsage = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100;
    }

    // Check circuit breaker states for overall health
    const authHealth = authCircuitBreaker.getHealthStatus();
    const availabilityHealth = availabilityCircuitBreaker.getHealthStatus();
    const bookingHealth = bookingCircuitBreaker.getHealthStatus();
    
    metrics.isHealthy = authHealth.isHealthy && availabilityHealth.isHealthy && bookingHealth.isHealthy;
    
    // Simulate connection pool monitoring (would be actual in production)
    metrics.connectionPool = Math.min(
      (metricsRef.current.dbOperations.totalQueries / 100) * 10,
      80 // Max 80% utilization simulation
    );

    // Alert if connection pool usage high
    if (metrics.connectionPool > 80) {
      console.warn(`[STABILITY] Connection pool usage high: ${metrics.connectionPool}%`);
    }

    if (!metrics.isHealthy) {
      console.error(`[STABILITY] System health degraded - circuit breakers not healthy`);
    }
  }, []);

  const getStabilityReport = useCallback(() => {
    updateCacheMetrics();
    updateSystemMetrics();
    
    return {
      metrics: metricsRef.current,
      circuitBreakers: {
        auth: authCircuitBreaker.getMetrics(),
        availability: availabilityCircuitBreaker.getMetrics(),
        booking: bookingCircuitBreaker.getMetrics()
      },
      recommendations: generateRecommendations()
    };
  }, [updateCacheMetrics, updateSystemMetrics]);

  const generateRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    const metrics = metricsRef.current;

    if (metrics.dbOperations.avgResponseTime > 1000) {
      recommendations.push('Consider optimizing database queries or increasing connection pool size');
    }

    if (metrics.apiEndpoints.p95ResponseTime > 700) {
      recommendations.push('API response times are high - check for bottlenecks');
    }

    if (metrics.cache.hitRate < 60) {
      recommendations.push('Cache hit rate is low - review caching strategy');
    }

    if (metrics.system.connectionPool > 70) {
      recommendations.push('Connection pool usage high - consider scaling database resources');
    }

    if (metrics.apiEndpoints.errorRate > 0.5) {
      recommendations.push('Error rate elevated - investigate failing operations');
    }

    return recommendations;
  }, []);

  useEffect(() => {
    // Periodic stability monitoring every 30 seconds
    const stabilityInterval = setInterval(() => {
      updateCacheMetrics();
      updateSystemMetrics();
      
      const report = getStabilityReport();
    }, 30000);

    return () => {
      clearInterval(stabilityInterval);
    };
  }, [updateCacheMetrics, updateSystemMetrics, getStabilityReport]);

  return {
    trackDatabaseOperation,
    trackApiRequest,
    getStabilityReport,
    getCurrentMetrics: () => metricsRef.current
  };
}
