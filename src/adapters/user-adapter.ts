/**
 * User Adapter
 * Safely adapts user queries to backend database schema
 * Prevents queries for non-existent fields
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type BackendProfile = Database['public']['Tables']['profiles']['Row'];

// Frontend user interface based on current usage
export interface FrontendUser {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  is_hotel_owner?: boolean | null;
  is_active?: boolean | null;
  created_at: string;
  email?: string | null;
  role?: string | null;
  hotels?: any; // Keep flexible for hotel relations
}

/**
 * Transform backend profile to frontend user format
 */
export function adaptBackendUserToFrontend(backendUser: BackendProfile & any): FrontendUser {
  return {
    id: backendUser.id,
    first_name: backendUser.first_name,
    last_name: backendUser.last_name,
    is_hotel_owner: backendUser.is_hotel_owner,
    is_active: backendUser.is_active,
    created_at: backendUser.created_at,
    email: backendUser.email,
    role: backendUser.role,
    hotels: backendUser.hotels, // Pass through relations
  };
}

/**
 * Safe user query with pagination
 */
export async function queryUsersWithBackendAdapter(page: number, limit: number): Promise<{
  data: FrontendUser[];
  totalCount: number;
  error: Error | null;
}> {
  try {
    // Get total count first
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (countError) {
      return { data: [], totalCount: 0, error: countError };
    }

    // Get paginated data
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*, hotels(name, city)')
      .range(from, to);

    if (error) {
      return { data: [], totalCount: 0, error };
    }

    const transformedUsers = (data || []).map(user => 
      adaptBackendUserToFrontend(user)
    );

    return {
      data: transformedUsers,
      totalCount: count || 0,
      error: null
    };

  } catch (error: any) {
    return { data: [], totalCount: 0, error };
  }
}

/**
 * Get available user fields for queries
 */
export function getUserQuerySelect(): string {
  return `
    id, first_name, last_name, is_hotel_owner, is_active, 
    created_at, email, role
  `;
}