/**
 * Production-Ready Tracing Implementation
 */

export interface TraceSpan {
  id: string;
  name: string;
  startTime: number;
  attributes: Record<string, any>;
  status?: 'ok' | 'error';
  error?: Error;
}

export class ProductionTracing {
  private static spans = new Map<string, TraceSpan>();
  private static isEnabled = process.env.TRACING_ENABLED === 'true';

  static startSpan(name: string, attributes: Record<string, any> = {}): string {
    if (!this.isEnabled) return '';

    const spanId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.spans.set(spanId, {
      id: spanId,
      name,
      startTime: Date.now(),
      attributes: {
        ...attributes,
        'span.kind': 'internal',
        'service.name': 'hotel-living'
      }
    });

    return spanId;
  }

  static endSpan(spanId: string, status: 'ok' | 'error' = 'ok', error?: Error): void {
    if (!this.isEnabled || !spanId) return;

    const span = this.spans.get(spanId);
    if (span) {
      const duration = Date.now() - span.startTime;
      
      // Log trace information
      const logLevel = status === 'error' ? 'error' : 'info';
      console[logLevel](`[TRACE] ${span.name}`, {
        duration: `${duration}ms`,
        status,
        attributes: span.attributes,
        error: error?.message
      });

      this.spans.delete(spanId);
    }
  }

  static async withSpan<T>(
    name: string,
    operation: (spanId: string) => Promise<T>,
    attributes: Record<string, any> = {}
  ): Promise<T> {
    const spanId = this.startSpan(name, attributes);
    
    try {
      const result = await operation(spanId);
      this.endSpan(spanId, 'ok');
      return result;
    } catch (error) {
      this.endSpan(spanId, 'error', error as Error);
      throw error;
    }
  }

  static addSpanAttribute(spanId: string, key: string, value: any): void {
    if (!this.isEnabled || !spanId) return;

    const span = this.spans.get(spanId);
    if (span) {
      span.attributes[key] = value;
    }
  }

  static recordException(spanId: string, error: Error): void {
    if (!this.isEnabled || !spanId) return;

    const span = this.spans.get(spanId);
    if (span) {
      span.error = error;
      span.status = 'error';
    }
  }

  static getActiveSpans(): TraceSpan[] {
    return Array.from(this.spans.values());
  }

  static clearAll(): void {
    this.spans.clear();
  }
}

// Express middleware for request tracing
export const requestTracingMiddleware = (req: any, res: any, next: any) => {
  const spanId = ProductionTracing.startSpan(`${req.method} ${req.path}`, {
    'http.method': req.method,
    'http.url': req.url,
    'http.path': req.path,
    'http.user_agent': req.get('user-agent') || 'unknown',
    'http.remote_addr': req.ip || 'unknown',
    'user.id': req.user?.id || 'anonymous'
  });

  // Attach span ID to request for nested operations
  req.spanId = spanId;

  // Track request size
  const contentLength = req.get('content-length');
  if (contentLength) {
    ProductionTracing.addSpanAttribute(spanId, 'http.request.size', parseInt(contentLength));
  }

  // End span when response finishes
  res.on('finish', () => {
    ProductionTracing.addSpanAttribute(spanId, 'http.status_code', res.statusCode);
    
    const responseSize = res.get('content-length');
    if (responseSize) {
      ProductionTracing.addSpanAttribute(spanId, 'http.response.size', parseInt(responseSize));
    }

    const status = res.statusCode >= 400 ? 'error' : 'ok';
    ProductionTracing.endSpan(spanId, status);
  });

  // Handle request errors
  res.on('error', (error: Error) => {
    ProductionTracing.recordException(spanId, error);
    ProductionTracing.endSpan(spanId, 'error', error);
  });

  next();
};

// Database operation tracing
export async function traceDbOperation<T>(
  operation: string,
  query: string,
  params: any[],
  executor: () => Promise<T>
): Promise<T> {
  return ProductionTracing.withSpan(
    `db.${operation}`,
    async (spanId) => {
      ProductionTracing.addSpanAttribute(spanId, 'db.operation', operation);
      ProductionTracing.addSpanAttribute(spanId, 'db.statement', query);
      ProductionTracing.addSpanAttribute(spanId, 'db.params.count', params.length);
      ProductionTracing.addSpanAttribute(spanId, 'db.system', 'postgresql');
      
      return executor();
    }
  );
}

// Cache operation tracing
export async function traceCacheOperation<T>(
  operation: 'get' | 'set' | 'delete' | 'invalidate',
  key: string,
  executor: () => Promise<T>
): Promise<T> {
  return ProductionTracing.withSpan(
    `cache.${operation}`,
    async (spanId) => {
      ProductionTracing.addSpanAttribute(spanId, 'cache.operation', operation);
      ProductionTracing.addSpanAttribute(spanId, 'cache.key', key);
      ProductionTracing.addSpanAttribute(spanId, 'cache.system', 'redis');
      
      return executor();
    }
  );
}

// Method decorator for tracing class methods
export function traced(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const traceName = operationName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      return ProductionTracing.withSpan(
        traceName,
        async (spanId) => {
          ProductionTracing.addSpanAttribute(spanId, 'operation.name', traceName);
          ProductionTracing.addSpanAttribute(spanId, 'class.name', target.constructor.name);
          ProductionTracing.addSpanAttribute(spanId, 'method.name', propertyName);
          
          return method.apply(this, args);
        }
      );
    };

    return descriptor;
  };
}