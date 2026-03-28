import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type AvatarId } from '@/constants/avatarVoices';

interface UseAvatarKnowledgeReturn {
  isLoading: boolean;
  error: string | null;
  getKnowledge: (query: string, avatarId: AvatarId, language?: string) => Promise<string>;
}

export const useAvatarKnowledge = (): UseAvatarKnowledgeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getKnowledge = useCallback(async (
    query: string, 
    avatarId: AvatarId, 
    language: string = 'es'
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Retrieving knowledge for avatar: ${avatarId}, language: ${language}, query: ${query}`);
      
      const { data, error: apiError } = await supabase.functions.invoke('avatar-knowledge-embeddings', {
        body: {
          query,
          avatarId,
          language
        }
      });

      if (apiError) {
        console.error('Knowledge retrieval error:', apiError);
        setError('Failed to retrieve knowledge');
        return getFallbackResponse(language);
      }

      if (!data?.knowledge) {
        console.warn('No knowledge returned from API');
        return getFallbackResponse(language);
      }

      return data.knowledge;

    } catch (err) {
      console.error('Error in knowledge retrieval:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return getFallbackResponse(language);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getKnowledge
  };
};

function getFallbackResponse(language: string): string {
  const responses = {
    es: "Me temo que en eso no te puedo ayudar. Quizás encuentres esa información en tu panel de usuario.",
    en: "I'm afraid I can't help you with that. You might find that information in your user panel.",
    pt: "Receio que não posso ajudá-lo com isso. Você pode encontrar essa informação no seu painel de usuário.",
    ro: "Mă tem că nu vă pot ajuta cu asta. Ați putea găsi acele informații în panoul dvs. de utilizator."
  };
  
  return responses[language as keyof typeof responses] || responses.es;
}