/**
 * Hotel Data Access Layer
 * Centralized database operations for hotels
 */

import { supabase } from '@/integrations/supabase/client';

export interface HotelRecord {
  id?: string;
  name: string;
  country: string;
  city: string;
  contact_email: string;
  description?: string | null;
  total_rooms: number;
  address?: string | null;
  postal_code?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  property_type?: string | null;
  style?: string | null;
  category?: number | null;
  price_per_month?: number | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HotelQuery {
  id?: string;
  name?: string;
  city?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedHotels {
  data: HotelRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class HotelRepository {
  /**
   * Create a new hotel record
   */
  async create(hotelData: Omit<HotelRecord, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    const { data, error } = await supabase
      .from('hotels')
      .insert([{
        ...hotelData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating hotel:', error);
      throw new Error(`Failed to create hotel: ${error.message}`);
    }

    return data;
  }

  /**
   * Find hotel by ID
   */
  async findById(hotelId: string): Promise<HotelRecord | null> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', hotelId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error finding hotel:', error);
      throw new Error(`Failed to find hotel: ${error.message}`);
    }

    return data;
  }

  /**
   * Find multiple hotels with pagination and filtering
   */
  async findMany(query: HotelQuery = {}): Promise<PaginatedHotels> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    let supabaseQuery = supabase
      .from('hotels')
      .select('*', { count: 'exact' });

    // Apply filters
    if (query.id) {
      supabaseQuery = supabaseQuery.eq('id', query.id);
    }
    if (query.name) {
      supabaseQuery = supabaseQuery.ilike('name', `%${query.name}%`);
    }
    if (query.city) {
      supabaseQuery = supabaseQuery.eq('city', query.city);
    }
    if (query.country) {
      supabaseQuery = supabaseQuery.eq('country', query.country);
    }

    // Add pagination
    supabaseQuery = supabaseQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await supabaseQuery;

    if (error) {
      console.error('Error finding hotels:', error);
      throw new Error(`Failed to find hotels: ${error.message}`);
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: data || [],
      total: totalCount,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Update hotel record
   */
  async update(hotelId: string, updates: Partial<HotelRecord>) {
    const { data, error } = await supabase
      .from('hotels')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', hotelId)
      .select()
      .single();

    if (error) {
      console.error('Error updating hotel:', error);
      throw new Error(`Failed to update hotel: ${error.message}`);
    }

    return data;
  }

  /**
   * Soft delete hotel (deactivate)
   */
  async delete(hotelId: string) {
    return await this.update(hotelId, { 
      is_active: false,
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Check if hotel name is available
   */
  async checkNameAvailability(name: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('hotels')
      .select('id')
      .eq('name', name);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking name availability:', error);
      return false;
    }

    return data?.length === 0;
  }

  /**
   * Get hotel statistics
   */
  async getStats(hotelId: string) {
    // Get basic hotel info
    const hotel = await this.findById(hotelId);
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    // Get booking statistics
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('status, total_price, check_in, check_out')
      .eq('hotel_id', hotelId);

    if (bookingsError) {
      console.error('Error fetching booking stats:', bookingsError);
      throw new Error(`Failed to fetch booking statistics: ${bookingsError.message}`);
    }

    const stats = {
      hotel: {
        name: hotel.name,
        totalRooms: hotel.total_rooms,
        isActive: hotel.is_active
      },
      bookings: {
        total: bookings?.length || 0,
        byStatus: {} as Record<string, number>,
        totalRevenue: 0,
        averageValue: 0
      },
      occupancy: {
        currentMonth: 0, // Would be calculated based on current bookings
        averageRate: 0
      }
    };

    if (bookings) {
      // Calculate booking statistics
      stats.bookings.totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
      stats.bookings.averageValue = stats.bookings.total > 0 ? stats.bookings.totalRevenue / stats.bookings.total : 0;

      // Group by status
      bookings.forEach(booking => {
        stats.bookings.byStatus[booking.status] = (stats.bookings.byStatus[booking.status] || 0) + 1;
      });

      // Calculate occupancy for current month (simplified)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthBookings = bookings.filter(booking => {
        const checkIn = new Date(booking.check_in);
        return checkIn.getMonth() === currentMonth && checkIn.getFullYear() === currentYear;
      });
      
      stats.occupancy.currentMonth = currentMonthBookings.length;
      stats.occupancy.averageRate = hotel.total_rooms > 0 ? (currentMonthBookings.length / hotel.total_rooms) * 100 : 0;
    }

    return stats;
  }

}

export const hotelRepository = new HotelRepository();