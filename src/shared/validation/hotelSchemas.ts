/**
 * Hotel-specific validation schemas
 * Extracted from centralized schemas for better maintainability
 */

import { z } from 'zod';

const sanitizeString = (str: string) => str.trim().replace(/[<>'"(){}[\]]/g, '');
const stringSchema = (maxLength: number = 255) => z.string().trim().max(maxLength, `Must be ${maxLength} characters or less`).transform(sanitizeString);
const emailSchema = z.string().email('Invalid email format').max(254, 'Email too long').transform(str => str.toLowerCase().trim());

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

export const hotelUpdateSchema = z.object({
  name: stringSchema(200).optional(),
  description: stringSchema(2000).optional(),
  contact_email: emailSchema.optional(),
  contact_name: stringSchema(200).optional(),
  contact_phone: stringSchema(50).optional(),
  address: stringSchema(500).optional(),
  postal_code: stringSchema(20).optional(),
  price_per_month: z.number().int().positive().max(50000).optional(),
  is_active: z.boolean().optional(),
});

export const hotelSearchSchema = z.object({
  query: stringSchema(100).optional(),
  country: stringSchema(100).optional(),
  city: stringSchema(100).optional(),
  property_type: z.enum(['hotel', 'apartment', 'hostel', 'guesthouse', 'resort']).optional(),
  min_price: z.number().int().positive().optional(),
  max_price: z.number().int().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});