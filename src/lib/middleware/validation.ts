/**
 * API Validation Middleware
 * Centralized validation layer with security audit integration
 */

import { z } from 'zod';
import { validateRequest, validateContentType, validationSchemas } from '@/lib/validation/schemas';
import { auditValidationFailure, securityAuditor } from '@/lib/security/audit';

export interface ValidationContext {
  endpoint: string;
  method: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  statusCode: number;
}

/**
 * Main validation middleware function
 */
export async function validateApiRequest<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context: ValidationContext,
  contentType?: string | null
): Promise<ValidationResult<T>> {
  
  // Audit the API request
  securityAuditor.logSecurityEvent({
    type: 'data_access',
    severity: 'low',
    user_id: context.user_id,
    ip_address: context.ip_address,
    endpoint: context.endpoint,
    details: {
      method: context.method,
      user_agent: context.user_agent,
      has_auth: !!context.user_id
    }
  });

  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(context.method)) {
    if (!validateContentType(contentType)) {
      return {
        success: false,
        errors: ['Content-Type must be application/json'],
        statusCode: 400
      };
    }
  }

  // Validate request data
  const validation = validateRequest(schema);
  const result = validation(data);

  if (!result.success) {
    // Type guard to ensure errors exist
    if ('errors' in result) {
      result.errors.forEach(error => {
        const [field, ...messageParts] = error.split(': ');
        auditValidationFailure({
          endpoint: context.endpoint,
          field: field || 'unknown',
          value: data,
          rule: messageParts.join(': ') || error,
          user_id: context.user_id,
          ip_address: context.ip_address
        });
      });

      return {
        success: false,
        errors: result.errors,
        statusCode: 400
      };
    }
  }

  return {
    success: true,
    data: result.data,
    statusCode: 200
  };
}

// Validation functions for common endpoints
export const validateHotelRegistration = (data: unknown, context: ValidationContext) => {
  return validateApiRequest(data, validationSchemas.hotelRegistration, context);
};

export const validateBookingCreation = (data: unknown, context: ValidationContext) => {
  return validateApiRequest(data, validationSchemas.bookingCreation, context);
};

export const validateUserProfile = (data: unknown, context: ValidationContext) => {
  return validateApiRequest(data, validationSchemas.userProfile, context);
};

export const validateSearchQuery = (data: unknown, context: ValidationContext) => {
  return validateApiRequest(data, validationSchemas.searchQuery, context);
};

export const validateAdminAction = (data: unknown, context: ValidationContext) => {
  return validateApiRequest(data, validationSchemas.adminAction, context);
};

/**
 * Rate limiting integration
 */
interface RateLimitRule {
  endpoint: string;
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
}

const RATE_LIMITS: RateLimitRule[] = [
  { endpoint: '/api/hotels', windowMs: 60000, maxRequests: 100 }, // 100 requests per minute
  { endpoint: '/api/bookings', windowMs: 60000, maxRequests: 20 }, // 20 bookings per minute
  { endpoint: '/api/auth/login', windowMs: 900000, maxRequests: 5 }, // 5 login attempts per 15 minutes
  { endpoint: '/api/search', windowMs: 60000, maxRequests: 60 }, // 60 searches per minute
];

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(context: ValidationContext): { allowed: boolean; retryAfter?: number } {
  const rule = RATE_LIMITS.find(r => context.endpoint.startsWith(r.endpoint));
  if (!rule) return { allowed: true };

  const key = `${context.ip_address || 'unknown'}:${rule.endpoint}`;
  const now = Date.now();
  
  const current = requestCounts.get(key);
  if (!current || now > current.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + rule.windowMs });
    return { allowed: true };
  }

  if (current.count >= rule.maxRequests) {
    securityAuditor.logRateLimit(
      context.ip_address || 'unknown',
      context.endpoint,
      rule.maxRequests,
      current.count + 1
    );
    
    return { 
      allowed: false, 
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    };
  }

  current.count++;
  return { allowed: true };
}

/**
 * Request sanitization
 */
export function sanitizeRequest(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeRequest);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters
      sanitized[key] = value
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/['";]/g, '') // Remove quotes that could break SQL
        .trim();
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeRequest(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Error response formatting
 */
export function formatValidationError(errors: string[], statusCode: number = 400) {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: errors
    },
    metadata: {
      timestamp: new Date().toISOString(),
      request_id: crypto.randomUUID()
    },
    statusCode
  };
}

/**
 * Success response formatting
 */
export function formatSuccessResponse<T>(data: T, statusCode: number = 200) {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      request_id: crypto.randomUUID()
    },
    statusCode
  };
}
