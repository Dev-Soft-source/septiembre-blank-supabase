/**
 * Structured Logging with Winston
 * JSON formatted logs with PII redaction
 */

interface LogEntry {
  timestamp: string;
  service: string;
  level: string;
  message: string;
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;
  
  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private redactPII(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const redacted = { ...data };
    const piiFields = ['email', 'phone', 'address', 'password', 'token', 'ssn', 'credit_card'];
    
    Object.keys(redacted).forEach(key => {
      const lowerKey = key.toLowerCase();
      
      // Redact known PII fields
      if (piiFields.some(field => lowerKey.includes(field))) {
        if (typeof redacted[key] === 'string' && redacted[key].length > 0) {
          redacted[key] = `***${redacted[key].slice(-2)}`;
        } else {
          redacted[key] = '[REDACTED]';
        }
      }
      
      // Recursively redact nested objects
      if (typeof redacted[key] === 'object' && redacted[key] !== null) {
        redacted[key] = this.redactPII(redacted[key]);
      }
    });

    return redacted;
  }

  private formatLog(level: string, message: string, meta: any = {}): LogEntry {
    const redactedMeta = this.redactPII(meta);
    
    return {
      timestamp: new Date().toISOString(),
      service: 'hotel-living',
      level: level.toUpperCase(),
      message,
      ...redactedMeta
    };
  }

  private writeLog(entry: LogEntry): void {
    const logString = JSON.stringify(entry);
    
    if (this.isDevelopment) {
      // Console logging in development
      const method = entry.level === 'ERROR' ? 'error' : 
                   entry.level === 'WARN' ? 'warn' : 'log';
      console[method](logString);
    } else {
      // File logging in production (implement based on your deployment)
      // This would typically write to error.log and combined.log
      console.log(logString);
    }
  }

  public info(message: string, meta?: any): void {
    const entry = this.formatLog('info', message, meta);
    this.writeLog(entry);
  }

  public warn(message: string, meta?: any): void {
    const entry = this.formatLog('warn', message, meta);
    this.writeLog(entry);
  }

  public error(message: string, error?: Error, meta?: any): void {
    const errorMeta = {
      ...meta,
      stack: error?.stack,
      errorName: error?.name,
      errorMessage: error?.message
    };
    
    const entry = this.formatLog('error', message, errorMeta);
    this.writeLog(entry);
  }

  public debug(message: string, meta?: any): void {
    if (this.isDevelopment) {
      const entry = this.formatLog('debug', message, meta);
      this.writeLog(entry);
    }
  }

  // Request lifecycle logging
  public logRequest(req: any, res: any, responseTime?: number): void {
    const requestMeta = {
      requestId: req.id || req.headers['x-request-id'],
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      userId: req.user?.id,
      statusCode: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined
    };

    const level = res.statusCode >= 400 ? 'warn' : 'info';
    const message = `${req.method} ${req.url} - ${res.statusCode}`;
    
    if (level === 'warn') {
      this.warn(message, requestMeta);
    } else {
      this.info(message, requestMeta);
    }
  }
}

// Singleton instance
export const logger = new Logger();

// Request logging middleware
export function requestLoggingMiddleware(req: any, res: any, next: any): void {
  const startTime = Date.now();
  
  // Generate request ID if not present
  req.id = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk: any, encoding: any) {
    const responseTime = Date.now() - startTime;
    logger.logRequest(req, res, responseTime);
    originalEnd.call(res, chunk, encoding);
  };

  next();
}

// Error logging middleware
export function errorLoggingMiddleware(error: Error, req: any, res: any, next: any): void {
  logger.error('Unhandled request error', error, {
    requestId: req.id,
    method: req.method,
    url: req.url,
    userId: req.user?.id
  });
  
  next(error);
}