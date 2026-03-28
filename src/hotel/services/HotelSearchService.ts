/**
 * Hotel Search Service
 * Handles complex hotel search and filtering operations
 */

import { supabase } from '@/integrations/supabase/client';
import { FilterState } from '@/components/filters/FilterTypes';

// Define explicit interfaces to avoid TypeScript inference issues
export interface SearchHotelResult {
  id: string;
  name: string;
  city: string;
  country: string;
  price_per_month: number;
}

export interface SearchFilters {
  searchTerm?: string;
  country?: string;
  city?: string;
  propertyType?: string;
  propertyStyle?: string;
  atmosphere?: string;
  minPrice?: number;
  maxPrice?: number;
  month?: string;
  stayLengths?: string;
  theme?: Array<{ name: string }>;
  activities?: string[];
  hotelFeatures?: string[];
  roomFeatures?: string[];
  mealPlans?: string[];
}

export interface SearchResult {
  hotels: any[];
  total: number;
  filters: FilterState;
}

export class HotelSearchService {
  /**
   * Search hotels with comprehensive filtering
   */
  async searchHotels(filters: FilterState): Promise<any[]> {
    console.log('🔍 HotelSearchService: Starting search with filters:', JSON.stringify(filters, null, 2));
    
    const hasActiveFilters = this.hasActiveFilters(filters);
    console.log('🔍 Has active filters:', hasActiveFilters);
    
    // Build comprehensive query with all related data
    let query = supabase
      .from('hotels_public_view')
      .select(`
        id, name, city, country, price_per_month, main_image_url, category,
        property_type, style, atmosphere, available_months, stay_lengths,
        features_hotel, features_room, meal_plans,
        hotel_themes!left(themes!inner(id, name)),
        hotel_activities!left(activities!inner(id, name)),
        hotel_images!left(image_url, is_main)
      `);

    // Apply database-level filters for better performance
    if (hasActiveFilters) {
      query = this.applyDatabaseFilters(query, filters);
    }

    // Add reasonable limit
    query = query.limit(50);

    const { data: hotels, error } = await query;

    if (error) {
      console.error('❌ Error fetching hotels:', error);
      throw error;
    }

    if (!hotels) {
      console.log('⚠️ No hotels found');
      return [];
    }

    console.log(`📊 Fetched ${hotels.length} hotels with all related data in single query`);
    
    // Apply remaining filters that couldn't be done at database level
    if (hasActiveFilters) {
      console.log('🔧 Applying client-side filters...');
      return this.applyClientSideFilters(hotels, filters);
    }
    
    console.log('🔄 No client-side filtering needed, returning all hotels');
    return hotels;
  }

  /**
   * Convert hotel data to UI format
   */
  convertToUIFormat(hotel: any) {
    console.log('🔄 Converting hotel to UI format:', hotel?.name, hotel?.id);
    
    if (!hotel || typeof hotel !== 'object') {
      console.warn('❌ Invalid hotel data received:', hotel);
      return null;
    }

    try {
      const thumbnail = hotel.main_image_url || 
                       hotel.thumbnail || 
                       (hotel.hotel_images && hotel.hotel_images[0]?.image_url) ||
                       "/placeholder.svg";
      
      console.log('🖼️ Hotel image fallback for', hotel.name, ':', {
        main_image_url: hotel.main_image_url,
        thumbnail: hotel.thumbnail,
        final_thumbnail: thumbnail
      });

      const converted = {
        id: hotel.id,
        name: hotel.name || 'Unnamed Hotel',
        location: hotel.location || `${hotel.city || ''}, ${hotel.country || ''}`.replace(/^,\s*/, ''),
        city: hotel.city || 'Unknown City',
        country: hotel.country || 'Unknown Country',
        price_per_month: hotel.price_per_month || 0,
        thumbnail: thumbnail,
        theme: hotel.theme,
        category: hotel.category || 0,
        hotel_images: hotel.hotel_images || [],
        hotel_themes: hotel.hotel_themes || [],
        hotel_activities: hotel.hotel_activities || [],
        available_months: hotel.available_months || [],
        features_hotel: hotel.features_hotel || {},
        features_room: hotel.features_room || {},
        meal_plans: hotel.meal_plans || [],
        stay_lengths: hotel.stay_lengths || [],
        atmosphere: hotel.atmosphere,
        property_type: hotel.property_type,
        style: hotel.style,
        rates: hotel.rates,
        room_types: hotel.room_types,
        pricingMatrix: hotel.pricingMatrix || hotel.pricingmatrix,
      };

      console.log('✅ Successfully converted hotel:', converted.name, converted.id);
      return converted;
    } catch (error) {
      console.error('❌ Error converting hotel data:', error, hotel);
      return null;
    }
  }

  /**
   * Search hotels by text with explicit typing to avoid TypeScript inference issues
   */
  async searchByText(searchTerm: string, limit = 10): Promise<any[]> {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const sanitizedSearchTerm = searchTerm.trim().toLowerCase();
    
    try {
      // Split search into multiple simple queries to avoid TypeScript inference issues
      const searchResults = await Promise.all([
        this.searchByName(sanitizedSearchTerm, limit),
        this.searchByCity(sanitizedSearchTerm, limit),
        this.searchByCountry(sanitizedSearchTerm, limit)
      ]);

      // Combine results and remove duplicates
      const combinedResults = new Map();
      
      searchResults.flat().forEach(hotel => {
        if (hotel && hotel.id) {
          combinedResults.set(hotel.id, hotel);
        }
      });

      // Convert back to array and limit results
      const uniqueResults = Array.from(combinedResults.values());
      return uniqueResults.slice(0, limit);

    } catch (error) {
      console.error('Error in searchByText:', error);
      return [];
    }
  }

  /**
   * Search hotels by name with explicit interface to avoid TypeScript inference issues
   */
  private async searchByName(searchTerm: string, limit: number): Promise<SearchHotelResult[]> {
    try {
      // Use the simplest possible approach with explicit casting
      return this.basicSearchByName(searchTerm, limit);
    } catch (error) {
      console.error('Exception in searchByName:', error);
      return [];
    }
  }

  /**
   * Basic search by name as fallback
   */
  private async basicSearchByName(searchTerm: string, limit: number): Promise<SearchHotelResult[]> {
    try {
      // Use a simple approach that bypasses complex TypeScript inference
      const queryParams = {
        table: 'hotels',
        select: 'id, name, city, country, price_per_month',
        nameFilter: `%${searchTerm}%`,
        isActive: true,
        limitCount: limit
      };

      // Manual query construction to avoid inference issues
      const supabaseClient: any = supabase;
      const query = supabaseClient
        .from(queryParams.table)
        .select(queryParams.select);
      
      // Apply filters step by step with explicit casting
      const filteredQuery = query
        .filter('name', 'ilike', queryParams.nameFilter)
        .eq('is_active', queryParams.isActive)
        .limit(queryParams.limitCount);

      const result = await filteredQuery;

      if (result.error) {
        console.error('Error in basic search by name:', result.error);
        return [];
      }

      return (result.data as SearchHotelResult[]) || [];
    } catch (error) {
      console.error('Exception in basicSearchByName:', error);
      return [];
    }
  }

  /**
   * Search hotels by city with explicit interface
   */
  private async searchByCity(searchTerm: string, limit: number): Promise<SearchHotelResult[]> {
    try {
      // Use the same fallback approach for city
      return this.basicSearchByCity(searchTerm, limit);
    } catch (error) {
      console.error('Exception in searchByCity:', error);
      return [];
    }
  }

  /**
   * Basic search by city as fallback
   */
  private async basicSearchByCity(searchTerm: string, limit: number): Promise<SearchHotelResult[]> {
    try {
      const queryParams = {
        table: 'hotels',
        select: 'id, name, city, country, price_per_month',
        cityFilter: `%${searchTerm}%`,
        isActive: true,
        limitCount: limit
      };

      const supabaseClient: any = supabase;
      const query = supabaseClient
        .from(queryParams.table)
        .select(queryParams.select);
      
      const filteredQuery = query
        .filter('city', 'ilike', queryParams.cityFilter)
        .eq('is_active', queryParams.isActive)
        .limit(queryParams.limitCount);

      const result = await filteredQuery;

      if (result.error) {
        console.error('Error in basic search by city:', result.error);
        return [];
      }

      return (result.data as SearchHotelResult[]) || [];
    } catch (error) {
      console.error('Exception in basicSearchByCity:', error);
      return [];
    }
  }

  /**
   * Search hotels by country with explicit interface
   */
  private async searchByCountry(searchTerm: string, limit: number): Promise<SearchHotelResult[]> {
    try {
      return this.basicSearchByCountry(searchTerm, limit);
    } catch (error) {
      console.error('Exception in searchByCountry:', error);
      return [];
    }
  }

  /**
   * Basic search by country as fallback
   */
  private async basicSearchByCountry(searchTerm: string, limit: number): Promise<SearchHotelResult[]> {
    try {
      const queryParams = {
        table: 'hotels',
        select: 'id, name, city, country, price_per_month',
        countryFilter: `%${searchTerm}%`,
        isActive: true,
        limitCount: limit
      };

      const supabaseClient: any = supabase;
      const query = supabaseClient
        .from(queryParams.table)
        .select(queryParams.select);
      
      const filteredQuery = query
        .filter('country', 'ilike', queryParams.countryFilter)
        .eq('is_active', queryParams.isActive)
        .limit(queryParams.limitCount);

      const result = await filteredQuery;

      if (result.error) {
        console.error('Error in basic search by country:', result.error);
        return [];
      }

      return (result.data as SearchHotelResult[]) || [];
    } catch (error) {
      console.error('Exception in basicSearchByCountry:', error);
      return [];
    }
  }

  /**
   * Advanced search with multiple criteria using explicit interfaces
   */
  async advancedSearch(criteria: {
    name?: string;
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }): Promise<SearchHotelResult[]> {
    const { name, city, country, minPrice, maxPrice, limit = 10 } = criteria;

    try {
      // Use explicit parameters to avoid TypeScript inference issues
      const queryParams = {
        table: 'hotels',
        select: 'id, name, city, country, price_per_month',
        isActive: true,
        limitCount: limit
      };

      const supabaseClient: any = supabase;
      let queryBuilder = supabaseClient
        .from(queryParams.table)
        .select(queryParams.select)
        .eq('is_active', queryParams.isActive);

      // Apply filters one by one with explicit casting to avoid inference issues
      if (name && name.trim() !== '') {
        queryBuilder = queryBuilder.filter('name', 'ilike', `%${name.trim()}%`);
      }

      if (city && city.trim() !== '') {
        queryBuilder = queryBuilder.filter('city', 'ilike', `%${city.trim()}%`);
      }

      if (country && country.trim() !== '') {
        queryBuilder = queryBuilder.filter('country', 'ilike', `%${country.trim()}%`);
      }

      if (minPrice !== undefined && minPrice > 0) {
        queryBuilder = queryBuilder.gte('price_per_month', minPrice);
      }

      if (maxPrice !== undefined && maxPrice > 0) {
        queryBuilder = queryBuilder.lte('price_per_month', maxPrice);
      }

      queryBuilder = queryBuilder.limit(queryParams.limitCount);

      const response = await queryBuilder;

      if (response.error) {
        console.error('Error in advanced search:', response.error);
        return [];
      }

      return (response.data as SearchHotelResult[]) || [];

    } catch (error) {
      console.error('Exception in advancedSearch:', error);
      return [];
    }
  }

  /**
   * Get popular destinations
   */
  async getPopularDestinations(limit = 10) {
    const { data, error } = await supabase
      .from('hotels_public_view')
      .select('city, country')
      .limit(limit);

    if (error) {
      console.error('Error fetching destinations:', error);
      return [];
    }

    // Group by country and count cities
    const destinations = new Map();
    data?.forEach(hotel => {
      const key = `${hotel.city}, ${hotel.country}`;
      destinations.set(key, {
        city: hotel.city,
        country: hotel.country,
        count: (destinations.get(key)?.count || 0) + 1
      });
    });

    return Array.from(destinations.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Private helper: Check if filters are active
   */
  private hasActiveFilters(filters: FilterState): boolean {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'searchTerm' && (!value || value.trim() === '')) return false;
      if (key === 'priceRange' && value === null) return false;
      if (key === 'minPrice' && (value === undefined || value === 0)) return false;
      if (key === 'maxPrice' && (value === undefined || value === null)) return false;
      if (key === 'propertyStyle' && value === 'classic') return false;
      if (key === 'mealPlans' && Array.isArray(value) && (value.length === 0 || 
          (value.length === 3 && value.includes('allInclusive') && 
           value.includes('laundryIncluded') && value.includes('externalLaundry')))) return false;
      if (key === 'stayLengths' && value === '15 days') return false;
      
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false;
      
      console.log(`🔍 Active filter found - ${key}:`, value);
      return true;
    });
  }

  /**
   * Private helper: Apply database-level filters
   */
  private applyDatabaseFilters(query: any, filters: FilterState) {
    if (filters.country && filters.country.trim() !== '') {
      let countryValue = this.mapCountryCodeToName(filters.country);
      query = query.eq('country', countryValue);
      console.log('🌍 Applied country filter to query:', countryValue);
    }
    
    if (filters.location && filters.location.trim() !== '') {
      query = query.eq('city', filters.location);
      console.log('📍 Applied location filter to query:', filters.location);
    }
    
    if (filters.propertyType && filters.propertyType.trim() !== '') {
      let dbPropertyType = this.mapPropertyType(filters.propertyType);
      query = query.eq('property_type', dbPropertyType);
      console.log('🏨 Applied property type filter to query:', filters.propertyType, '->', dbPropertyType);
    }
    
    if (filters.propertyStyle && filters.propertyStyle.trim() !== '') {
      query = query.eq('style', filters.propertyStyle);
      console.log('🎨 Applied property style filter to query:', filters.propertyStyle);
    }
    
    if (filters.atmosphere && filters.atmosphere.trim() !== '') {
      query = query.eq('atmosphere', filters.atmosphere);
      console.log('🌟 Applied atmosphere filter to query:', filters.atmosphere);
    }
    
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      query = query.gte('price_per_month', filters.minPrice);
      console.log('💰 Applied min price filter to query:', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice < 999999) {
      query = query.lte('price_per_month', filters.maxPrice);
      console.log('💰 Applied max price filter to query:', filters.maxPrice);
    }

    return query;
  }

  /**
   * Private helper: Apply client-side filters
   */
  private applyClientSideFilters(hotels: any[], filters: FilterState) {
    console.log('🔧 Applying client-side filters to', hotels.length, 'hotels');
    
    const filteredHotels = hotels.filter(hotel => {
      // Month filter
      if (filters.month && filters.month.trim() !== '') {
        const availableMonths = hotel.available_months || [];
        if (!availableMonths.includes(filters.month)) {
          console.log(`🗓️ Hotel ${hotel.name} filtered out by month: ${filters.month} not in [${availableMonths.join(', ')}]`);
          return false;
        }
      }

      // Stay Length filter
      if (filters.stayLengths && filters.stayLengths.trim() !== '') {
        const stayLengthNumber = parseInt(filters.stayLengths);
        const hotelStayLengths = hotel.stay_lengths || [];
        if (!hotelStayLengths.includes(stayLengthNumber)) {
          console.log(`📅 Hotel ${hotel.name} filtered out by stay length: ${stayLengthNumber} not in [${hotelStayLengths.join(', ')}]`);
          return false;
        }
      }

      // Theme filter
      if (filters.theme && filters.theme.length > 0) {
        const hotelThemes = hotel.hotel_themes || [];
        const hasMatchingTheme = filters.theme.some(selectedTheme =>
          hotelThemes.some((ht: any) => ht.themes?.name === selectedTheme.name)
        );
        if (!hasMatchingTheme) {
          console.log(`🎯 Hotel ${hotel.name} filtered out by themes: no matches found for ${filters.theme.map(t => t.name).join(', ')}`);
          return false;
        }
      }

      // Activities filter
      if (filters.activities && filters.activities.length > 0) {
        const hotelActivities = hotel.hotel_activities || [];
        const hotelActivityNames = hotelActivities.map((ha: any) => ha.activities?.name).filter(Boolean);
        
        const hasAllActivities = filters.activities.every(filterActivity => 
          hotelActivityNames.includes(filterActivity)
        );
        
        if (!hasAllActivities) {
          console.log(`🏃 Hotel ${hotel.name} filtered out by activities: missing some of [${filters.activities.join(', ')}]`);
          return false;
        }
      }

      // Hotel Features filter
      if (filters.hotelFeatures && filters.hotelFeatures.length > 0) {
        const hotelFeatures = hotel.features_hotel || {};
        
        const hasAllFeatures = filters.hotelFeatures.every(feature => {
          const featureValue = hotelFeatures[feature];
          return featureValue === true || featureValue === 'true' || featureValue === 1;
        });
        
        if (!hasAllFeatures) {
          console.log(`🏨 Hotel ${hotel.name} filtered out by hotel features: missing some of [${filters.hotelFeatures.join(', ')}]`);
          return false;
        }
      }

      // Room Features filter
      if (filters.roomFeatures && filters.roomFeatures.length > 0) {
        const roomFeatures = hotel.features_room || {};
        
        const hasAllFeatures = filters.roomFeatures.every(feature => {
          const featureValue = roomFeatures[feature];
          return featureValue === true || featureValue === 'true' || featureValue === 1;
        });
        
        if (!hasAllFeatures) {
          console.log(`🛏️ Hotel ${hotel.name} filtered out by room features: missing some of [${filters.roomFeatures.join(', ')}]`);
          return false;
        }
      }

      // Meal Plans filter
      if (filters.mealPlans && filters.mealPlans.length > 0) {
        const hotelMealPlans = hotel.meal_plans || [];
        
        const hasAllMealPlans = filters.mealPlans.every(mealPlan => 
          hotelMealPlans.includes(mealPlan)
        );
        
        if (!hasAllMealPlans) {
          console.log(`🍽️ Hotel ${hotel.name} filtered out by meal plans: missing some of [${filters.mealPlans.join(', ')}]`);
          return false;
        }
      }

      // Search Term filter
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        const nameMatch = hotel.name?.toLowerCase().includes(searchLower);
        const cityMatch = hotel.city?.toLowerCase().includes(searchLower);
        const countryMatch = hotel.country?.toLowerCase().includes(searchLower);
        
        if (!nameMatch && !cityMatch && !countryMatch) {
          console.log(`🔍 Hotel ${hotel.name} filtered out by search term: "${filters.searchTerm}"`);
          return false;
        }
      }

      return true;
    });

    console.log(`✅ Client-side filtered from ${hotels.length} to ${filteredHotels.length} hotels`);
    return filteredHotels;
  }

  /**
   * Private helper: Map country codes to names
   */
  private mapCountryCodeToName(countryValue: string): string {
    const countryCodeToName: { [key: string]: string } = {
      'DE': 'Germany', 'AR': 'Argentina', 'AU': 'Australia', 'AT': 'Austria', 'BE': 'Belgium',
      'BR': 'Brazil', 'BG': 'Bulgaria', 'CA': 'Canada', 'CO': 'Colombia', 'KR': 'South Korea',
      'CR': 'Costa Rica', 'HR': 'Croatia', 'DK': 'Denmark', 'EC': 'Ecuador', 'EG': 'Egypt',
      'AE': 'United Arab Emirates', 'SK': 'Slovakia', 'ES': 'Spain', 'US': 'United States',
      'EE': 'Estonia', 'PH': 'Philippines', 'FI': 'Finland', 'FR': 'France', 'GE': 'Georgia',
      'GR': 'Greece', 'HU': 'Hungary', 'ID': 'Indonesia', 'IE': 'Ireland', 'IS': 'Iceland',
      'IT': 'Italy', 'JP': 'Japan', 'KZ': 'Kazakhstan', 'LV': 'Latvia', 'LT': 'Lithuania',
      'LU': 'Luxembourg', 'MY': 'Malaysia', 'MT': 'Malta', 'MA': 'Morocco', 'MX': 'Mexico',
      'NO': 'Norway', 'NZ': 'New Zealand', 'PA': 'Panama', 'PY': 'Paraguay', 'NL': 'Netherlands',
      'PE': 'Peru', 'PL': 'Poland', 'PT': 'Portugal', 'GB': 'United Kingdom', 'CZ': 'Czech Republic',
      'DO': 'Dominican Republic', 'RO': 'Romania', 'SG': 'Singapore', 'LK': 'Sri Lanka',
      'SE': 'Sweden', 'CH': 'Switzerland', 'TW': 'Taiwan', 'TH': 'Thailand', 'TR': 'Turkey',
      'UY': 'Uruguay', 'VN': 'Vietnam'
    };
    
    return countryCodeToName[countryValue] || countryValue;
  }

  /**
   * Private helper: Map property type values
   */
  private mapPropertyType(propertyType: string): string {
    const propertyTypeMap: { [key: string]: string } = {
      'hotel': 'Hotel',
      'boutiqueHotel': 'Boutique Hotel',
      'resort': 'Resort',
      'roadsideMotel': 'Roadside Motel',
      'ruralHouse': 'Rural House'
    };
    
    return propertyTypeMap[propertyType.toLowerCase()] || propertyType;
  }
}

export const hotelSearchService = new HotelSearchService();