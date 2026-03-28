/**
 * Security Event Monitoring System
 * Logs and tracks all security events with severity levels
 */
import { logger } from '../logging/logger';

export type SecurityEventType = 
  | 'invalid_api_key' 
  | 'invalid_signature' 
  | 'replay_attack'
  | 'csp_violation'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'authentication_failure'
  | 'authorization_failure'
  | 'sql_injection_attempt'
  | 'xss_attempt'
  | 'system_start';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  ip: string;
  userAgent?: string;
  userId?: string;
  details: Record<string, any>;
}

export class SecurityMonitor {
  private static events: SecurityEvent[] = [];
  private static readonly MAX_EVENTS = 10000;
  private static readonly ALERT_THRESHOLDS = {
    critical: 1,
    high: 5,
    medium: 20,
    low: 100
  };
  
  /**
   * Log a security event
   */
  static logSecurityEvent(
    type: SecurityEventType,
    severity: SecuritySeverity,
    details: {
      ip: string;
      userAgent?: string;
      userId?: string;
      [key: string]: any;
    }
  ): void {
    const event: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      severity,
      ip: details.ip,
      userAgent: details.userAgent,
      userId: details.userId,
      details
    };
    
    // Add to in-memory store
    SecurityMonitor.events.push(event);
    
    // Maintain size limit
    if (SecurityMonitor.events.length > SecurityMonitor.MAX_EVENTS) {
      SecurityMonitor.events = SecurityMonitor.events.slice(-SecurityMonitor.MAX_EVENTS);
    }
    
    // Log to winston
    const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    logger[logLevel](`Security event: ${type}`, undefined, {
      eventId: event.id,
      eventType: event.type,
      severity: event.severity,
      ip: event.ip,
      timestamp: event.timestamp
    });
    
    // Check for immediate alerts
    SecurityMonitor.checkAlertThresholds(type, severity);
  }
  
  /**
   * Check if alert thresholds are exceeded
   */
  private static checkAlertThresholds(type: SecurityEventType, severity: SecuritySeverity): void {
    const recentEvents = SecurityMonitor.getRecentEvents(15 * 60 * 1000); // 15 minutes
    const sameSeverityCount = recentEvents.filter(e => e.severity === severity).length;
    const sameTypeCount = recentEvents.filter(e => e.type === type).length;
    
    const threshold = SecurityMonitor.ALERT_THRESHOLDS[severity];
    
    if (sameSeverityCount >= threshold || sameTypeCount >= threshold) {
      logger.error('Security alert threshold exceeded', undefined, {
        eventType: type,
        severity,
        count: Math.max(sameSeverityCount, sameTypeCount),
        threshold,
        timeWindow: '15 minutes'
      });
    }
  }
  
  /**
   * Get events within a time window
   */
  static getRecentEvents(timeWindowMs: number): SecurityEvent[] {
    const cutoff = new Date(Date.now() - timeWindowMs);
    return SecurityMonitor.events.filter(event => 
      new Date(event.timestamp) >= cutoff
    );
  }
  
  /**
   * Get security report summary
   */
  static getSecurityReport(): {
    summary: Record<SecuritySeverity, number>;
    recentEvents: SecurityEvent[];
    topIPs: Array<{ ip: string; count: number }>;
    topTypes: Array<{ type: SecurityEventType; count: number }>;
    alertStatus: string;
  } {
    const last24Hours = SecurityMonitor.getRecentEvents(24 * 60 * 60 * 1000);
    const last1Hour = SecurityMonitor.getRecentEvents(60 * 60 * 1000);
    
    // Summary by severity
    const summary: Record<SecuritySeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    last24Hours.forEach(event => {
      summary[event.severity]++;
    });
    
    // Top IPs
    const ipCounts = new Map<string, number>();
    last24Hours.forEach(event => {
      ipCounts.set(event.ip, (ipCounts.get(event.ip) || 0) + 1);
    });
    const topIPs = Array.from(ipCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));
    
    // Top event types
    const typeCounts = new Map<SecurityEventType, number>();
    last24Hours.forEach(event => {
      typeCounts.set(event.type, (typeCounts.get(event.type) || 0) + 1);
    });
    const topTypes = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));
    
    // Alert status
    const criticalCount = last1Hour.filter(e => e.severity === 'critical').length;
    const highCount = last1Hour.filter(e => e.severity === 'high').length;
    
    let alertStatus = 'normal';
    if (criticalCount > 0) alertStatus = 'critical';
    else if (highCount >= 3) alertStatus = 'high';
    else if (last1Hour.length >= 10) alertStatus = 'elevated';
    
    return {
      summary,
      recentEvents: last1Hour.slice(-20), // Last 20 events
      topIPs,
      topTypes,
      alertStatus
    };
  }
  
  /**
   * Clear old events
   */
  static clearOldEvents(olderThanMs: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - olderThanMs);
    SecurityMonitor.events = SecurityMonitor.events.filter(event => 
      new Date(event.timestamp) >= cutoff
    );
  }
}