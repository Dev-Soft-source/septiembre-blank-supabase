/**
 * Advanced Security Headers & CSP Hardening Middleware
 * Implements strict CSP, HSTS, and cross-origin policies
 */
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

export const advancedSecurityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", // Required for React dev
        "'unsafe-eval'", // Required for React dev
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:",
        "blob:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com"
      ],
      connectSrc: [
        "'self'",
        "https://*.supabase.co",
        "https://api.stripe.com",
        "wss:",
        "ws:"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      upgradeInsecureRequests: [],
      reportUri: '/api/security/csp-report'
    },
    reportOnly: process.env.NODE_ENV === 'development'
  },
  
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  crossOriginEmbedderPolicy: { policy: "credentialless" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  
  // Remove server fingerprinting
  hidePoweredBy: true
});

// CSP Report Handler Middleware
export const cspReportHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/security/csp-report' && req.method === 'POST') {
    const report = req.body;
    
    console.warn('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      userAgent: req.get('user-agent'),
      ip: req.ip,
      violation: report
    });
    
    // Log to security monitoring
    const SecurityMonitor = require('../security/securityMonitor').SecurityMonitor;
    SecurityMonitor.logSecurityEvent('csp_violation', 'medium', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      violation: report
    });
    
    res.status(204).send();
    return;
  }
  
  next();
};