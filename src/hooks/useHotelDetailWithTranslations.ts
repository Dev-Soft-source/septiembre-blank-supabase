
import { useState, useEffect } from 'react';
import { useHotelDetailWithBackendAdapter } from '@/hooks/useHotelDetailBackendAdapter';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';

interface HotelTranslation {
  name?: string;
  description?: string;
  language_code: string;
  hotel_id: string;
}

export const useHotelDetailWithTranslations = (hotelId?: string) => {
  const { data: hotel, isLoading, error } = useHotelDetailWithBackendAdapter(hotelId);
  const { language } = useTranslation();
  const [translation, setTranslation] = useState<HotelTranslation | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);

  useEffect(() => {
    console.log('useHotelDetailWithTranslations - Current language:', language);
    console.log('useHotelDetailWithTranslations - Hotel ID:', hotelId);
    
    if (!hotel?.id) {
      console.log('useHotelDetailWithTranslations - Clearing translation (no hotel)');
      setTranslation(null);
      return;
    }

    // Always try to fetch translation, even for English
    // The database may contain Spanish content that needs English translations

    const fetchTranslation = async () => {
      console.log('useHotelDetailWithTranslations - Fetching translation for:', hotel.id, 'language:', language);
      setTranslationLoading(true);
      try {
        const { data, error } = await supabase
          .from('hotel_translations')
          .select('*')
          .eq('hotel_id', hotel.id)
          .eq('language_code', language)
          .maybeSingle();

        if (error) {
          console.error('Error fetching translation:', error);
          setTranslation(null);
        } else {
          console.log('useHotelDetailWithTranslations - Translation found:', data);
          setTranslation(data);
        }
      } catch (error) {
        console.error('Translation fetch error:', error);
        setTranslation(null);
      } finally {
        setTranslationLoading(false);
      }
    };

    fetchTranslation();
  }, [hotel?.id, language]);

  // Return hotel data with translations applied, graceful fallback to original content
  const translatedHotel = hotel && translation ? {
    ...hotel,
    name: translation.name || hotel.name,
    description: translation.description || hotel.description,
  } : hotel;

  console.log('useHotelDetailWithTranslations - Final hotel data:', {
    originalName: hotel?.name,
    translatedName: translatedHotel?.name,
    hasTranslation: !!translation,
    language
  });

  return {
    data: translatedHotel,
    isLoading: isLoading || translationLoading,
    error,
    hasTranslation: !!translation,
  };
};
