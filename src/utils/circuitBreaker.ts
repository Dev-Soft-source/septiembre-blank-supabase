/**
 * Circuit breaker implementation for API stability
 * Implements fail-fast strategy with half-open recovery mode
 */

interface CircuitBreakerOptions {
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
  monitoringWindow: number;
}

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

interface CircuitMetrics {
  failures: number;
  successes: number;
  requests: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private nextAttempt: number = 0;
  private metrics: CircuitMetrics = {
    failures: 0,
    successes: 0,
    requests: 0,
    lastFailureTime: null,
    lastSuccessTime: null
  };

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker is OPEN. Next attempt in ${this.nextAttempt - Date.now()}ms`);
      } else {
        this.state = CircuitState.HALF_OPEN;
      }
    }

    this.metrics.requests++;
    
    try {
      const result = await Promise.race([
        operation(),
        this.timeoutPromise()
      ]);
      
      this.onSuccess();
      return result as T;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private timeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timeout after ${this.options.timeout}ms`));
      }, this.options.timeout);
    });
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.metrics.successes++;
    this.metrics.lastSuccessTime = Date.now();
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.metrics.failures++;
    this.metrics.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeout;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getMetrics(): CircuitMetrics & { state: CircuitState } {
    return {
      ...this.metrics,
      state: this.state
    };
  }

  getHealthStatus(): {
    isHealthy: boolean;
    errorRate: number;
    avgResponseTime: number;
  } {
    const totalRequests = this.metrics.requests;
    const errorRate = totalRequests > 0 ? this.metrics.failures / totalRequests : 0;
    
    return {
      isHealthy: this.state !== CircuitState.OPEN && errorRate < 0.05,
      errorRate,
      avgResponseTime: 0 // This would be calculated from timing metrics
    };
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.nextAttempt = 0;
    this.metrics = {
      failures: 0,
      successes: 0,
      requests: 0,
      lastFailureTime: null,
      lastSuccessTime: null
    };
  }
}

// Circuit breaker instances for critical modules
export const authCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  timeout: 500, // 500ms timeout for auth operations
  resetTimeout: 30000, // 30 seconds before retry
  monitoringWindow: 60000 // 1 minute monitoring window
});

export const availabilityCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  timeout: 500,
  resetTimeout: 15000, // 15 seconds for availability
  monitoringWindow: 30000
});

export const bookingCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  timeout: 500,
  resetTimeout: 60000, // 1 minute for booking operations
  monitoringWindow: 120000
});

// Enhanced Supabase client wrapper with circuit breaker
export const createProtectedSupabaseOperation = <T>(
  circuitBreaker: CircuitBreaker,
  operation: () => Promise<T>
) => {
  return circuitBreaker.execute(operation);
};

export { CircuitBreaker, CircuitState };