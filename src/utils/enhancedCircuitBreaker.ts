/**
 * Enhanced Circuit Breaker Implementation using Opossum
 */
import CircuitBreaker from 'opossum';

export interface CircuitBreakerConfig {
  name: string;
  timeout: number;
  errorThresholdPercentage: number;
  resetTimeout: number;
  rollingCountTimeout?: number;
  rollingCountBuckets?: number;
  fallback?: (error: any) => any;
}

export class CircuitBreakerManager {
  private static breakers: Map<string, CircuitBreaker> = new Map();

  static createCircuitBreaker<T>(
    name: string,
    asyncFunction: (...args: any[]) => Promise<T>,
    config: Partial<CircuitBreakerConfig> = {}
  ): CircuitBreaker {
    
    const options = {
      timeout: config.timeout || 5000,
      errorThresholdPercentage: config.errorThresholdPercentage || 50,
      resetTimeout: config.resetTimeout || 30000,
      name: name,
      rollingCountTimeout: config.rollingCountTimeout || 10000,
      rollingCountBuckets: config.rollingCountBuckets || 10
    };

    const breaker = new CircuitBreaker(asyncFunction, options);

    // Set fallback if provided
    if (config.fallback) {
      breaker.fallback(config.fallback);
    }

    // Event listeners for monitoring
    breaker.on('open', () => {
      console.warn(`Circuit breaker '${name}' opened - failing fast`);
    });

    breaker.on('halfOpen', () => {
      console.log(`Circuit breaker '${name}' half-open - testing service`);
    });

    breaker.on('close', () => {
      console.log(`Circuit breaker '${name}' closed - service recovered`);
    });

    breaker.on('reject', () => {
      console.warn(`Circuit breaker '${name}' rejected request - service unavailable`);
    });

    breaker.on('timeout', () => {
      console.warn(`Circuit breaker '${name}' timeout - service too slow`);
    });

    breaker.on('failure', (error) => {
      console.error(`Circuit breaker '${name}' failure:`, error.message);
    });

    this.breakers.set(name, breaker);
    return breaker;
  }

  static getCircuitBreaker(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  static getAllBreakerStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [name, breaker] of this.breakers) {
      stats[name] = {
        state: breaker.state,
        stats: breaker.stats,
        isOpen: breaker.opened,
        isHalfOpen: breaker.halfOpen,
        isClosed: breaker.closed
      };
    }
    
    return stats;
  }

  static resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.close();
    }
  }
}

// Pre-configured circuit breakers for critical services

// External Payment Service Circuit Breaker
export const paymentCircuitBreaker = CircuitBreakerManager.createCircuitBreaker(
  'payment-service',
  async (paymentData: any) => {
    // This would be replaced with actual payment service call
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`Payment failed: ${response.status}`);
    }
    
    return response.json();
  },
  {
    timeout: 8000,
    errorThresholdPercentage: 30,
    resetTimeout: 60000,
    fallback: (error) => ({
      status: 'queued',
      message: 'Payment processing delayed due to service issues',
      retryAfter: 300000 // 5 minutes
    })
  }
);

// Email Service Circuit Breaker
export const emailCircuitBreaker = CircuitBreakerManager.createCircuitBreaker(
  'email-service',
  async (emailData: any) => {
    // This would be replaced with actual email service call
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`Email send failed: ${response.status}`);
    }
    
    return response.json();
  },
  {
    timeout: 10000,
    errorThresholdPercentage: 40,
    resetTimeout: 30000,
    fallback: (error) => ({
      status: 'queued',
      message: 'Email queued for later delivery'
    })
  }
);

// Database Operation Circuit Breaker
export const databaseCircuitBreaker = CircuitBreakerManager.createCircuitBreaker(
  'database-operations',
  async (operation: () => Promise<any>) => {
    return await operation();
  },
  {
    timeout: 5000,
    errorThresholdPercentage: 60,
    resetTimeout: 15000,
    fallback: (error) => {
      throw new Error('Database temporarily unavailable');
    }
  }
);

// External API Circuit Breaker
export const externalApiCircuitBreaker = CircuitBreakerManager.createCircuitBreaker(
  'external-api',
  async (apiCall: () => Promise<any>) => {
    return await apiCall();
  },
  {
    timeout: 6000,
    errorThresholdPercentage: 35,
    resetTimeout: 45000,
    fallback: (error) => ({
      status: 'degraded',
      message: 'Using cached data due to external service issues'
    })
  }
);