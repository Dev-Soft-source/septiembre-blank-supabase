/**
 * Performance Monitoring System
 * Tracks request times, error rates, threshold alerts, and trend analysis
 */
import { logger } from '../logging/logger';
import { Request, Response, NextFunction } from 'express';

interface PerformanceMetric {
  timestamp: number;
  path: string;
  method: string;
  duration: number;
  statusCode: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface PerformanceAlert {
  id: string;
  type: 'response_time' | 'error_rate' | 'memory_usage' | 'cpu_usage';
  severity: 'warning' | 'critical';
  threshold: number;
  actualValue: number;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

interface PerformanceReport {
  summary: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  trends: {
    responseTime: Array<{ timestamp: number; value: number }>;
    errorRate: Array<{ timestamp: number; value: number }>;
    throughput: Array<{ timestamp: number; value: number }>;
  };
  alerts: {
    active: PerformanceAlert[];
    resolved: PerformanceAlert[];
  };
  slowestEndpoints: Array<{
    path: string;
    method: string;
    avgDuration: number;
    requestCount: number;
  }>;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];
  private static alerts: PerformanceAlert[] = [];
  private static readonly MAX_METRICS = 50000;
  private static readonly THRESHOLDS = {
    responseTime: {
      warning: 500,   // 500ms
      critical: 2000  // 2 seconds
    },
    errorRate: {
      warning: 0.05,  // 5%
      critical: 0.15  // 15%
    },
    memoryUsage: {
      warning: 0.8,   // 80%
      critical: 0.9   // 90%
    },
    cpuUsage: {
      warning: 0.7,   // 70%
      critical: 0.9   // 90%
    }
  };
  
  /**
   * Express middleware for performance monitoring
   */
  static middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const startCpu = process.cpuUsage();
      const startMemory = process.memoryUsage();
      
      // Override res.end to capture response metrics
      const originalEnd = res.end.bind(res);
      res.end = function(chunk?: any, encoding?: any): any {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const endCpu = process.cpuUsage(startCpu);
        const endMemory = process.memoryUsage();
        
        // Calculate CPU usage percentage (approximation)
        const cpuUsage = (endCpu.user + endCpu.system) / (duration * 1000); // Convert to percentage
        const memoryUsage = endMemory.heapUsed / endMemory.heapTotal;
        
        // Record metric
        const metric: PerformanceMetric = {
          timestamp: startTime,
          path: req.path,
          method: req.method,
          duration,
          statusCode: res.statusCode,
          memoryUsage,
          cpuUsage
        };
        
        PerformanceMonitor.recordMetric(metric);
        
        // Check for alerts
        PerformanceMonitor.checkThresholds(metric);
        
        // Call original end
        return originalEnd(chunk, encoding);
      };
      
      next();
    };
  }
  
  /**
   * Record a performance metric
   */
  private static recordMetric(metric: PerformanceMetric): void {
    PerformanceMonitor.metrics.push(metric);
    
    // Maintain size limit
    if (PerformanceMonitor.metrics.length > PerformanceMonitor.MAX_METRICS) {
      PerformanceMonitor.metrics = PerformanceMonitor.metrics.slice(-PerformanceMonitor.MAX_METRICS);
    }
    
    // Log slow requests
    if (metric.duration > PerformanceMonitor.THRESHOLDS.responseTime.warning) {
      logger.warn('Slow request detected', {
        path: metric.path,
        method: metric.method,
        duration: metric.duration,
        statusCode: metric.statusCode
      });
    }
  }
  
  /**
   * Check performance thresholds and create alerts
   */
  private static checkThresholds(metric: PerformanceMetric): void {
    const now = new Date().toISOString();
    
    // Response time alerts
    if (metric.duration > PerformanceMonitor.THRESHOLDS.responseTime.critical) {
      PerformanceMonitor.createAlert('response_time', 'critical', 
        PerformanceMonitor.THRESHOLDS.responseTime.critical, metric.duration, now);
    } else if (metric.duration > PerformanceMonitor.THRESHOLDS.responseTime.warning) {
      PerformanceMonitor.createAlert('response_time', 'warning',
        PerformanceMonitor.THRESHOLDS.responseTime.warning, metric.duration, now);
    }
    
    // Memory usage alerts
    if (metric.memoryUsage > PerformanceMonitor.THRESHOLDS.memoryUsage.critical) {
      PerformanceMonitor.createAlert('memory_usage', 'critical',
        PerformanceMonitor.THRESHOLDS.memoryUsage.critical, metric.memoryUsage, now);
    } else if (metric.memoryUsage > PerformanceMonitor.THRESHOLDS.memoryUsage.warning) {
      PerformanceMonitor.createAlert('memory_usage', 'warning',
        PerformanceMonitor.THRESHOLDS.memoryUsage.warning, metric.memoryUsage, now);
    }
    
    // CPU usage alerts
    if (metric.cpuUsage > PerformanceMonitor.THRESHOLDS.cpuUsage.critical) {
      PerformanceMonitor.createAlert('cpu_usage', 'critical',
        PerformanceMonitor.THRESHOLDS.cpuUsage.critical, metric.cpuUsage, now);
    } else if (metric.cpuUsage > PerformanceMonitor.THRESHOLDS.cpuUsage.warning) {
      PerformanceMonitor.createAlert('cpu_usage', 'warning',
        PerformanceMonitor.THRESHOLDS.cpuUsage.warning, metric.cpuUsage, now);
    }
    
    // Error rate alerts (calculated from recent metrics)
    const recentMetrics = PerformanceMonitor.getMetricsInWindow(5 * 60 * 1000); // 5 minutes
    if (recentMetrics.length >= 10) { // Only check if we have enough data
      const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
      const errorRate = errorCount / recentMetrics.length;
      
      if (errorRate > PerformanceMonitor.THRESHOLDS.errorRate.critical) {
        PerformanceMonitor.createAlert('error_rate', 'critical',
          PerformanceMonitor.THRESHOLDS.errorRate.critical, errorRate, now);
      } else if (errorRate > PerformanceMonitor.THRESHOLDS.errorRate.warning) {
        PerformanceMonitor.createAlert('error_rate', 'warning',
          PerformanceMonitor.THRESHOLDS.errorRate.warning, errorRate, now);
      }
    }
  }
  
  /**
   * Create a performance alert
   */
  private static createAlert(
    type: PerformanceAlert['type'],
    severity: PerformanceAlert['severity'],
    threshold: number,
    actualValue: number,
    timestamp: string
  ): void {
    // Check if we already have an active alert of this type
    const existingAlert = PerformanceMonitor.alerts.find(
      alert => alert.type === type && alert.severity === severity && !alert.resolved
    );
    
    if (existingAlert) {
      // Update existing alert with latest value
      existingAlert.actualValue = actualValue;
      existingAlert.timestamp = timestamp;
      return;
    }
    
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      threshold,
      actualValue,
      timestamp,
      resolved: false
    };
    
    PerformanceMonitor.alerts.push(alert);
    
    // Log alert
    logger.error(`Performance alert: ${alert.type} ${alert.severity}`, undefined, {
      alertId: alert.id,
      alertType: alert.type,
      severity: alert.severity,
      threshold: alert.threshold,
      actualValue: alert.actualValue
    });
  }
  
  /**
   * Resolve alerts that are no longer triggered
   */
  private static resolveAlerts(): void {
    const now = new Date().toISOString();
    const recentMetrics = PerformanceMonitor.getMetricsInWindow(5 * 60 * 1000);
    
    PerformanceMonitor.alerts.forEach(alert => {
      if (alert.resolved) return;
      
      let shouldResolve = false;
      
      switch (alert.type) {
        case 'response_time':
          const recentAvgResponseTime = PerformanceMonitor.calculateAverageResponseTime(recentMetrics);
          shouldResolve = recentAvgResponseTime < alert.threshold;
          break;
          
        case 'error_rate':
          const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
          const currentErrorRate = recentMetrics.length > 0 ? errorCount / recentMetrics.length : 0;
          shouldResolve = currentErrorRate < alert.threshold;
          break;
          
        case 'memory_usage':
          const currentMemory = process.memoryUsage();
          const currentMemoryUsage = currentMemory.heapUsed / currentMemory.heapTotal;
          shouldResolve = currentMemoryUsage < alert.threshold;
          break;
          
        case 'cpu_usage':
          // CPU usage is harder to measure instantly, resolve after some time
          const alertAge = Date.now() - new Date(alert.timestamp).getTime();
          shouldResolve = alertAge > 5 * 60 * 1000; // 5 minutes
          break;
      }
      
      if (shouldResolve) {
        alert.resolved = true;
        alert.resolvedAt = now;
        
        logger.info('Performance alert resolved', {
          alertId: alert.id,
          type: alert.type,
          severity: alert.severity,
          resolvedAt: now
        });
      }
    });
  }
  
  /**
   * Get metrics within a time window
   */
  private static getMetricsInWindow(windowMs: number): PerformanceMetric[] {
    const cutoff = Date.now() - windowMs;
    return PerformanceMonitor.metrics.filter(metric => metric.timestamp >= cutoff);
  }
  
  /**
   * Calculate average response time
   */
  private static calculateAverageResponseTime(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / metrics.length;
  }
  
  /**
   * Get performance report
   */
  static getPerformanceReport(): PerformanceReport {
    PerformanceMonitor.resolveAlerts(); // Resolve any outdated alerts
    
    const recentMetrics = PerformanceMonitor.getMetricsInWindow(24 * 60 * 60 * 1000); // 24 hours
    const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
    
    // Calculate trends (hourly data points for last 24 hours)
    const trends = PerformanceMonitor.calculateTrends(recentMetrics);
    
    // Find slowest endpoints
    const slowestEndpoints = PerformanceMonitor.calculateSlowestEndpoints(recentMetrics);
    
    // Separate active and resolved alerts
    const activeAlerts = PerformanceMonitor.alerts.filter(alert => !alert.resolved);
    const resolvedAlerts = PerformanceMonitor.alerts.filter(alert => alert.resolved).slice(-20); // Last 20
    
    return {
      summary: {
        totalRequests: recentMetrics.length,
        avgResponseTime: PerformanceMonitor.calculateAverageResponseTime(recentMetrics),
        errorRate: recentMetrics.length > 0 ? errorCount / recentMetrics.length : 0,
        throughput: recentMetrics.length / 24 // requests per hour
      },
      trends,
      alerts: {
        active: activeAlerts,
        resolved: resolvedAlerts
      },
      slowestEndpoints
    };
  }
  
  /**
   * Calculate performance trends
   */
  private static calculateTrends(metrics: PerformanceMetric[]): PerformanceReport['trends'] {
    const hourlyData = new Map<number, PerformanceMetric[]>();
    
    // Group metrics by hour
    metrics.forEach(metric => {
      const hour = Math.floor(metric.timestamp / (60 * 60 * 1000));
      if (!hourlyData.has(hour)) {
        hourlyData.set(hour, []);
      }
      hourlyData.get(hour)!.push(metric);
    });
    
    const responseTime: Array<{ timestamp: number; value: number }> = [];
    const errorRate: Array<{ timestamp: number; value: number }> = [];
    const throughput: Array<{ timestamp: number; value: number }> = [];
    
    hourlyData.forEach((hourMetrics, hour) => {
      const timestamp = hour * 60 * 60 * 1000;
      
      // Response time trend
      const avgResponseTime = PerformanceMonitor.calculateAverageResponseTime(hourMetrics);
      responseTime.push({ timestamp, value: avgResponseTime });
      
      // Error rate trend
      const hourErrorCount = hourMetrics.filter(m => m.statusCode >= 400).length;
      const hourErrorRate = hourMetrics.length > 0 ? hourErrorCount / hourMetrics.length : 0;
      errorRate.push({ timestamp, value: hourErrorRate });
      
      // Throughput trend
      throughput.push({ timestamp, value: hourMetrics.length });
    });
    
    return {
      responseTime: responseTime.sort((a, b) => a.timestamp - b.timestamp),
      errorRate: errorRate.sort((a, b) => a.timestamp - b.timestamp),
      throughput: throughput.sort((a, b) => a.timestamp - b.timestamp)
    };
  }
  
  /**
   * Calculate slowest endpoints
   */
  private static calculateSlowestEndpoints(metrics: PerformanceMetric[]): PerformanceReport['slowestEndpoints'] {
    const endpointStats = new Map<string, { durations: number[]; count: number }>();
    
    metrics.forEach(metric => {
      const key = `${metric.method} ${metric.path}`;
      if (!endpointStats.has(key)) {
        endpointStats.set(key, { durations: [], count: 0 });
      }
      const stats = endpointStats.get(key)!;
      stats.durations.push(metric.duration);
      stats.count++;
    });
    
    const slowestEndpoints: PerformanceReport['slowestEndpoints'] = [];
    
    endpointStats.forEach((stats, key) => {
      const [method, path] = key.split(' ', 2);
      const avgDuration = stats.durations.reduce((sum, d) => sum + d, 0) / stats.durations.length;
      
      slowestEndpoints.push({
        method,
        path,
        avgDuration,
        requestCount: stats.count
      });
    });
    
    return slowestEndpoints
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 10);
  }
  
  /**
   * Clear old metrics and alerts
   */
  static cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    
    // Clean old metrics
    PerformanceMonitor.metrics = PerformanceMonitor.metrics.filter(
      metric => metric.timestamp >= cutoff
    );
    
    // Clean old resolved alerts
    PerformanceMonitor.alerts = PerformanceMonitor.alerts.filter(
      alert => !alert.resolved || new Date(alert.timestamp).getTime() >= cutoff
    );
  }
}

// Schedule periodic cleanup
setInterval(() => {
  PerformanceMonitor.cleanup();
}, 60 * 60 * 1000); // Every hour