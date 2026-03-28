import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BatchTranslationResult {
  success: boolean;
  processed: number;
  errors: number;
  total: number;
  hasMore: boolean;
  message: string;
}

export const useBatchTranslation = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<BatchTranslationResult | null>(null);
  const { toast } = useToast();

  const startBatchTranslation = async () => {
    setLoading(true);
    setProgress(null);

    try {
      const { data, error } = await supabase.functions.invoke('batch-translate-hotels', {
        body: {
          languages: ['es', 'pt', 'ro']
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setProgress(data);
        toast({
          title: "Complete Batch Translation Finished",
          description: `Processed all ${data.processed} hotels with ${data.errors} errors`,
        });
      } else {
        throw new Error(data.error || 'Batch translation failed');
      }

      return data;
    } catch (error) {
      console.error('Batch translation error:', error);
      toast({
        title: "Batch Translation Failed",
        description: error.message || "There was an error processing the batch translation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTranslationStats = async () => {
    try {
      // Get total hotels
      const { count: totalHotels } = await supabase
        .from('hotels')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get completed translations
      const { data: translations } = await supabase
        .from('hotel_translations')
        .select('hotel_id, language_code')
        .eq('translation_status', 'completed');

      const translatedHotels = new Set();
      translations?.forEach(t => translatedHotels.add(t.hotel_id));

      return {
        totalHotels: totalHotels || 0,
        translatedHotels: translatedHotels.size,
        pendingTranslations: (totalHotels || 0) - translatedHotels.size
      };
    } catch (error) {
      console.error('Error getting translation stats:', error);
      return { totalHotels: 0, translatedHotels: 0, pendingTranslations: 0 };
    }
  };

  return {
    loading,
    progress,
    startBatchTranslation,
    getTranslationStats
  };
};
