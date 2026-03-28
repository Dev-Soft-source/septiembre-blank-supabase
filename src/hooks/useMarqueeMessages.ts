import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMarqueeLanguage, shuffleArray } from '@/utils/pageUtils';

interface MarqueeMessagesData {
  [key: string]: string[];
}

export const useMarqueeMessages = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const language = getMarqueeLanguage(i18n.language);
        
        // Map language codes to file names
        const fileMap: Record<string, string> = {
          'en': 'hotel_living_messages_en.json',
          'es': 'hotel_living_messages_es.json', 
          'pt': 'hotel_living_messages_pt.json',
          'ro': 'hotel_living_messages_ro.json'
        };
        
        const fileName = fileMap[language] || fileMap['en'];
        const fetchUrl = `/locales/marquee/${fileName}`;
        
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to load messages: ${response.status}`);
        }
        
        const messagesData = await response.json() as string[];
        
        if (messagesData.length > 0) {
          // Keep messages in natural order (no shuffling)
          setMessages(messagesData);
          setCurrentIndex(0);
        } else {
          console.warn('No messages found in data');
          setMessages(['Welcome to Hotel Living - Live the Life You Love']);
        }
      } catch (error) {
        console.error('Error loading marquee messages:', error);
        // Fallback to default messages if loading fails
        setMessages(['Welcome to Hotel Living - Live the Life You Love']);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [i18n.language]);

  const getNextMessage = (): string => {
    if (messages.length === 0) return '';
    
    const message = messages[currentIndex];
    setCurrentIndex((prev) => (prev + 1) % messages.length);
    
    return message;
  };

  const reshuffleMessages = () => {
    if (messages.length > 0) {
      const shuffled = shuffleArray(messages);
      setMessages(shuffled);
      setCurrentIndex(0);
    }
  };

  return {
    messages,
    getNextMessage,
    reshuffleMessages,
    isLoading,
    hasMessages: messages.length > 0
  };
};