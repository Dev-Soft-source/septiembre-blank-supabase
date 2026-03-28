/**
 * Simplified Tracing Implementation for Production
 */
import { ProductionTracing, requestTracingMiddleware, traceDbOperation, traceCacheOperation, traced } from './productionTracing';

// Re-export the production tracing utilities
export { 
  requestTracingMiddleware as tracingMiddleware,
  traceDbOperation,
  traceCacheOperation,
  traced
};

// Production tracing implementation
console.log('Production tracing system initialized');

// Main tracer export
export const tracer = ProductionTracing;

// Utility functions for compatibility
export class TracingUtils {
  static async withSpan<T>(
    name: string,
    operation: (span: any) => Promise<T>,
    attributes?: Record<string, any>
  ): Promise<T> {
    return ProductionTracing.withSpan(name, async (spanId) => {
      const mockSpan = {
        setAttribute: (key: string, value: any) => ProductionTracing.addSpanAttribute(spanId, key, value),
        recordException: (error: Error) => ProductionTracing.recordException(spanId, error),
        setStatus: () => {}, // No-op for compatibility
      };
      return operation(mockSpan);
    }, attributes);
  }

  static addSpanAttributes(attributes: Record<string, any>): void {
    // In production tracing, we handle this differently
    console.log('Span attributes:', attributes);
  }

  static recordException(error: Error): void {
    console.error('Traced exception:', error);
  }
}

console.log('Production tracing system ready');