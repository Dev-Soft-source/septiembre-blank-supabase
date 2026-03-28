/**
 * Strengthened Session Security Configuration
 */

export interface SessionConfig {
  name: string;
  secret: string;
  cookie: {
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    secure: boolean;
    maxAge: number;
  };
  rolling: boolean;
  resave: boolean;
  saveUninitialized: boolean;
  proxy: boolean;
}

export function createSessionConfig(): SessionConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    name: 'hotel-living-session', // Custom cookie name
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    cookie: {
      httpOnly: true, // Prevent XSS access to cookies
      sameSite: 'strict', // CSRF protection
      secure: isProduction, // HTTPS only in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    rolling: true, // Reset expiration on each request
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    proxy: true, // Trust proxy headers (for load balancers)
  };
}

// Session validation middleware
export function validateSession(req: any, res: any, next: any) {
  try {
    // Check if session exists and is valid
    if (req.session && req.session.id) {
      // Regenerate session ID on privilege escalation
      if (req.session.needsRegeneration) {
        req.session.regenerate((err: any) => {
          if (err) {
            console.error('Session regeneration failed:', err);
          }
          delete req.session.needsRegeneration;
          next();
        });
        return;
      }
    }
    
    next();
  } catch (error) {
    console.error('Session validation error:', error);
    next();
  }
}

// Session cleanup middleware
export function sessionCleanup(req: any, res: any, next: any) {
  try {
    // Add security headers for session management
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    next();
  } catch (error) {
    console.error('Session cleanup error:', error);
    next();
  }
}

// Logout utility
export function destroySession(req: any, res: any): Promise<void> {
  return new Promise((resolve, reject) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destruction failed:', err);
          reject(err);
        } else {
          res.clearCookie('hotel-living-session');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}