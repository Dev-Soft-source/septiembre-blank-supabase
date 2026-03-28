
import { useHotelTranslations } from './useHotelTranslations';
import { supabase } from '@/integrations/supabase/client';

interface HotelContent {
  name: string;
  description?: string;
  ideal_guests?: string;
  atmosphere?: string;
  perfect_location?: string;
}

export const useAutoTranslation = () => {
  const { translateHotelContent } = useHotelTranslations();

  const detectLanguage = async (content: HotelContent): Promise<'en' | 'es' | 'pt' | 'ro'> => {
    try {
      // Use OpenAI to detect the language of the content
      const { data, error } = await supabase.functions.invoke('detect-language', {
        body: { content }
      });

      if (error) {
        console.warn('Language detection failed, defaulting to English:', error);
        return 'en';
      }

      const detectedLanguage = data?.language || 'en';
      console.log('Detected language:', detectedLanguage);
      
      // Validate detected language is one of our supported languages
      if (['en', 'es', 'pt', 'ro'].includes(detectedLanguage)) {
        return detectedLanguage as 'en' | 'es' | 'pt' | 'ro';
      }
      
      return 'en'; // Default fallback
    } catch (error) {
      console.warn('Language detection error, defaulting to English:', error);
      return 'en';
    }
  };

  const triggerAutoTranslations = async (hotelId: string, content: HotelContent) => {
    try {
      // Detect the source language of the content
      const sourceLanguage = await detectLanguage(content);
      console.log(`Source language detected for hotel ${hotelId}: ${sourceLanguage}`);

      // Define all supported languages
      const allLanguages: ('en' | 'es' | 'pt' | 'ro')[] = ['en', 'es', 'pt', 'ro'];
      
      // Get target languages (all languages except the source language)
      const targetLanguages = allLanguages.filter(lang => lang !== sourceLanguage);
      
      console.log(`Translating hotel ${hotelId} from ${sourceLanguage} to:`, targetLanguages);

      // Trigger translations asynchronously for all target languages
      targetLanguages.forEach(async (language) => {
        try {
          await translateHotelContent({
            hotelId,
            targetLanguage: language,
            sourceLanguage,
            content
          });
          console.log(`Translation triggered for hotel ${hotelId} from ${sourceLanguage} to ${language}`);
        } catch (error) {
          console.warn(`Translation failed for hotel ${hotelId} from ${sourceLanguage} to ${language}:`, error);
          // Fail silently to not block the main workflow
        }
      });
    } catch (error) {
      console.error('Auto-translation process failed:', error);
      // Fallback to original behavior if detection fails
      const targetLanguages: ('es' | 'pt' | 'ro')[] = ['es', 'pt', 'ro'];
      
      targetLanguages.forEach(async (language) => {
        try {
          await translateHotelContent({
            hotelId,
            targetLanguage: language,
            content
          });
          console.log(`Fallback translation triggered for hotel ${hotelId} in ${language}`);
        } catch (error) {
          console.warn(`Fallback translation failed for hotel ${hotelId} in ${language}:`, error);
        }
      });
    }
  };

  return { triggerAutoTranslations };
};
