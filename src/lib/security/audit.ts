/**
 * Security Audit & Logging System
 * Structured logging with PII redaction and security event tracking
 */

import { logEvt, redactSensitive } from '@/lib/logger';

export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'validation_failure' | 'rate_limit' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  details: Record<string, unknown>;
  timestamp: string;
  request_id?: string;
}

export interface ValidationFailure {
  endpoint: string;
  field: string;
  value: unknown;
  rule: string;
  user_id?: string;
  ip_address?: string;
}

class SecurityAuditor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 5000;

  // Log security events with structured format
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      details: redactSensitive(event.details)
    };

    this.events.push(securityEvent);

    // Trim old events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to structured logger
    logEvt(
      `security.${event.type}`,
      {
        severity: event.severity,
        user_id: event.user_id,
        ip_address: event.ip_address,
        endpoint: event.endpoint,
        ...redactSensitive(event.details)
      },
      event.severity === 'critical' ? 'error' : event.severity === 'high' ? 'warn' : 'info'
    );

    // Immediate alert for critical events
    if (event.severity === 'critical') {
      this.triggerAlert(securityEvent);
    }
  }

  // Log validation failures
  logValidationFailure(failure: ValidationFailure) {
    this.logSecurityEvent({
      type: 'validation_failure',
      severity: 'medium',
      user_id: failure.user_id,
      ip_address: failure.ip_address,
      endpoint: failure.endpoint,
      details: {
        field: failure.field,
        rule: failure.rule,
        value_type: typeof failure.value,
        value_length: typeof failure.value === 'string' ? failure.value.length : undefined
      }
    });
  }

  // Log authentication events
  logAuthEvent(type: 'login_success' | 'login_failure' | 'logout' | 'token_refresh', details: Record<string, unknown>) {
    this.logSecurityEvent({
      type: 'authentication',
      severity: type === 'login_failure' ? 'medium' : 'low',
      details
    });
  }

  // Log authorization failures
  logAuthZFailure(user_id: string, resource: string, action: string, reason: string) {
    this.logSecurityEvent({
      type: 'authorization',
      severity: 'high',
      user_id,
      details: {
        resource,
        action,
        reason
      }
    });
  }

  // Log data access
  logDataAccess(user_id: string, table: string, operation: string, record_count: number) {
    this.logSecurityEvent({
      type: 'data_access',
      severity: 'low',
      user_id,
      details: {
        table,
        operation,
        record_count
      }
    });
  }

  // Log rate limiting
  logRateLimit(ip_address: string, endpoint: string, limit: number, current: number) {
    this.logSecurityEvent({
      type: 'rate_limit',
      severity: 'medium',
      ip_address,
      endpoint,
      details: {
        limit,
        current,
        exceeded_by: current - limit
      }
    });
  }

  // Log suspicious activity
  logSuspiciousActivity(type: string, details: Record<string, unknown>) {
    this.logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'high',
      details: {
        activity_type: type,
        ...details
      }
    });
  }

  // Get security events for analysis
  getSecurityEvents(filters?: {
    type?: SecurityEvent['type'];
    severity?: SecurityEvent['severity'];
    user_id?: string;
    since?: Date;
  }): SecurityEvent[] {
    let filtered = [...this.events];

    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(e => e.type === filters.type);
      }
      if (filters.severity) {
        filtered = filtered.filter(e => e.severity === filters.severity);
      }
      if (filters.user_id) {
        filtered = filtered.filter(e => e.user_id === filters.user_id);
      }
      if (filters.since) {
        filtered = filtered.filter(e => new Date(e.timestamp) > filters.since!);
      }
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Generate security summary
  getSecuritySummary(timeWindow: number = 3600000): {
    total_events: number;
    by_severity: Record<string, number>;
    by_type: Record<string, number>;
    top_ips: Array<{ ip: string; count: number }>;
    recent_critical: SecurityEvent[];
  } {
    const cutoff = new Date(Date.now() - timeWindow);
    const recentEvents = this.events.filter(e => new Date(e.timestamp) > cutoff);

    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};

    recentEvents.forEach(event => {
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1;
      byType[event.type] = (byType[event.type] || 0) + 1;
      
      if (event.ip_address) {
        ipCounts[event.ip_address] = (ipCounts[event.ip_address] || 0) + 1;
      }
    });

    const topIps = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentCritical = recentEvents
      .filter(e => e.severity === 'critical')
      .slice(0, 10);

    return {
      total_events: recentEvents.length,
      by_severity: bySeverity,
      by_type: byType,
      top_ips: topIps,
      recent_critical: recentCritical
    };
  }

  // Trigger alerts for critical events
  private triggerAlert(event: SecurityEvent) {
    // In production, this would send to external alerting system
    console.error('[SECURITY ALERT]', {
      type: event.type,
      severity: event.severity,
      timestamp: event.timestamp,
      details: event.details
    });

    // Add to alert queue for dashboard
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('security-alert', {
        detail: event
      }));
    }
  }

  // Export events for external analysis
  exportEvents(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.events, null, 2);
    }
    
    // CSV format
    const headers = ['timestamp', 'type', 'severity', 'user_id', 'ip_address', 'endpoint', 'details'];
    const rows = this.events.map(event => [
      event.timestamp,
      event.type,
      event.severity,
      event.user_id || '',
      event.ip_address || '',
      event.endpoint || '',
      JSON.stringify(event.details)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Global security auditor instance
export const securityAuditor = new SecurityAuditor();

// Helper functions for common security events
export const auditApiRequest = (endpoint: string, user_id?: string, ip_address?: string) => {
  securityAuditor.logDataAccess(user_id || 'anonymous', endpoint, 'request', 1);
};

export const auditValidationFailure = (failure: ValidationFailure) => {
  securityAuditor.logValidationFailure(failure);
};

export const auditAuthFailure = (reason: string, details: Record<string, unknown> = {}) => {
  securityAuditor.logAuthEvent('login_failure', { reason, ...details });
};

export const auditSuspiciousActivity = (type: string, details: Record<string, unknown>) => {
  securityAuditor.logSuspiciousActivity(type, details);
};

// Security middleware for API calls
export const withSecurityAudit = <T extends (...args: any[]) => any>(
  fn: T,
  operation: string,
  options?: { requireAuth?: boolean }
): T => {
  return ((...args: any[]) => {
    const start = performance.now();
    
    try {
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.then(
          (data) => {
            const duration = performance.now() - start;
            securityAuditor.logSecurityEvent({
              type: 'data_access',
              severity: 'low',
              details: { operation, duration, status: 'success' }
            });
            return data;
          },
          (error) => {
            const duration = performance.now() - start;
            securityAuditor.logSecurityEvent({
              type: 'data_access',
              severity: 'medium',
              details: { operation, duration, status: 'error', error: error.message }
            });
            throw error;
          }
        );
      }
      
      const duration = performance.now() - start;
      securityAuditor.logSecurityEvent({
        type: 'data_access',
        severity: 'low',
        details: { operation, duration, status: 'success' }
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      securityAuditor.logSecurityEvent({
        type: 'data_access',
        severity: 'medium',
        details: { operation, duration, status: 'error', error: error instanceof Error ? error.message : 'unknown' }
      });
      throw error;
    }
  }) as T;
};