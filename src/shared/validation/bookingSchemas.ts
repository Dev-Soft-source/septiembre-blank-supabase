/**
 * Booking-specific validation schemas
 * Extracted from centralized schemas for better maintainability
 */

import { z } from 'zod';

const sanitizeString = (str: string) => str.trim().replace(/[<>'"(){}[\]]/g, '');
const uuidSchema = z.string().uuid('Invalid UUID format');

export const bookingCreationSchema = z.object({
  package_id: uuidSchema,
  user_email: z.string().email('Invalid email format').max(254, 'Email too long').transform(str => str.toLowerCase().trim()),
  guest_name: z.string().trim().min(1, 'Guest name is required').max(200).transform(sanitizeString),
  guest_phone: z.string().max(50, 'Phone number too long').optional(),
  check_in_date: z.string().datetime('Invalid check-in date'),
  check_out_date: z.string().datetime('Invalid check-out date'),
  total_price: z.number().positive('Total price must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
});

export const bookingUpdateSchema = z.object({
  check_in: z.string().datetime('Invalid check-in date').optional(),
  check_out: z.string().datetime('Invalid check-out date').optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
});

export const bookingQuerySchema = z.object({
  booking_id: uuidSchema.optional(),
  user_id: uuidSchema.optional(),
  hotel_id: uuidSchema.optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  check_in: z.string().datetime().optional(),
  check_out: z.string().datetime().optional(),
});