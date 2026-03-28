/**
 * Booking Validation Logic
 * Centralized validation for booking operations
 */

import { z } from 'zod';
import { BookingCreationData } from '../services/BookingService';

// Validation schemas
const bookingCreationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  hotelId: z.string().uuid('Invalid hotel ID'),
  packageId: z.string().uuid('Invalid package ID').optional(),
  checkIn: z.string().datetime('Invalid check-in date'),
  checkOut: z.string().datetime('Invalid check-out date'),
  totalPrice: z.number().positive('Total price must be positive'),
  guestCount: z.number().int().positive().max(20).optional(),
});

const dateRangeSchema = z.object({
  checkIn: z.string().datetime('Invalid check-in date'),
  checkOut: z.string().datetime('Invalid check-out date'),
}).refine(data => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date',
});

const bookingStatusSchema = z.enum(['pending', 'confirmed', 'cancelled', 'completed']);

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

/**
 * Validate booking creation data
 */
export function validateBookingData(data: BookingCreationData): ValidationResult {
  try {
    const validatedData = bookingCreationSchema.parse(data);
    
    // Additional business logic validation
    const businessValidation = validateBusinessRules(validatedData);
    if (!businessValidation.isValid) {
      return businessValidation;
    }

    return {
      isValid: true,
      errors: [],
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      isValid: false,
      errors: ['Validation failed']
    };
  }
}

/**
 * Validate date range for booking updates
 */
export function validateDateRange(checkIn: string, checkOut: string): ValidationResult {
  try {
    const validatedData = dateRangeSchema.parse({ checkIn, checkOut });
    
    // Check if dates are not in the past
    const checkInDate = new Date(checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      return {
        isValid: false,
        errors: ['Check-in date cannot be in the past']
      };
    }

    return {
      isValid: true,
      errors: [],
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      isValid: false,
      errors: ['Date validation failed']
    };
  }
}

/**
 * Validate booking status transitions
 */
export function validateStatusTransition(currentStatus: string, newStatus: string): ValidationResult {
  const validTransitions: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [], // Cannot transition from cancelled
    completed: [] // Cannot transition from completed
  };

  const allowedTransitions = validTransitions[currentStatus] || [];
  
  if (!allowedTransitions.includes(newStatus)) {
    return {
      isValid: false,
      errors: [`Cannot transition from ${currentStatus} to ${newStatus}`]
    };
  }

  return {
    isValid: true,
    errors: []
  };
}

/**
 * Validate guest information
 */
export function validateGuestInfo(guestName: string, guestPhone?: string): ValidationResult {
  const errors: string[] = [];

  // Name validation
  if (!guestName || guestName.trim().length === 0) {
    errors.push('Guest name is required');
  } else if (guestName.length > 200) {
    errors.push('Guest name is too long');
  } else if (!/^[a-zA-Z\s\-'\.]+$/.test(guestName)) {
    errors.push('Guest name contains invalid characters');
  }

  // Phone validation (if provided)
  if (guestPhone) {
    if (guestPhone.length > 50) {
      errors.push('Phone number is too long');
    } else if (!/^[\+]?[1-9][\d\s\-\(\)\.]{7,}$/.test(guestPhone.replace(/\s/g, ''))) {
      errors.push('Invalid phone number format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate booking duration constraints
 */
export function validateBookingDuration(checkIn: string, checkOut: string): ValidationResult {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const durationMs = checkOutDate.getTime() - checkInDate.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

  const errors: string[] = [];

  // Minimum stay validation
  if (durationDays < 1) {
    errors.push('Minimum stay is 1 night');
  }

  // Maximum stay validation (1 year)
  if (durationDays > 365) {
    errors.push('Maximum stay is 365 days');
  }

  // Future booking limit (2 years in advance)
  const maxAdvanceDate = new Date();
  maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 2);
  
  if (checkInDate > maxAdvanceDate) {
    errors.push('Booking cannot be made more than 2 years in advance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { durationDays }
  };
}

/**
 * Private helper: Additional business rules validation
 */
function validateBusinessRules(data: any): ValidationResult {
  const errors: string[] = [];

  // Validate date range
  const dateValidation = validateDateRange(data.checkIn, data.checkOut);
  if (!dateValidation.isValid) {
    errors.push(...dateValidation.errors);
  }

  // Validate duration
  const durationValidation = validateBookingDuration(data.checkIn, data.checkOut);
  if (!durationValidation.isValid) {
    errors.push(...durationValidation.errors);
  }

  // Validate guest count if provided
  if (data.guestCount && (data.guestCount < 1 || data.guestCount > 20)) {
    errors.push('Guest count must be between 1 and 20');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}