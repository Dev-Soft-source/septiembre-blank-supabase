
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TranslationRequest {
  hotelId: string;
  targetLanguage: 'en' | 'es' | 'pt' | 'ro';
  sourceLanguage?: 'en' | 'es' | 'pt' | 'ro';
  content: {
    name: string;
    description?: string;
    ideal_guests?: string;
    atmosphere?: string;
    perfect_location?: string;
  };
}

interface HotelTranslation {
  id: string;
  hotel_id: string;
  language_code: string;
  name?: string;
  description?: string;
  created_at: string;
}

export const useHotelTranslations = () => {
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<HotelTranslation[]>([]);
  const { toast } = useToast();

  const translateHotelContent = async (request: TranslationRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-hotel-content', {
        body: request
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Translation Completed",
          description: `Hotel content successfully translated to ${request.targetLanguage.toUpperCase()}`,
        });
        
        // Refresh translations
        await fetchHotelTranslations(request.hotelId);
        
        return data.translation;
      } else {
        throw new Error(data.error || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Failed",
        description: error.message || "There was an error translating the content",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelTranslations = async (hotelId: string) => {
    try {
      const { data, error } = await supabase
        .from('hotel_translations')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('language_code');

      if (error) {
        throw error;
      }

      setTranslations(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch translations",
        variant: "destructive",
      });
    }
  };

  const getTranslation = (hotelId: string, languageCode: string) => {
    return translations.find(
      t => t.hotel_id === hotelId && t.language_code === languageCode
    );
  };

  const hasTranslation = (hotelId: string, languageCode: string) => {
    const translation = getTranslation(hotelId, languageCode);
    return !!translation;
  };

  return {
    loading,
    translations,
    translateHotelContent,
    fetchHotelTranslations,
    getTranslation,
    hasTranslation,
  };
};
