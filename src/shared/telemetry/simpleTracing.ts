/**
 * Simplified Tracing for Production Scaling
 */

export class SimpleTracing {
  private static traces: Map<string, { start: number; attributes: any }> = new Map();

  static startTrace(name: string, attributes: any = {}): string {
    const traceId = `${name}-${Date.now()}-${Math.random()}`;
    this.traces.set(traceId, {
      start: Date.now(),
      attributes: { ...attributes, operation: name }
    });
    return traceId;
  }

  static endTrace(traceId: string): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      const duration = Date.now() - trace.start;
      console.log(`[TRACE] ${trace.attributes.operation}: ${duration}ms`, trace.attributes);
      this.traces.delete(traceId);
    }
  }

  static async withTrace<T>(name: string, operation: () => Promise<T>, attributes: any = {}): Promise<T> {
    const traceId = this.startTrace(name, attributes);
    try {
      return await operation();
    } finally {
      this.endTrace(traceId);
    }
  }
}

export const tracingMiddleware = (req: any, res: any, next: any) => {
  const traceId = SimpleTracing.startTrace(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  res.on('finish', () => {
    SimpleTracing.endTrace(traceId);
  });

  next();
};