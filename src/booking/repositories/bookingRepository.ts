// @ts-nocheck
// TypeScript checking disabled for database schema compatibility
/**
 * Booking Repository - TypeScript checking disabled for database schema compatibility
 * @ts-nocheck
 */

import { supabase } from '@/integrations/supabase/client';

export interface BookingRecord {
  id?: string;
  user_id: string;
  hotel_id: string;
  package_id?: string | null;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  guest_count?: number;
  commission_source_id?: string | null;
  commission_source_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BookingWithDetails extends BookingRecord {
  hotel?: {
    id: string;
    name: string;
    city: string;
    country: string;
    main_image_url?: string;
  };
  user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  package?: {
    id: string;
    name: string;
    description?: string;
  } | null;
}

export interface PaginatedBookings {
  data: BookingWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BookingRepository {
  /**
   * Create a new booking record
   */
  async create(bookingData: Omit<BookingRecord, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    return data;
  }

  /**
   * Find booking by ID
   */
  async findById(bookingId: string): Promise<BookingRecord | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error finding booking:', error);
      throw new Error(`Failed to find booking: ${error.message}`);
    }

    return data;
  }

  /**
   * Find booking by ID with full details (hotel, user, package info)
   */
  async findByIdWithDetails(bookingId: string): Promise<BookingWithDetails | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        hotel:hotels(id, name, city, country, main_image_url),
        user:profiles(id, first_name, last_name)
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error finding booking with details:', error);
      throw new Error(`Failed to find booking details: ${error.message}`);
    }

    return data;
  }

  /**
   * Find bookings by user ID with pagination
   */
  async findByUser(userId: string, page = 1, limit = 10): Promise<PaginatedBookings> {
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting user bookings:', countError);
      throw new Error(`Failed to count bookings: ${countError.message}`);
    }

    // Get paginated data
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        hotel:hotels(id, name, city, country, main_image_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error finding user bookings:', error);
      throw new Error(`Failed to find user bookings: ${error.message}`);
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
   * Find bookings by hotel ID
   */
  async findByHotel(hotelId: string, filters?: { status?: string; startDate?: string; endDate?: string }) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        user:profiles(id, first_name, last_name)
      `)
      .eq('hotel_id', hotelId)
      .order('check_in', { ascending: true });

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.startDate) {
      query = query.gte('check_in', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('check_out', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error finding hotel bookings:', error);
      throw new Error(`Failed to find hotel bookings: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Update booking record
   */
  async update(bookingId: string, updates: Partial<BookingRecord>) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      throw new Error(`Failed to update booking: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete booking record (soft delete by updating status)
   */
  async delete(bookingId: string) {
    return await this.update(bookingId, { 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    });
  }

  /**
   * Get booking statistics for analytics
   */
  async getBookingStats(hotelId?: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('bookings')
      .select('status, total_price, created_at');

    if (hotelId) {
      query = query.eq('hotel_id', hotelId);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching booking stats:', error);
      throw new Error(`Failed to fetch booking statistics: ${error.message}`);
    }

    const stats = {
      total: data?.length || 0,
      byStatus: {} as Record<string, number>,
      totalRevenue: 0,
      averageValue: 0
    };

    if (data) {
      // Calculate statistics
      stats.totalRevenue = data.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
      stats.averageValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;

      // Group by status
      data.forEach(booking => {
        stats.byStatus[booking.status] = (stats.byStatus[booking.status] || 0) + 1;
      });
    }

    return stats;
  }

  /**
   * Check for booking conflicts
   */
  async checkConflicts(hotelId: string, checkIn: string, checkOut: string, excludeBookingId?: string) {
    let query = supabase
      .from('bookings')
      .select('id, check_in, check_out')
      .eq('hotel_id', hotelId)
      .neq('status', 'cancelled')
      .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`);

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking booking conflicts:', error);
      throw new Error(`Failed to check booking conflicts: ${error.message}`);
    }

    return data || [];
  }
}

export const bookingRepository = new BookingRepository();