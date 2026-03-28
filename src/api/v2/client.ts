// API v2 Client for Frontend
import { supabase } from "@/integrations/supabase/client";
import { ApiV2Response } from "./types";

const API_V2_BASE_URL = '/api/v2';

class ApiV2Client {
  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      params?: Record<string, string>;
      requireAuth?: boolean;
      idempotencyKey?: string;
    } = {}
  ): Promise<ApiV2Response<T>> {
    const {
      method = 'GET',
      data,
      params,
      requireAuth = false,
      idempotencyKey
    } = options;

    // Build URL with query parameters
    const url = new URL(endpoint, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication if required
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    }

    // Add idempotency key if provided
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    // Make the request via Supabase edge function
    const { data: response, error } = await supabase.functions.invoke('api-v2', {
      body: {
        method,
        path: endpoint.replace(API_V2_BASE_URL, ''),
        data: method !== 'GET' ? data : undefined,
        params,
      },
      headers,
    });

    if (error) {
      console.error('API v2 request error:', error);
      return {
        success: false,
        error: error.message || 'Request failed',
        timestamp: new Date().toISOString()
      };
    }

    return response as ApiV2Response<T>;
  }

  // Code validation and generation
  async validateCode(code: string, entityType: string, excludeId?: string) {
    return this.makeRequest<{ isUnique: boolean; error?: string }>(
      `${API_V2_BASE_URL}/codes/validate`,
      {
        method: 'GET',
        params: { 
          code, 
          entity_type: entityType,
          ...(excludeId && { exclude_id: excludeId })
        }
      }
    );
  }

  async generateCode(entityType: string) {
    return this.makeRequest<{ code: string }>(
      `${API_V2_BASE_URL}/codes/generate`,
      {
        method: 'POST',
        data: { entity_type: entityType },
        requireAuth: false
      }
    );
  }

  // Hotel referrals
  async createHotelReferral(referralData: {
    hotel_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone?: string;
    city?: string;
    additional_info?: string;
    referral_type?: string;
    referral_date?: string;
  }, idempotencyKey: string) {
    return this.makeRequest<{ referral: any }>(
      `${API_V2_BASE_URL}/hotel-referrals`,
      {
        method: 'POST',
        data: referralData,
        requireAuth: true,
        idempotencyKey
      }
    );
  }

  // Hotels
  async getHotels(filters?: { 
    country?: string; 
    city?: string; 
    page?: number; 
    limit?: number; 
  }) {
    const params: Record<string, string> = {};
    if (filters?.country) params.country = filters.country;
    if (filters?.city) params.city = filters.city;
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();

    return this.makeRequest<{ 
      hotels: any[];
      pagination: { page: number; limit: number; total: number; pages: number; };
    }>(
      `${API_V2_BASE_URL}/hotels`,
      { method: 'GET', params }
    );
  }

  async getHotelById(id: string) {
    return this.makeRequest<{ hotel: any }>(
      `${API_V2_BASE_URL}/hotels/${id}`,
      { method: 'GET' }
    );
  }

  // Bookings
  async getBookings(filters?: { status?: string; page?: number; limit?: number; }) {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();

    return this.makeRequest<{ 
      bookings: any[];
      pagination: { page: number; limit: number; total: number; pages: number; };
    }>(
      `${API_V2_BASE_URL}/bookings`,
      { method: 'GET', params, requireAuth: true }
    );
  }

  async createBooking(bookingData: {
    package_id: string;
    check_in: string;
    check_out: string;
    guest_count?: number;
    referral_code_used?: string;
  }, idempotencyKey: string) {
    return this.makeRequest<{ booking: any }>(
      `${API_V2_BASE_URL}/bookings`,
      {
        method: 'POST',
        data: bookingData,
        requireAuth: true,
        idempotencyKey
      }
    );
  }

  // Profile
  async getProfile() {
    return this.makeRequest<{ profile: any }>(
      `${API_V2_BASE_URL}/profile`,
      { method: 'GET', requireAuth: true }
    );
  }

  async updateProfile(profileData: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    phone?: string;
  }) {
    return this.makeRequest<{ profile: any }>(
      `${API_V2_BASE_URL}/profile`,
      {
        method: 'PUT',
        data: profileData,
        requireAuth: true
      }
    );
  }

  // Free nights
  async getFreeNights() {
    return this.makeRequest<{ reward: any }>(
      `${API_V2_BASE_URL}/free-nights`,
      { method: 'GET', requireAuth: true }
    );
  }

  async redeemFreeNights(redeemData: {
    package_id: string;
    check_in: string;
    check_out: string;
  }, idempotencyKey: string) {
    return this.makeRequest<{ booking: any }>(
      `${API_V2_BASE_URL}/free-nights`,
      {
        method: 'POST',
        data: redeemData,
        requireAuth: true,
        idempotencyKey
      }
    );
  }
}

// Export singleton instance
export const apiV2Client = new ApiV2Client();