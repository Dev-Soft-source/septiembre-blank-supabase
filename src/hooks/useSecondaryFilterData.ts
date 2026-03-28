
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecondaryFilterData {
  countries: Array<{ code: string; name: string; flag: string }>;
  cities: string[];
  themes: Array<{ id: string; name: string; level: number; parent_id?: string }>;
  activities: Array<{ id: string; name: string; level: number; parent_id?: string }>;
  hotelFeatures: string[];
  roomFeatures: string[];
  propertyStyles: string[];
  loading: boolean;
  error: string | null;
}

// Official base countries that must always appear
const OFFICIAL_BASE_COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'Argentina', 'Brazil', 'Colombia',
  'Spain', 'Portugal', 'Romania', 'Italy', 'France', 'Germany', 'Greece',
  'Australia', 'New Zealand', 'South Africa', 'Morocco', 'Egypt',
  'Thailand', 'Indonesia', 'Vietnam', 'Philippines'
];

// Official property styles (limited list)
const OFFICIAL_PROPERTY_STYLES = [
  'Clásico', 'Clásico Elegante', 'Moderno', 'Fusión', 'Urbano', 'Minimalista', 'Lujo', 'Rural'
];

export const useSecondaryFilterData = (): SecondaryFilterData => {
  const [countries, setCountries] = useState<Array<{ code: string; name: string; flag: string }>>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [themes, setThemes] = useState<Array<{ id: string; name: string; level: number; parent_id?: string }>>([]);
  const [activities, setActivities] = useState<Array<{ id: string; name: string; level: number; parent_id?: string }>>([]);
  const [hotelFeatures, setHotelFeatures] = useState<string[]>([]);
  const [roomFeatures, setRoomFeatures] = useState<string[]>([]);
  const [propertyStyles, setPropertyStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecondaryFilterData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch countries and cities from hotels
        const { data: hotelData, error: hotelError } = await supabase
          .from('hotels')
          .select('country, city, features_hotel, features_room')
          .eq('status', 'approved');

        if (hotelError) throw hotelError;

        // Process countries
        if (hotelData) {
          const dbCountries = [...new Set(hotelData.map(hotel => hotel.country))];
          const allCountryNames = [...new Set([...OFFICIAL_BASE_COUNTRIES, ...dbCountries])];
          
          const countryMap: Record<string, { name: string; flag: string; code: string }> = {
            'United States': { name: 'United States', flag: '🇺🇸', code: 'US' },
            'Canada': { name: 'Canada', flag: '🇨🇦', code: 'CA' },
            'Mexico': { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
            'Argentina': { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
            'Brazil': { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
            'Colombia': { name: 'Colombia', flag: '🇨🇴', code: 'CO' },
            'Spain': { name: 'Spain', flag: '🇪🇸', code: 'ES' },
            'Portugal': { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
            'Romania': { name: 'Romania', flag: '🇷🇴', code: 'RO' },
            'Italy': { name: 'Italy', flag: '🇮🇹', code: 'IT' },
            'France': { name: 'France', flag: '🇫🇷', code: 'FR' },
            'Germany': { name: 'Germany', flag: '🇩🇪', code: 'DE' },
            'Greece': { name: 'Greece', flag: '🇬🇷', code: 'GR' },
            'Australia': { name: 'Australia', flag: '🇦🇺', code: 'AU' },
            'New Zealand': { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
            'South Africa': { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
            'Morocco': { name: 'Morocco', flag: '🇲🇦', code: 'MA' },
            'Egypt': { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
            'Thailand': { name: 'Thailand', flag: '🇹🇭', code: 'TH' },
            'Indonesia': { name: 'Indonesia', flag: '🇮🇩', code: 'ID' },
            'Vietnam': { name: 'Vietnam', flag: '🇻🇳', code: 'VN' },
            'Philippines': { name: 'Philippines', flag: '🇵🇭', code: 'PH' },
            'USA': { name: 'United States', flag: '🇺🇸', code: 'US' },
            'Turkey': { name: 'Turkey', flag: '🇹🇷', code: 'TR' },
            'United Kingdom': { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' }
          };

          const countryList = allCountryNames.map(countryName => {
            const countryInfo = countryMap[countryName as string];
            if (countryInfo) {
              return {
                code: countryInfo.code,
                name: countryInfo.name,
                flag: countryInfo.flag
              };
            }
            return {
              code: (countryName as string).toUpperCase().substring(0, 2),
              name: countryName as string,
              flag: '🏳️'
            };
          }).sort((a, b) => a.name.localeCompare(b.name));

          // Process cities
          const uniqueCities = [...new Set(hotelData.map(hotel => hotel.city))]
            .filter((city): city is string => typeof city === 'string' && city.trim() !== '')
            .sort();

          // Process hotel features
          const allHotelFeatures = new Set<string>();
          hotelData.forEach(hotel => {
            if (hotel.features_hotel) {
              Object.keys(hotel.features_hotel).forEach(feature => {
                if (hotel.features_hotel[feature]) {
                  allHotelFeatures.add(feature);
                }
              });
            }
          });

          // Process room features
          const allRoomFeatures = new Set<string>();
          hotelData.forEach(hotel => {
            if (hotel.features_room) {
              Object.keys(hotel.features_room).forEach(feature => {
                if (hotel.features_room[feature]) {
                  allRoomFeatures.add(feature);
                }
              });
            }
          });

          // Property styles removed from database
          setPropertyStyles(OFFICIAL_PROPERTY_STYLES);
        }

        // Fetch themes
        const { data: themesData, error: themesError } = await supabase
          .from('themes')
          .select('id, name, level, parent_id')
          .order('level, name');

        if (themesError) throw themesError;
        if (themesData) setThemes(themesData);

        // Fetch activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('id, name, level, parent_id')
          .order('level, name');

        if (activitiesError) throw activitiesError;
        if (activitiesData) setActivities(activitiesData);

      } catch (err) {
        console.error('Error fetching secondary filter data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSecondaryFilterData();
  }, []);

  return { 
    countries, 
    cities, 
    themes, 
    activities, 
    hotelFeatures, 
    roomFeatures, 
    propertyStyles, 
    loading, 
    error 
  };
};
