/**
 * Security Headers Middleware using Helmet-style configuration
 */

interface SecurityHeadersConfig {
  hsts: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  contentTypeOptions: boolean;
  xssFilter: boolean;
  frameguard: string;
  referrerPolicy: string;
  csp: {
    reportOnly: boolean;
    directives: {
      defaultSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
      imgSrc: string[];
      connectSrc: string[];
      fontSrc: string[];
      objectSrc: string[];
      mediaSrc: string[];
      frameSrc: string[];
    };
  };
}

const defaultConfig: SecurityHeadersConfig = {
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  contentTypeOptions: true, // noSniff
  xssFilter: true,
  frameguard: 'deny',
  referrerPolicy: 'strict-origin-when-cross-origin',
  csp: {
    reportOnly: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for CSS-in-JS
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
};

class SecurityHeaders {
  private config: SecurityHeadersConfig;

  constructor(config: SecurityHeadersConfig = defaultConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  private setHSTS(res: any): void {
    if (process.env.NODE_ENV === 'production') {
      const hstsValue = [
        `max-age=${this.config.hsts.maxAge}`,
        this.config.hsts.includeSubDomains ? 'includeSubDomains' : '',
        this.config.hsts.preload ? 'preload' : ''
      ].filter(Boolean).join('; ');

      res.setHeader('Strict-Transport-Security', hstsValue);
    }
  }

  private setContentTypeOptions(res: any): void {
    if (this.config.contentTypeOptions) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }

  private setXSSFilter(res: any): void {
    if (this.config.xssFilter) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
  }

  private setFrameguard(res: any): void {
    res.setHeader('X-Frame-Options', this.config.frameguard.toUpperCase());
  }

  private setReferrerPolicy(res: any): void {
    res.setHeader('Referrer-Policy', this.config.referrerPolicy);
  }

  private setCSP(res: any): void {
    const directives = Object.entries(this.config.csp.directives)
      .map(([key, values]) => {
        const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${directive} ${values.join(' ')}`;
      })
      .join('; ');

    const header = this.config.csp.reportOnly 
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';

    res.setHeader(header, directives);
  }

  private setAdditionalHeaders(res: any): void {
    // Prevent MIME type sniffing
    res.setHeader('X-Download-Options', 'noopen');
    
    // Prevent Adobe Flash and PDF from executing
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    
    // Remove server fingerprinting
    res.removeHeader('X-Powered-By');
    
    // Prevent clickjacking for older browsers
    res.setHeader('X-Frame-Options', 'DENY');
  }

  public middleware() {
    return (req: any, res: any, next: any) => {
      try {
        this.setHSTS(res);
        this.setContentTypeOptions(res);
        this.setXSSFilter(res);
        this.setFrameguard(res);
        this.setReferrerPolicy(res);
        this.setCSP(res);
        this.setAdditionalHeaders(res);
        
        next();
      } catch (error) {
        console.error('Security headers middleware error:', error);
        next(); // Continue without security headers rather than blocking
      }
    };
  }
}

// Export configured middleware
export const securityHeaders = new SecurityHeaders();
export const securityHeadersMiddleware = securityHeaders.middleware();

// Custom CSP for specific routes
export function createCustomCSP(customDirectives: Partial<SecurityHeadersConfig['csp']['directives']>) {
  const customConfig = {
    ...defaultConfig,
    csp: {
      ...defaultConfig.csp,
      directives: {
        ...defaultConfig.csp.directives,
        ...customDirectives
      }
    }
  };
  
  return new SecurityHeaders(customConfig).middleware();
}