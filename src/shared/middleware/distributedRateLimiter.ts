/**
 * Distributed Rate Limiting Middleware using Redis
 */
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redisClient from '../cache/redisClient';

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  keyGenerator?: (req: any) => string;
  skipSuccessfulRequests?: boolean;
  message?: string;
}) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: 'rate-limit:',
    }),
    windowMs: options.windowMs,
    max: options.max,
    keyGenerator: options.keyGenerator || ((req) => req.ip),
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    standardHeaders: true,
    legacyHeaders: false,
    message: options.message || {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    },
    handler: (req, res) => {
      const retryAfter = Math.round(options.windowMs / 1000);
      res.set('Retry-After', String(retryAfter));
      
      // Get localized message
      const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
      const messages = {
        en: 'Too many requests. Please try again later.',
        es: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
        pt: 'Muitas solicitações. Tente novamente mais tarde.',
        ro: 'Prea multe cereri. Încercați din nou mai târziu.'
      };

      res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: messages[lang as keyof typeof messages] || messages.en,
        retryAfter
      });
    }
  });
};

// Pre-configured rate limiters for different endpoints

// Authentication rate limiter - strict limits for security
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `auth:${req.ip}`,
  message: 'Too many authentication attempts. Please try again later.'
});

// General API rate limiter
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  keyGenerator: (req) => `api:${req.ip}`
});

// Booking rate limiter - prevent booking spam
export const bookingRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 bookings per hour
  keyGenerator: (req) => `booking:${req.user?.id || req.ip}`,
  message: 'Booking rate limit exceeded. Please try again later.'
});

// Search rate limiter - higher limits for search functionality
export const searchRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  keyGenerator: (req) => `search:${req.ip}`
});

// Admin panel rate limiter - moderate limits for admin operations
export const adminRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 admin operations per window
  keyGenerator: (req) => `admin:${req.user?.id || req.ip}`
});