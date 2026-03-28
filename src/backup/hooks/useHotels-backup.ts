// @ts-nocheck
// BACKUP COPY - Original from src/hooks/useHotels.ts  
// Contains complete hotel fetching logic with all filters
// DO NOT MODIFY - This is a preservation backup
// TypeScript checking disabled due to database schema changes

import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FilterState } from '@/components/filters/FilterTypes';
import { adaptBackendHotelToFrontend } from '@/adapters/backend-field-adapter';
import type { FrontendHotel } from '@/adapters/backend-field-adapter';

export interface UseHotelsOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

export function useHotels(filters: FilterState = {}, options: UseHotelsOptions = {}) {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  return useQuery({
    queryKey: ['hotels', filters],
    queryFn: () => fetchHotelsWithFilters(filters),
    enabled,
    refetchOnWindowFocus,
    staleTime,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

async function fetchHotelsWithFilters(filters: FilterState): Promise<FrontendHotel[]> {
  console.log('🔍 fetchHotelsWithFilters called with filters:', filters);
  
  try {
    // Use the optimized view that includes pre-computed fields
    let query = supabase
      .from('hotels_with_filters_view')
      .select('*');

    // Apply filters
    if (filters.country?.trim()) {
      query = query.eq('country', filters.country);
    }

    if (filters.location?.trim()) {
      query = query.eq('city', filters.location);
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      query = query.gte('price_per_month', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice !== 999999 && filters.maxPrice > 0) {
      query = query.lte('price_per_month', filters.maxPrice);
    }

    if (filters.propertyType?.trim()) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.propertyStyle?.trim()) {
      query = query.eq('style', filters.propertyStyle);
    }

    if (filters.stars?.length) {
      query = query.in('category', filters.stars.map(s => parseInt(s)));
    }

    // Handle month filter with backend available_months array
    if (filters.month?.trim()) {
      const monthValue = filters.month;
      const monthMapping: Record<string, string[]> = {
        'january': ['January', '2024-01', '2025-01', '2026-01'],
        'february': ['February', '2024-02', '2025-02', '2026-02'],
        'march': ['March', '2024-03', '2025-03', '2026-03'],
        'april': ['April', '2024-04', '2025-04', '2026-04'],
        'may': ['May', '2024-05', '2025-05', '2026-05'],
        'june': ['June', '2024-06', '2025-06', '2026-06'],
        'july': ['July', '2024-07', '2025-07', '2026-07'],
        'august': ['August', '2024-08', '2025-08', '2026-08'],
        'september': ['September', '2024-09', '2025-09', '2026-09'],
        'october': ['October', '2024-10', '2025-10', '2026-10'],
        'november': ['November', '2024-11', '2025-11', '2026-11'],
        'december': ['December', '2024-12', '2025-12', '2026-12']
      };

      const possibleValues = monthMapping[monthValue.toLowerCase()] || [monthValue];
      query = query.overlaps('available_months', possibleValues);
    }

    if (filters.searchTerm?.trim()) {
      const searchTerm = filters.searchTerm.trim().toLowerCase();
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
    }

    // Handle themes/affinities using backend theme_names array
    if (filters.affinities?.length) {
      query = query.overlaps('theme_names', filters.affinities);
    }

    // Handle atmosphere filter
    if (filters.atmosphere?.trim()) {
      query = query.eq('atmosphere', filters.atmosphere);
    }

    // Handle activities using backend activity_names array
    if (filters.activities?.length) {
      const activityKeyToName: Record<string, string> = {
        'bachata_dancing': 'Baile Bachata',
        'classical_dancing': 'Baile Clásico',
        'ballroom_dancing': 'Baile de Salón',
        'rock_roll_dancing': 'Baile Rock & Roll',
        'salsa_dancing': 'Baile Salsa',
        'tango_dancing': 'Baile Tango',
        'ballet_dance': 'Ballet & Danza',
        'relaxing_yoga': 'Yoga Relax',
        'spanish_cooking_workshop': 'Taller Cocina Española',
        'hiking': 'Senderismo',
        'spa_massage': 'Spa & Masaje',
        'wine_tasting': 'Cata de Vinos',
        'fitness': 'Fitness',
        'meditation': 'Meditación',
        'live_music': 'Música en Vivo'
      };
      
      const activityNames = filters.activities.map(key => 
        activityKeyToName[key] || key
      );
      
      query = query.overlaps('activity_names', activityNames);
    }

    // Handle features using separate queries (since JSONB operations are complex)
    let hotelIds: string[] | undefined;

    if (filters.hotelFeatures?.length) {
      const { data: hotelFeatureHotels, error: hotelFeatureError } = await supabase
        .from('hotels')
        .select('id')
        .or(filters.hotelFeatures.map(feature => 
          `features_hotel->>'${feature.toLowerCase().replace(/\s+/g, '_')}' = 'true'`
        ).join(','));
      
      if (hotelFeatureError || !hotelFeatureHotels) {
        console.error('Hotel feature query error:', hotelFeatureError);
        throw new Error(`Hotel feature query failed: ${hotelFeatureError?.message}`);
      }
      
      hotelIds = hotelFeatureHotels.map(h => h.id) || [];
      if (hotelIds.length === 0) {
        return [];
      }
    }

    if (filters.roomFeatures?.length) {
      const { data: roomFeatureHotels, error: roomFeatureError } = await supabase
        .from('hotels')
        .select('id')
        .or(filters.roomFeatures.map(feature => 
          `features_room->>'${feature.toLowerCase().replace(/\s+/g, '_')}' = 'true'`
        ).join(','));
      
      if (roomFeatureError || !roomFeatureHotels) {
        console.error('Room feature query error:', roomFeatureError);
        throw new Error(`Room feature query failed: ${roomFeatureError?.message}`);
      }
      
      const roomFeatureIds = roomFeatureHotels.map(h => h.id) || [];
      if (roomFeatureIds.length === 0) {
        return [];
      }

      // Intersect with previous hotel IDs if any
      hotelIds = hotelIds 
        ? hotelIds.filter(id => roomFeatureIds.includes(id))
        : roomFeatureIds;
    }

    // Apply hotel IDs filter if we have feature filters
    if (hotelIds !== undefined) {
      if (hotelIds.length === 0) {
        return [];
      }
      query = query.in('id', hotelIds);
    }

    // Handle stay lengths and meal plans via availability packages
    if (filters.stayLengths?.trim() || filters.mealPlans?.length) {
      let packageQuery = supabase.from('availability_packages_public_view').select('hotel_id');
      
      if (filters.stayLengths?.trim()) {
        const durationDays = parseInt(filters.stayLengths.split(' ')[0]);
        packageQuery = packageQuery.eq('duration_days', durationDays);
      }
      
      if (filters.mealPlans?.length) {
        const mealPlanMapping: Record<string, string> = {
          'accommodationOnly': 'room_only',
          'breakfastIncluded': 'breakfast',
          'halfBoard': 'half_board',
          'fullBoard': 'full_board',
          'allInclusive': 'all_inclusive',
        };
        
        const mappedPlans = filters.mealPlans.map(plan => 
          mealPlanMapping[plan] || plan
        );
        
        packageQuery = packageQuery.in('meal_plan', mappedPlans);
      }
      
      const { data: packages } = await packageQuery;
      const packageHotelIds = packages?.map(p => p.hotel_id) || [];
      
      if (packageHotelIds.length === 0) {
        return [];
      }
      
      // Apply package filter
      query = query.in('id', packageHotelIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Database query error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    if (!data) {
      console.log('✅ Query successful but no data returned');
      return [];
    }

    console.log(`✅ Query successful, found ${data.length} hotels`);

    // Transform backend data to frontend format
    const transformedHotels = data.map(hotel => {
      const transformed = adaptBackendHotelToFrontend(hotel);
      console.log(`🔄 Transformed hotel: ${hotel.id} -> ${transformed.name}`);
      return transformed;
    });

    return transformedHotels;

  } catch (error: any) {
    console.error('❌ fetchHotelsWithFilters error:', error);
    throw error;
  }
}

export function useHotelDetail(hotelId: string | undefined) {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => fetchHotelDetail(hotelId!),
    enabled: !!hotelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

async function fetchHotelDetail(hotelId: string): Promise<FrontendHotel> {
  console.log('🎯 fetchHotelDetail called for hotel:', hotelId);
  
  const { data, error } = await supabase
    .from('hotels')
    .select(`
      *,
      hotel_images (
        id,
        image_url, 
        is_main,
        created_at
      ),
      hotel_themes (
        theme_id,
        themes (
          id,
          name,
          description,
          category
        )
      ),
      hotel_activities (
        activity_id,
        activities (
          id,
          name,
          category
        )
      )
    `)
    .eq('id', hotelId)
    .maybeSingle();

  if (error) {
    console.error('❌ Hotel detail query error:', error);
    throw new Error(`Failed to fetch hotel details: ${error.message}`);
  }

  if (!data) {
    throw new Error('Hotel not found');
  }

  console.log('✅ Hotel detail query successful:', data.name);
  return adaptBackendHotelToFrontend(data);
}
