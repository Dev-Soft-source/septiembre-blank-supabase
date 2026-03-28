/**
 * Redis-based Session Management
 */
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import redisClient from '../cache/redisClient';

// Configure Redis session store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'hotel-living-session:',
  ttl: 86400, // 24 hours
  disableTouch: false,
  disableTTL: false,
});

// Session configuration with enhanced security
export const sessionConfig = {
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiration on each request
  
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS access to cookies
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' as const, // CSRF protection
    domain: process.env.COOKIE_DOMAIN, // Set domain for multi-subdomain support
  },
  
  name: 'hotel-living-session', // Custom session name
  
  // Proxy trust for load balancers
  proxy: process.env.NODE_ENV === 'production',
};

// Session middleware factory
export const createSessionMiddleware = () => {
  return session(sessionConfig);
};

// Session utilities
export const SessionUtils = {
  // Regenerate session ID for security (e.g., after login)
  regenerateSession: (req: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err: any) => {
        if (err) {
          console.error('Session regeneration failed:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  // Destroy session (e.g., after logout)
  destroySession: (req: any, res: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destruction failed:', err);
          reject(err);
        } else {
          res.clearCookie('hotel-living-session');
          resolve();
        }
      });
    });
  },

  // Session health check
  checkSessionStore: async (): Promise<boolean> => {
    try {
      await redisClient.ping();
      return true;
    } catch (error) {
      console.error('Session store health check failed:', error);
      return false;
    }
  }
};

export default createSessionMiddleware();