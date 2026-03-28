/**
 * Production Metrics Collection
 */

export interface MetricThreshold {
  threshold: number;
  unit: string;
  description?: string;
}

export const CRITICAL_METRICS: Record<string, MetricThreshold> = {
  // Database Metrics
  'database_connections_active': { 
    threshold: 80, 
    unit: '%', 
    description: 'Active database connections percentage' 
  },
  'database_connections_idle': { 
    threshold: 20, 
    unit: '%', 
    description: 'Idle database connections percentage' 
  },
  'database_query_time_avg': { 
    threshold: 100, 
    unit: 'ms', 
    description: 'Average database query response time' 
  },
  'database_slow_queries': { 
    threshold: 5, 
    unit: 'count/min', 
    description: 'Slow queries per minute' 
  },
  
  // Redis Metrics
  'redis_memory_usage': { 
    threshold: 80, 
    unit: '%', 
    description: 'Redis memory utilization' 
  },
  'redis_connected_clients': { 
    threshold: 1000, 
    unit: 'count', 
    description: 'Number of connected Redis clients' 
  },
  'redis_keyspace_hits': { 
    threshold: 90, 
    unit: '%', 
    description: 'Redis cache hit ratio' 
  },
  
  // Application Metrics
  'app_response_time_p95': { 
    threshold: 500, 
    unit: 'ms', 
    description: '95th percentile response time' 
  },
  'app_error_rate': { 
    threshold: 1, 
    unit: '%', 
    description: 'Application error rate' 
  },
  'app_active_connections': { 
    threshold: 1000, 
    unit: 'count', 
    description: 'Active HTTP connections' 
  },
  'app_memory_usage': { 
    threshold: 80, 
    unit: '%', 
    description: 'Application memory usage' 
  },
  'app_cpu_usage': { 
    threshold: 70, 
    unit: '%', 
    description: 'Application CPU usage' 
  },
  
  // Business Metrics
  'booking_success_rate': { 
    threshold: 95, 
    unit: '%', 
    description: 'Booking operation success rate' 
  },
  'availability_check_time': { 
    threshold: 200, 
    unit: 'ms', 
    description: 'Hotel availability check response time' 
  },
  'authentication_success_rate': { 
    threshold: 99, 
    unit: '%', 
    description: 'User authentication success rate' 
  }
};

export class MetricsCollector {
  private static metrics = new Map<string, number>();
  private static lastCollection = 0;

  static recordMetric(name: string, value: number, timestamp?: number): void {
    const key = `${name}:${timestamp || Date.now()}`;
    this.metrics.set(key, value);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.size > 1000) {
      const oldestKey = this.metrics.keys().next().value;
      this.metrics.delete(oldestKey);
    }
  }

  static getMetric(name: string): number | undefined {
    const latestEntry = Array.from(this.metrics.entries())
      .filter(([key]) => key.startsWith(name))
      .sort(([a], [b]) => b.localeCompare(a))[0];
    
    return latestEntry ? latestEntry[1] : undefined;
  }

  static getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    
    for (const [key, value] of this.metrics) {
      const [metricName] = key.split(':');
      result[metricName] = value;
    }
    
    return result;
  }

  static checkThresholds(): Array<{ metric: string; value: number; threshold: number; status: 'ok' | 'warning' | 'critical' }> {
    const results = [];
    
    for (const [metricName, config] of Object.entries(CRITICAL_METRICS)) {
      const value = this.getMetric(metricName);
      if (value !== undefined) {
        const status = value > config.threshold ? 'critical' : 
                     value > config.threshold * 0.8 ? 'warning' : 'ok';
        
        results.push({
          metric: metricName,
          value,
          threshold: config.threshold,
          status
        });
      }
    }
    
    return results;
  }

  static getSystemMetrics(): Record<string, any> {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: Math.round(process.uptime()),
      timestamp: Date.now()
    };
  }

  static startCollection(intervalMs: number = 30000): void {
    setInterval(() => {
      const systemMetrics = this.getSystemMetrics();
      
      // Record system metrics
      this.recordMetric('app_memory_usage', (systemMetrics.memory.heapUsed / systemMetrics.memory.heapTotal) * 100);
      this.recordMetric('app_uptime', systemMetrics.uptime);
      
      this.lastCollection = Date.now();
    }, intervalMs);
    
    console.log(`Metrics collection started with ${intervalMs}ms interval`);
  }
}
