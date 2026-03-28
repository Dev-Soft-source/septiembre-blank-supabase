/**
 * Centralized Input Validation Schemas
 * Single validation layer at API boundary using Zod
 */

import { z } from 'zod';

// Base validation utilities
const sanitizeString = (str: string) => str.trim().replace(/[<>'"(){}[\]]/g, '');

const stringSchema = (maxLength: number = 255) => z.string()
  .trim()
  .max(maxLength, `Must be ${maxLength} characters or less`)
  .transform(sanitizeString);

const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .transform(str => str.toLowerCase().trim());

const uuidSchema = z.string().uuid('Invalid UUID format');

// Hotel Registration Schema
export const hotelRegistrationSchema = z.object({
  name: z.string().trim().min(1, 'Hotel name is required').max(200).transform(sanitizeString),
  country: z.string().trim().min(1, 'Country is required').max(100).transform(sanitizeString),
  city: z.string().trim().min(1, 'City is required').max(100).transform(sanitizeString),
  contact_email: emailSchema,
  description: stringSchema(2000).optional(),
  total_rooms: z.number().int().positive().max(10000, 'Total rooms must be reasonable'),
  address: stringSchema(500).optional(),
  postal_code: stringSchema(20).optional(),
  contact_name: stringSchema(200).optional(),
  contact_phone: stringSchema(50).optional(),
  property_type: z.enum(['hotel', 'apartment', 'hostel', 'guesthouse', 'resort']).optional(),
  style: stringSchema(100).optional(),
  category: z.number().int().min(1).max(5).optional(),
  price_per_month: z.number().int().positive().max(50000, 'Price must be reasonable').optional(),
});

// Booking Creation Schema
export const bookingCreationSchema = z.object({
  package_id: uuidSchema,
  user_email: emailSchema,
  guest_name: z.string().trim().min(1, 'Guest name is required').max(200).transform(sanitizeString),
  guest_phone: stringSchema(50).optional(),
  check_in_date: z.string().datetime('Invalid check-in date'),
  check_out_date: z.string().datetime('Invalid check-out date'),
  total_price: z.number().positive('Total price must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
});

// User Profile Schema
export const userProfileSchema = z.object({
  first_name: stringSchema(100).optional(),
  last_name: stringSchema(100).optional(),
  bio: stringSchema(1000).optional(),
  phone: stringSchema(50).optional(),
  country: stringSchema(100).optional(),
  city: stringSchema(100).optional(),
});

// Search Query Schema
export const searchQuerySchema = z.object({
  query: stringSchema(100).optional(),
  country: stringSchema(100).optional(),
  city: stringSchema(100).optional(),
  min_price: z.number().int().positive().optional(),
  max_price: z.number().int().positive().optional(),
  property_type: z.enum(['hotel', 'apartment', 'hostel', 'guesthouse', 'resort']).optional(),
  check_in: z.string().datetime().optional(),
  check_out: z.string().datetime().optional(),
  guests: z.number().int().positive().max(20).optional(),
});

// Admin Action Schema
export const adminActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'suspend', 'restore']),
  target_id: uuidSchema,
  target_type: z.enum(['hotel', 'user', 'booking']),
  reason: stringSchema(500).optional(),
});

// Generic API Response Schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
  metadata: z.object({
    timestamp: z.string().datetime(),
    request_id: z.string().optional(),
  }).optional(),
});

// Content-Type validation
export const validateContentType = (contentType: string | null): boolean => {
  return contentType === 'application/json';
};

// Validation middleware function
export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return {
        success: false,
        errors: ['Validation failed']
      };
    }
  };
};

// Export all schemas for use in API endpoints
export const validationSchemas = {
  hotelRegistration: hotelRegistrationSchema,
  bookingCreation: bookingCreationSchema,
  userProfile: userProfileSchema,
  searchQuery: searchQuerySchema,
  adminAction: adminActionSchema,
  apiResponse: apiResponseSchema,
} as const;