import { useState, useCallback } from 'react';
import { type AvatarId } from '@/constants/avatarVoices';
import { buildPersonaSystemPrompt as buildPersonaSystemPromptEs } from '@/data/personas.es';
import { buildPersonaSystemPrompt as buildPersonaSystemPromptEn } from '@/data/personas.en';
import { buildPersonaSystemPrompt as buildPersonaSystemPromptPt } from '@/data/personas.pt';
import { buildPersonaSystemPrompt as buildPersonaSystemPromptRo } from '@/data/personas.ro';
import { fetchContextForAvatar } from '@/utils/contextFetcher';
import { CHAT_CONFIG } from '@/constants/generation';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const useAvatarChat = (avatarId: AvatarId) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const generateResponse = useCallback(async (userMessage: string, locale: 'es' | 'en' | 'pt' | 'ro' = 'es') => {
    const totalStartTime = performance.now();
    setIsGenerating(true);
    
    try {
      console.log(`[PERFORMANCE] Starting response generation for ${avatarId} in ${locale}`);
      
      // 1. Build persona system prompt with language-specific builder
      const personaPromptStart = performance.now();
      let personaPrompt: string;
      
      switch (locale) {
        case 'en':
          personaPrompt = buildPersonaSystemPromptEn(avatarId);
          break;
        case 'pt':
          personaPrompt = buildPersonaSystemPromptPt(avatarId);
          break;
        case 'ro':
          personaPrompt = buildPersonaSystemPromptRo(avatarId);
          break;
        default:
          personaPrompt = buildPersonaSystemPromptEs(avatarId);
      }
      
      const personaPromptTime = performance.now() - personaPromptStart;
      console.log(`[PERFORMANCE] Persona prompt built in ${personaPromptTime.toFixed(2)}ms`);
      
      // 2. Fetch dynamic context from database (with performance tracking)
      const contextStartTime = performance.now();
      const contextAddition = await fetchContextForAvatar(avatarId, locale);
      const contextTime = performance.now() - contextStartTime;
      console.log(`[PERFORMANCE] Context fetched in ${contextTime.toFixed(2)}ms`);
      
      // 3. Combine system prompt with context
      const fullSystemPrompt = personaPrompt + contextAddition;
      
      // 4. Build conversation history
      const conversationMessages: ChatMessage[] = [
        { role: 'system', content: fullSystemPrompt },
        ...messages,
        { role: 'user', content: userMessage }
      ];
      
      // 5. Call google-cloud-voice-chat for text-only chat completion (with performance tracking)
      const voiceChatStartTime = performance.now();
      const { data, error } = await supabase.functions.invoke('google-cloud-voice-chat', {
        body: {
          text: userMessage,
          language: locale,
          avatarId: avatarId,
          messages: conversationMessages.slice(1) // Remove system prompt as it's handled internally
        }
      });
      
      const voiceChatTime = performance.now() - voiceChatStartTime;
      console.log(`[PERFORMANCE] Voice chat processing in ${voiceChatTime.toFixed(2)}ms`);
      
      if (error) {
        throw new Error(`Voice chat failed: ${error.message}`);
      }
      
      const assistantResponse = data.response;
      
      // 6. Update conversation history
      const newMessages: ChatMessage[] = [
        ...messages,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantResponse }
      ];
      
      setMessages(newMessages);
      
      const totalTime = performance.now() - totalStartTime;
      console.log(`[PERFORMANCE] TOTAL response generation time: ${totalTime.toFixed(2)}ms`);
      console.log(`[PERFORMANCE] Breakdown - Persona: ${personaPromptTime.toFixed(2)}ms, Context: ${contextTime.toFixed(2)}ms, Voice Chat: ${voiceChatTime.toFixed(2)}ms`);
      
      return assistantResponse;
      
    } catch (error) {
      console.error('Error generating avatar response:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [avatarId, messages]);

  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isGenerating,
    generateResponse,
    clearConversation
  };
};