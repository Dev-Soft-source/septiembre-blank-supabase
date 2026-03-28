/**
 * Enhanced Supabase client wrapper with circuit breaker protection
 * and caching for production scale
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  authCircuitBreaker, 
  availabilityCircuitBreaker, 
  bookingCircuitBreaker,
  createProtectedSupabaseOperation
} from './circuitBreaker';
import { withCache, CacheKeys, CacheTTL, invalidateHotelCache, globalCache } from './caching';
import type { Database } from '@/integrations/supabase/types';

type SupabaseClient = typeof supabase;

/**
 * Enhanced authentication operations with circuit breaker protection
 */
export const enhancedAuth = {
  signIn: async (email: string, password: string) => {
    return createProtectedSupabaseOperation(authCircuitBreaker, async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new Error(`Auth error: ${error.message}`);
      return data;
    });
  },

  signUp: async (email: string, password: string, options?: any) => {
    return createProtectedSupabaseOperation(authCircuitBreaker, async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });
      
      if (error) throw new Error(`Signup error: ${error.message}`);
      return data;
    });
  },

  getSession: async () => {
    return createProtectedSupabaseOperation(authCircuitBreaker, async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw new Error(`Session error: ${error.message}`);
      return session;
    });
  }
};

/**
 * Enhanced availability operations with caching and circuit breaker
 */
export const enhancedAvailability = {
  getPackages: async (hotelId: string, startDate?: string, endDate?: string) => {
    const cacheKey = CacheKeys.availability(
      hotelId,
      startDate ? startDate.substring(0, 7) : new Date().toISOString().substring(0, 7),
      28 // Default duration
    );

    return withCache(cacheKey, async () => {
      return createProtectedSupabaseOperation(availabilityCircuitBreaker, async () => {
        let query = supabase
          .from('availability_packages')
          .select('*')
          .eq('hotel_id', hotelId)
          .gt('available_rooms', 0);

        if (startDate) query = query.gte('start_date', startDate);
        if (endDate) query = query.lte('end_date', endDate);

        const { data, error } = await query.order('start_date');
        
        if (error) throw new Error(`Availability error: ${error.message}`);
        return data;
      });
    }, CacheTTL.AVAILABILITY_MEDIUM);
  },

  checkAvailability: async (packageId: string, roomsNeeded: number = 1) => {
    return createProtectedSupabaseOperation(availabilityCircuitBreaker, async () => {
      // Simple availability check - query the package directly
      const { data: packageData, error } = await supabase
        .from('availability_packages')
        .select('rooms')
        .eq('id', packageId)
        .single();
      
      if (error) throw new Error(`Availability check error: ${error.message}`);
      return { available: (packageData?.rooms || 0) >= roomsNeeded };
    });
  }
};

/**
 * Enhanced booking operations with circuit breaker protection
 */
export const enhancedBookings = {
  createBooking: async (bookingData: any) => {
    return createProtectedSupabaseOperation(bookingCircuitBreaker, async () => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();
      
      if (error) throw new Error(`Booking creation error: ${error.message}`);
      
      // Invalidate availability cache for the hotel
      if (bookingData.hotel_id) {
        invalidateHotelCache(bookingData.hotel_id);
      }
      
      return data;
    });
  },

  updateBooking: async (bookingId: string, updates: any) => {
    return createProtectedSupabaseOperation(bookingCircuitBreaker, async () => {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw new Error(`Booking update error: ${error.message}`);
      return data;
    });
  },

  getBookings: async (userId: string) => {
    const cacheKey = `bookings:user:${userId}`;
    
    return withCache(cacheKey, async () => {
      return createProtectedSupabaseOperation(bookingCircuitBreaker, async () => {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            hotels (
              id,
              name,
              city,
              country
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw new Error(`Bookings fetch error: ${error.message}`);
        return data;
      });
    }, CacheTTL.USER_PROFILE);
  }
};

/**
 * Enhanced hotel operations with caching
 */
export const enhancedHotels = {
  getHotel: async (hotelId: string) => {
    const cacheKey = CacheKeys.hotel(hotelId);
    
    return withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select(`
          *,
          hotel_themes (
            themes (id, name)
          ),
          hotel_activities (
            activities (id, name)
          ),
          availability_packages (*)
        `)
        .eq('id', hotelId)
        .eq('status', 'approved')
        .single();
      
      if (error) throw new Error(`Hotel fetch error: ${error.message}`);
      return data;
    }, CacheTTL.HOTEL_STATIC);
  },

  searchHotels: async (filters: any = {}) => {
    const filtersKey = JSON.stringify(filters);
    const cacheKey = CacheKeys.hotelList(filtersKey);
    
    return withCache(cacheKey, async () => {
      let query = supabase
        .from('hotels')
        .select(`
          *,
          availability_packages (*),
          hotel_themes (
            themes (id, name)
          )
        `)
        .eq('status', 'approved');

      // Apply filters
      if (filters.country) query = query.eq('country', filters.country);
      if (filters.city) query = query.eq('city', filters.city);
      // REMOVED: Old database-level price filtering - now uses package-based calculation
      if (filters.minPrice) console.log('💰 Database-level price filtering disabled - using package calculation');
      if (filters.maxPrice) console.log('💰 Database-level price filtering disabled - using package calculation');

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw new Error(`Hotels search error: ${error.message}`);
      return data;
    }, CacheTTL.AVAILABILITY_SHORT);
  }
};

/**
 * Enhanced reference data operations with long-term caching
 */
export const enhancedReferenceData = {
  getThemes: async () => {
    const cacheKey = CacheKeys.themes();
    
    return withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name');
      
      if (error) throw new Error(`Themes fetch error: ${error.message}`);
      return data;
    }, CacheTTL.THEMES_ACTIVITIES);
  },

  getActivities: async () => {
    const cacheKey = CacheKeys.activities();
    
    return withCache(cacheKey, async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('name');
      
      if (error) throw new Error(`Activities fetch error: ${error.message}`);
      return data;
    }, CacheTTL.THEMES_ACTIVITIES);
  }
};

/**
 * Health check function for monitoring
 */
export const performHealthCheck = async (): Promise<{
  database: boolean;
  circuitBreakers: any;
  cacheStats: any;
}> => {
  try {
    // Test database connectivity
    const { error } = await supabase
      .from('hotels')
      .select('id')
      .limit(1);
    
    const dbHealthy = !error;
    
    return {
      database: dbHealthy,
      circuitBreakers: {
        auth: authCircuitBreaker.getMetrics(),
        availability: availabilityCircuitBreaker.getMetrics(),
        booking: bookingCircuitBreaker.getMetrics()
      },
      cacheStats: globalCache.getStats()
    };
  } catch (error) {
    return {
      database: false,
      circuitBreakers: {
        auth: authCircuitBreaker.getMetrics(),
        availability: availabilityCircuitBreaker.getMetrics(),
        booking: bookingCircuitBreaker.getMetrics()
      },
      cacheStats: null
    };
  }
};