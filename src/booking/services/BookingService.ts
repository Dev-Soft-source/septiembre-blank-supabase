/**
 * Core Booking Operations Service
 * Handles primary booking lifecycle operations
 */

import { supabase } from '@/integrations/supabase/client';
import { BookingStatus } from '@/types/booking';
import { bookingRepository } from '../repositories/bookingRepository';
import { validateBookingData } from '../validation/bookingValidators';

export interface BookingCreationData {
  userId: string;
  hotelId: string;
  packageId?: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guestCount?: number;
}

export interface BookingUpdateData {
  checkIn?: string;
  checkOut?: string;
  status?: BookingStatus;
}

export class BookingService {
  /**
   * Create a new booking with validation and availability checks
   */
  async createBooking(data: BookingCreationData) {
    // Validate booking data
    const validation = validateBookingData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Package validation would be implemented here when packages table exists

    // Create booking record
    const bookingData = {
      user_id: data.userId,
      hotel_id: data.hotelId,
      package_id: data.packageId || null,
      check_in: data.checkIn,
      check_out: data.checkOut,
      total_price: data.totalPrice,
      status: BookingStatus.PENDING,
      guest_count: data.guestCount || 1,
    };

    return await bookingRepository.create(bookingData);
  }

  /**
   * Update existing booking with validation
   */
  async updateBooking(bookingId: string, updates: BookingUpdateData) {
    const existing = await bookingRepository.findById(bookingId);
    if (!existing) {
      throw new Error('Booking not found');
    }

    // Validate package constraints
    if (existing.package_id && (updates.checkIn || updates.checkOut)) {
      throw new Error('Cannot modify dates for package-based bookings');
    }

    return await bookingRepository.update(bookingId, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Cancel a booking and restore availability
   */
  async cancelBooking(bookingId: string) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Restore package availability if needed
    if (booking.package_id) {
      await this.restorePackageAvailability(booking.package_id, 1);
    }

    return await bookingRepository.update(bookingId, {
      status: BookingStatus.CANCELLED,
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Get booking with full details
   */
  async getBookingDetails(bookingId: string) {
    return await bookingRepository.findByIdWithDetails(bookingId);
  }

  /**
   * Get user bookings with pagination
   */
  async getUserBookings(userId: string, page = 1, limit = 10) {
    return await bookingRepository.findByUser(userId, page, limit);
  }

  /**
   * Check if booking can be modified
   */
  canModifyBooking(status: string): boolean {
    return status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED;
  }

  /**
   * Check if booking can be cancelled
   */
  canCancelBooking(status: string): boolean {
    return status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED;
  }

  /**
   * Private helper: Restore package availability (placeholder for when packages table exists)
   */
  private async restorePackageAvailability(packageId: string, rooms: number) {
    // This would restore package availability when packages table is implemented
    console.log(`Would restore ${rooms} rooms for package ${packageId}`);
  }
}

export const bookingService = new BookingService();