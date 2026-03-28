/**
 * Core Hotel Operations Service
 * Handles primary hotel management operations
 */

import { supabase } from '@/integrations/supabase/client';
import { hotelRepository } from '../repositories/hotelRepository';

export interface HotelQuery {
  id?: string;
  name?: string;
  city?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface HotelRegistrationData {
  name: string;
  country: string;
  city: string;
  contact_email: string;
  description?: string;
  total_rooms: number;
  address?: string;
  postal_code?: string;
  contact_name?: string;
  contact_phone?: string;
  property_type?: string;
  style?: string;
  category?: number;
  price_per_month?: number;
}

export class HotelService {
  /**
   * Register a new hotel
   */
  async registerHotel(data: HotelRegistrationData) {
    // Additional business validation could be added here
    return await hotelRepository.create(data);
  }

  /**
   * Get hotel by ID with full details
   */
  async getHotelById(hotelId: string) {
    return await hotelRepository.findById(hotelId);
  }

  /**
   * Update hotel information
   */
  async updateHotel(hotelId: string, updates: Partial<HotelRegistrationData>) {
    const existing = await hotelRepository.findById(hotelId);
    if (!existing) {
      throw new Error('Hotel not found');
    }

    return await hotelRepository.update(hotelId, updates);
  }

  /**
   * Get hotels with pagination and basic filtering
   */
  async getHotels(query: HotelQuery = {}) {
    return await hotelRepository.findMany(query);
  }

  /**
   * Activate or deactivate hotel
   */
  async setHotelStatus(hotelId: string, isActive: boolean) {
    return await hotelRepository.update(hotelId, {
      is_active: isActive,
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Get hotel statistics
   */
  async getHotelStats(hotelId: string) {
    return await hotelRepository.getStats(hotelId);
  }

  /**
   * Check if hotel name is available
   */
  async checkNameAvailability(name: string, excludeId?: string) {
    return await hotelRepository.checkNameAvailability(name, excludeId);
  }
}

export const hotelService = new HotelService();