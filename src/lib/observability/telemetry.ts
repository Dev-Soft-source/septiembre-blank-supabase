/**
 * OpenTelemetry Integration for Metrics & Observability
 * Tracks p50/p95/p99, error rates, DB pool usage, cache hit %, breaker state
 */

interface MetricEntry {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
  type: 'counter' | 'gauge' | 'histogram';
}

interface TraceEntry {
  traceId: string;
  spanId: string;
  operation: string;
  duration: number;
  timestamp: number;
  status: 'success' | 'error';
  tags?: Record<string, string>;
}

class TelemetryCollector {
  private metrics: MetricEntry[] = [];
  private traces: TraceEntry[] = [];
  private readonly maxEntries = 10000;

  // Performance metrics collection
  recordLatency(operation: string, duration: number, tags?: Record<string, string>) {
    this.metrics.push({
      name: `operation.duration`,
      value: duration,
      timestamp: Date.now(),
      tags: { operation, ...tags },
      type: 'histogram'
    });

    // Trim old entries
    if (this.metrics.length > this.maxEntries) {
      this.metrics = this.metrics.slice(-this.maxEntries);
    }
  }

  recordError(operation: string, error: string, tags?: Record<string, string>) {
    this.metrics.push({
      name: `operation.errors`,
      value: 1,
      timestamp: Date.now(),
      tags: { operation, error, ...tags },
      type: 'counter'
    });
  }

  recordGauge(name: string, value: number, tags?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'gauge'
    });
  }

  // Calculate percentiles
  calculatePercentiles(operation: string, timeWindow: number = 300000): {
    p50: number;
    p95: number;
    p99: number;
    count: number;
  } {
    const cutoff = Date.now() - timeWindow;
    const operationMetrics = this.metrics
      .filter(m => 
        m.name === 'operation.duration' && 
        m.tags?.operation === operation &&
        m.timestamp > cutoff
      )
      .map(m => m.value)
      .sort((a, b) => a - b);

    if (operationMetrics.length === 0) {
      return { p50: 0, p95: 0, p99: 0, count: 0 };
    }

    const getPercentile = (arr: number[], percentile: number) => {
      const index = Math.ceil((percentile / 100) * arr.length) - 1;
      return arr[Math.max(0, index)];
    };

    return {
      p50: getPercentile(operationMetrics, 50),
      p95: getPercentile(operationMetrics, 95),
      p99: getPercentile(operationMetrics, 99),
      count: operationMetrics.length
    };
  }

  // Calculate error rate
  calculateErrorRate(operation: string, timeWindow: number = 300000): number {
    const cutoff = Date.now() - timeWindow;
    
    const totalRequests = this.metrics.filter(m => 
      m.name === 'operation.duration' && 
      m.tags?.operation === operation &&
      m.timestamp > cutoff
    ).length;

    const errorRequests = this.metrics.filter(m => 
      m.name === 'operation.errors' && 
      m.tags?.operation === operation &&
      m.timestamp > cutoff
    ).length;

    return totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
  }

  // Get current metrics snapshot
  getMetricsSnapshot(): {
    operations: Record<string, { p50: number; p95: number; p99: number; errorRate: number; count: number }>;
    dbPool: { usage: number; connections: number };
    cacheHitRate: number;
    breakerStates: Record<string, string>;
  } {
    const operations: Record<string, any> = {};
    
    // Get unique operations
    const uniqueOps = [...new Set(
      this.metrics
        .filter(m => m.name === 'operation.duration')
        .map(m => m.tags?.operation)
        .filter(Boolean)
    )];

    uniqueOps.forEach(op => {
      operations[op!] = {
        ...this.calculatePercentiles(op!),
        errorRate: this.calculateErrorRate(op!)
      };
    });

    // Get latest gauge metrics
    const getLatestGauge = (name: string) => {
      const latest = this.metrics
        .filter(m => m.name === name && m.type === 'gauge')
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      return latest?.value || 0;
    };

    return {
      operations,
      dbPool: {
        usage: getLatestGauge('db.pool.usage_percent'),
        connections: getLatestGauge('db.pool.active_connections')
      },
      cacheHitRate: getLatestGauge('cache.hit_rate_percent'),
      breakerStates: {
        auth: this.getLatestBreakerState('auth'),
        availability: this.getLatestBreakerState('availability'),
        booking: this.getLatestBreakerState('booking')
      }
    };
  }

  private getLatestBreakerState(breaker: string): string {
    const latest = this.metrics
      .filter(m => m.name === 'circuit_breaker.state' && m.tags?.breaker === breaker)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    return latest?.tags?.state || 'unknown';
  }

  // Export metrics for external systems (Grafana, etc.)
  exportMetrics(): {
    timestamp: number;
    metrics: MetricEntry[];
    summary: ReturnType<typeof this.getMetricsSnapshot>;
  } {
    return {
      timestamp: Date.now(),
      metrics: [...this.metrics],
      summary: this.getMetricsSnapshot()
    };
  }

  // Clear old metrics
  cleanup(olderThan: number = 3600000) { // 1 hour
    const cutoff = Date.now() - olderThan;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    this.traces = this.traces.filter(t => t.timestamp > cutoff);
  }
}

// Global telemetry instance
export const telemetry = new TelemetryCollector();

// Helper functions for common operations
export const recordApiCall = async <T>(
  operation: string,
  fn: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> => {
  const start = performance.now();
  const traceId = crypto.randomUUID();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    telemetry.recordLatency(operation, duration, tags);
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    telemetry.recordLatency(operation, duration, { ...tags, status: 'error' });
    telemetry.recordError(operation, error instanceof Error ? error.message : 'unknown', tags);
    throw error;
  }
};

// Specific monitoring functions
export const monitorDBOperation = <T>(operation: string, fn: () => Promise<T>) => {
  return recordApiCall(`db.${operation}`, fn, { type: 'database' });
};

export const monitorSupabaseCall = <T>(operation: string, fn: () => Promise<T>) => {
  return recordApiCall(`supabase.${operation}`, fn, { type: 'supabase' });
};

export const updateCircuitBreakerState = (breaker: string, state: string) => {
  telemetry.recordGauge('circuit_breaker.state', 1, { breaker, state });
};

export const updateDBPoolMetrics = (usage: number, connections: number) => {
  telemetry.recordGauge('db.pool.usage_percent', usage);
  telemetry.recordGauge('db.pool.active_connections', connections);
};

export const updateCacheMetrics = (hitRate: number) => {
  telemetry.recordGauge('cache.hit_rate_percent', hitRate);
};

// Alert thresholds
export const ALERT_THRESHOLDS = {
  P95_LATENCY_MS: 700,
  ERROR_RATE_PERCENT: 1,
  DB_POOL_USAGE_PERCENT: 80,
  CACHE_HIT_RATE_PERCENT: 50
} as const;

// Check if alerts should be triggered
export const checkAlerts = () => {
  const snapshot = telemetry.getMetricsSnapshot();
  const alerts: string[] = [];

  Object.entries(snapshot.operations).forEach(([op, metrics]) => {
    if (metrics.p95 > ALERT_THRESHOLDS.P95_LATENCY_MS) {
      alerts.push(`P95 latency for ${op} is ${metrics.p95}ms (threshold: ${ALERT_THRESHOLDS.P95_LATENCY_MS}ms)`);
    }
    if (metrics.errorRate > ALERT_THRESHOLDS.ERROR_RATE_PERCENT) {
      alerts.push(`Error rate for ${op} is ${metrics.errorRate}% (threshold: ${ALERT_THRESHOLDS.ERROR_RATE_PERCENT}%)`);
    }
  });

  if (snapshot.dbPool.usage > ALERT_THRESHOLDS.DB_POOL_USAGE_PERCENT) {
    alerts.push(`DB pool usage is ${snapshot.dbPool.usage}% (threshold: ${ALERT_THRESHOLDS.DB_POOL_USAGE_PERCENT}%)`);
  }

  return alerts;
};