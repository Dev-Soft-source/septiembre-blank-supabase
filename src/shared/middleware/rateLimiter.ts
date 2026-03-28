/**
 * Rate Limiting Middleware
 * Provides endpoint-specific rate limiting with proper error responses
 */

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  private getKey(req: any): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }
    
    // Default: use IP or user ID
    const userId = req.user?.id;
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    return userId ? `user:${userId}` : `ip:${ip}`;
  }

  public checkLimit(req: any, isSuccess?: boolean): { allowed: boolean; resetTime?: number; remaining?: number } {
    const key = this.getKey(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Initialize or reset if window expired
    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }

    // Skip counting successful requests if configured
    if (this.config.skipSuccessfulRequests && isSuccess) {
      return { 
        allowed: true, 
        resetTime: this.store[key].resetTime,
        remaining: this.config.maxRequests - this.store[key].count
      };
    }

    // Increment count for failed requests or all requests
    if (!isSuccess || !this.config.skipSuccessfulRequests) {
      this.store[key].count++;
    }

    const allowed = this.store[key].count <= this.config.maxRequests;
    
    return {
      allowed,
      resetTime: this.store[key].resetTime,
      remaining: Math.max(0, this.config.maxRequests - this.store[key].count)
    };
  }
}

// Pre-configured rate limiters
export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  skipSuccessfulRequests: true, // Only count failed auth attempts
});

export const bookingLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  skipSuccessfulRequests: false, // Count all booking attempts
});

// Rate limit middleware factory
export function createRateLimitMiddleware(limiter: RateLimiter, endpoint: string) {
  return (req: any, res: any, next: any) => {
    try {
      const result = limiter.checkLimit(req);
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', limiter['config'].maxRequests);
      res.setHeader('X-RateLimit-Remaining', result.remaining || 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil((result.resetTime || 0) / 1000));

      if (!result.allowed) {
        // Get localized message
        const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
        const messages = {
          en: 'Too many requests. Please try again later.',
          es: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
          pt: 'Muitas solicitações. Tente novamente mais tarde.',
          ro: 'Prea multe cereri. Încercați din nou mai târziu.'
        };

        return res.status(429).json({
          error: 'RATE_LIMIT_EXCEEDED',
          message: messages[lang as keyof typeof messages] || messages.en,
          retryAfter: Math.ceil(((result.resetTime || 0) - Date.now()) / 1000),
          endpoint
        });
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next(); // Allow request to continue on rate limiter failure
    }
  };
}

// Export configured middleware
export const authRateLimit = createRateLimitMiddleware(authLimiter, 'auth');
export const bookingRateLimit = createRateLimitMiddleware(bookingLimiter, 'bookings');