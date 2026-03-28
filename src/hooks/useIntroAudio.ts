import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getIntroAudioPath, getAvailableAudioPaths, type AvatarId } from '@/constants/avatarVoices';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface UseIntroAudioProps {
  avatarId: AvatarId;
  onIntroComplete?: () => void;
}

export const useIntroAudio = ({ avatarId, onIntroComplete }: UseIntroAudioProps) => {
  const { i18n } = useTranslation();
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  const playIntroAudio = useCallback(async () => {
    if (hasPlayedIntro) {
      onIntroComplete?.();
      return;
    }

    try {
      setIsPlayingIntro(true);

      // Get language code (without country suffix)
      const languageCode = (i18n.language || 'es').split('-')[0];

      // Try primary language first, then fallback to available languages
      const tryLanguages = [languageCode, 'es', 'en', 'pt', 'ro'];
      let audioData = null;
      let successfulPath = '';

      for (const tryLang of tryLanguages) {
        const audioPath = getIntroAudioPath(avatarId, tryLang);
        console.log(`Trying intro audio for ${avatarId} in ${tryLang}: ${audioPath}`);

        const { data, error } = await supabase.storage
          .from('avatars-intros')
          .download(audioPath);

        if (!error && data) {
          audioData = data;
          successfulPath = audioPath;
          console.log(`✅ Successfully loaded intro audio: ${successfulPath}`);
          break;
        } else {
          console.warn(`❌ Failed to load ${audioPath}: ${error?.message}`);
        }
      }

      if (!audioData) {
        console.warn(`No intro audio found for ${avatarId} in any language`);
        setHasPlayedIntro(true);
        onIntroComplete?.();
        return;
      }

      // Play audio
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();

      audio.src = audioUrl;
      audio.preload = 'auto';

      audio.oncanplaythrough = () => {
        audio.play().catch(err => {
          console.warn('Failed to play intro audio:', err);
          setHasPlayedIntro(true);
          onIntroComplete?.();
        });
      };

      audio.onended = () => {
        setIsPlayingIntro(false);
        setHasPlayedIntro(true);
        URL.revokeObjectURL(audioUrl);
        onIntroComplete?.();
      };

      audio.onerror = () => {
        console.warn('Error playing intro audio');
        setIsPlayingIntro(false);
        setHasPlayedIntro(true);
        URL.revokeObjectURL(audioUrl);
        onIntroComplete?.();
      };

    } catch (error) {
      console.warn('Failed to load intro audio:', error);
      setIsPlayingIntro(false);
      setHasPlayedIntro(true);
      onIntroComplete?.();
    }
  }, [avatarId, i18n.language, hasPlayedIntro, onIntroComplete]);

  const resetIntro = useCallback(() => {
    setHasPlayedIntro(false);
    setIsPlayingIntro(false);
  }, []);

  return {
    isPlayingIntro,
    hasPlayedIntro,
    playIntroAudio,
    resetIntro
  };
};
