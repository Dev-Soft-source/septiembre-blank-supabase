import { z } from 'zod';

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .trim();
};

export const sanitizeSearchQuery = (query: string): string => {
  return query
    .replace(/[<>'"(){}[\]]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 100); // Limit length
};

// Zod schemas for form validation
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(254, 'Email too long');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const searchQuerySchema = z.string()
  .max(100, 'Search query too long')
  .regex(/^[a-zA-Z0-9\s\-_.,]+$/, 'Search query contains invalid characters');

export const hotelNameSchema = z.string()
  .min(1, 'Hotel name is required')
  .max(200, 'Hotel name too long')
  .regex(/^[a-zA-Z0-9\s\-_.,&'()]+$/, 'Hotel name contains invalid characters');

// Advanced validation functions
export const validateAndSanitize = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};

// Safe property access for dynamic data
export const safeGet = <T>(
  obj: unknown,
  path: string,
  defaultValue: T
): T => {
  try {
    const keys = path.split('.');
    let current: any = obj;
    
    for (const key of keys) {
      if (current == null || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current ?? defaultValue;
  } catch {
    return defaultValue;
  }
};