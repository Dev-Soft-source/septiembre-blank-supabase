/**
 * Express Middleware for Production Tracing
 */
import { ProductionTracing } from './productionTracing';
import { TracingUtils } from './tracing';

export const tracingMiddleware = (req: any, res: any, next: any) => {
  const spanId = ProductionTracing.startSpan(`${req.method} ${req.path}`, {
    'http.method': req.method,
    'http.url': req.url,
    'http.path': req.path,
    'http.user_agent': req.get('user-agent'),
    'http.remote_addr': req.ip,
    'user.id': req.user?.id || 'anonymous'
  });

  // Add span ID to request context for manual instrumentation
  req.spanId = spanId;

  // Track request size
  if (req.get('content-length')) {
    ProductionTracing.addSpanAttribute(spanId, 'http.request.size', parseInt(req.get('content-length')));
  }

  // End span when response finishes
  res.on('finish', () => {
    ProductionTracing.addSpanAttribute(spanId, 'http.status_code', res.statusCode);
    ProductionTracing.addSpanAttribute(spanId, 'http.response.size', res.get('content-length') || 0);
    
    // Set span status based on HTTP status
    const status = res.statusCode >= 400 ? 'error' : 'ok';
    ProductionTracing.endSpan(spanId, status);
  });

  // Handle errors
  res.on('error', (error: Error) => {
    ProductionTracing.recordException(spanId, error);
    ProductionTracing.endSpan(spanId, 'error', error);
  });

  next();
};

// Business operation tracing decorator
export function traced(operationName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return TracingUtils.withSpan(
        `${target.constructor.name}.${operationName}`,
        async (span) => {
          // Add context attributes
          span.setAttribute('operation.name', operationName);
          span.setAttribute('class.name', target.constructor.name);
          
          return method.apply(this, args);
        }
      );
    };

    return descriptor;
  };
}

// Database operation tracing
export async function traceDbOperation<T>(
  operation: string,
  query: string,
  params: any[],
  executor: () => Promise<T>
): Promise<T> {
  return TracingUtils.withSpan(
    `db.${operation}`,
    async (span) => {
      span.setAttribute('db.operation', operation);
      span.setAttribute('db.statement', query);
      span.setAttribute('db.params.count', params.length);
      
      const start = Date.now();
      const result = await executor();
      const duration = Date.now() - start;
      
      span.setAttribute('db.duration_ms', duration);
      
      return result;
    },
    {
      'db.system': 'postgresql',
      'db.name': process.env.DB_NAME || 'hotel_living'
    }
  );
}

// Cache operation tracing
export async function traceCacheOperation<T>(
  operation: 'get' | 'set' | 'delete' | 'invalidate',
  key: string,
  executor: () => Promise<T>
): Promise<T> {
  return TracingUtils.withSpan(
    `cache.${operation}`,
    async (span) => {
      span.setAttribute('cache.operation', operation);
      span.setAttribute('cache.key', key);
      
      return executor();
    },
    {
      'cache.system': 'redis'
    }
  );
}