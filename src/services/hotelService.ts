
import { supabase } from '@/integrations/supabase/client';
import { FilterState } from '@/components/filters/FilterTypes';

export const convertHotelToUIFormat = (hotel: any) => {
  console.log('🔄 Converting hotel to UI format:', hotel?.name, hotel?.id);
  
  if (!hotel || typeof hotel !== 'object') {
    console.warn('❌ Invalid hotel data received:', hotel);
    return null;
  }

  try {
    // Ensure we have proper fallback image
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
      // For simplified queries, these may be empty
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
};

export const fetchHotelsWithFilters = async (filters: FilterState) => {
  try {
    console.log('🔍 fetchHotelsWithFilters: Starting with filters:', JSON.stringify(filters, null, 2));
    
    // Check if any filters are actually applied (excluding default values)
    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
      if (key === 'searchTerm' && (!value || value.trim() === '')) return false;
      if (key === 'priceRange' && value === null) return false;
      if (key === 'minPrice' && (value === undefined || value === 0)) return false;
      if (key === 'maxPrice' && (value === undefined || value === null)) return false;
      
      // IGNORE DEFAULT FILTER VALUES that shouldn't trigger filtering
      if (key === 'propertyStyle' && value === 'classic') return false; // This is a default value
      if (key === 'mealPlans' && Array.isArray(value) && (value.length === 0 || (value.length === 3 && value.includes('allInclusive') && value.includes('laundryIncluded') && value.includes('externalLaundry')))) return false; // Check if this is just default
      if (key === 'stayLengths' && value === '15 days') return false; // This seems to be default
      
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false;
      console.log(`🔍 Active filter found - ${key}:`, value);
      return true;
    });
    
    console.log('🔍 Has active filters:', hasActiveFilters);
    
    // Build a comprehensive query with all related data using secure public view
    let query = supabase
      .from('hotels_with_filters_view')
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
      if (filters.country && filters.country.trim() !== '') {
        // Map country code to country name if needed
        let countryValue = filters.country;
        
        // Country code to name mapping
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
        
        // Convert country code to name if it's a code
        if (countryCodeToName[countryValue]) {
          countryValue = countryCodeToName[countryValue];
          console.log('🔄 Converted country code to name:', filters.country, '->', countryValue);
        }
        
        query = query.eq('country', countryValue);
        console.log('🌍 Applied country filter to query:', countryValue);
      }
      
      if (filters.location && filters.location.trim() !== '') {
        query = query.eq('city', filters.location);
        console.log('📍 Applied location filter to query:', filters.location);
      }
      
      if (filters.propertyType && filters.propertyType.trim() !== '') {
        // FIX: Handle property type mapping for database values
        let dbPropertyType = filters.propertyType;
        
        // Map frontend values to database values
        const propertyTypeMap: { [key: string]: string } = {
          'hotel': 'Hotel',
          'boutiqueHotel': 'Boutique Hotel',
          'resort': 'Resort',
          'roadsideMotel': 'Roadside Motel',
          'ruralHouse': 'Rural House'
        };
        
        if (propertyTypeMap[filters.propertyType.toLowerCase()]) {
          dbPropertyType = propertyTypeMap[filters.propertyType.toLowerCase()];
        }
        
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
      
      // Apply price range filters at database level
      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        query = query.gte('price_per_month', filters.minPrice);
        console.log('💰 Applied min price filter to query:', filters.minPrice);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice < 999999) {
        query = query.lte('price_per_month', filters.maxPrice);
        console.log('💰 Applied max price filter to query:', filters.maxPrice);
      }
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
      return applyClientSideFilters(hotels, filters);
    }
    
    console.log('🔄 No client-side filtering needed, returning all hotels');
    return hotels;
  } catch (error) {
    console.error('❌ Error fetching hotels:', error);
    throw error;
  }
};

// Client-side filtering for complex filters that can't be done at database level
const applyClientSideFilters = (hotels: any[], filters: FilterState) => {
  console.log('🔧 Applying client-side filters to', hotels.length, 'hotels');
  
  const filteredHotels = hotels.filter(hotel => {
    // Month filter - check if hotel is available in selected month
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

    // Theme/Affinity filter - check nested hotel_themes data (Multiple theme support)
    if (filters.theme && filters.theme.length > 0) {
      const hotelThemes = hotel.hotel_themes || [];
      const hasMatchingTheme = filters.theme.some(selectedTheme =>
        hotelThemes.some((ht: any) => 
          ht.themes?.name === selectedTheme.name
        )
      );
      if (!hasMatchingTheme) {
        console.log(`🎯 Hotel ${hotel.name} filtered out by themes: no matches found for ${filters.theme.map(t => t.name).join(', ')}`);
        return false;
      }
    }

    // Activities filter - check nested hotel_activities data
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

    // Search Term filter - search in name, city, country
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
};

