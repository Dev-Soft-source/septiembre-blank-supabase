
import { useState, useEffect } from "react";
import { X, Mic, MicOff } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAvatarManager } from "@/contexts/AvatarManager";
import { useTranslation } from "@/hooks/useTranslation";
import { useVoiceAvatar } from "@/hooks/useVoiceAvatar";
import { useGlobalAvatarDelay } from "@/hooks/useGlobalAvatarDelay";
import { type AvatarId } from "@/constants/avatarVoices";

interface EnhancedAvatarAssistantProps {
  avatarId: AvatarId;
  gif: string;
  position?: 'bottom-left' | 'bottom-right' | 'content';
  showMessage?: boolean;
  message?: string;
  onClose?: () => void;
  size?: 'default' | 'small' | 'help-page';
}

export function EnhancedAvatarAssistant({ 
  avatarId, 
  gif, 
  position = 'content',
  showMessage = false,
  message,
  onClose,
  size = 'default'
}: EnhancedAvatarAssistantProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { i18n } = useTranslation();
  const { addActiveAvatar, removeActiveAvatar } = useAvatarManager();
  const location = useLocation();
  
  // Global avatar delay - 45 seconds before showing avatars
  const canShowAvatars = useGlobalAvatarDelay(45000);

  // Voice avatar integration for direct voice interaction
  const {
    isRecording,
    isLoading: voiceLoading,
    isPlaying: isAvatarSpeaking,
    startRecording,
    stopRecording,
  } = useVoiceAvatar({ 
    avatarId,
    onMessage: () => {
      // Direct voice interaction - no need to update UI messages
    }
  });

  // Check if this specific avatar was dismissed OR if all avatars were globally dismissed
  const isHelpPage = location.pathname === '/help' || location.pathname === '/faq';
  const avatarDismissedKey = `dismissed_avatar_${avatarId}`;
  const isAvatarDismissed = sessionStorage.getItem(avatarDismissedKey) === 'true';
  const allAvatarsDismissed = sessionStorage.getItem('dismissed_all_avatars') === 'true';
  
  // If this avatar was dismissed, all avatars were dismissed, we're not on a help page, or delay hasn't passed, don't render
  if ((isAvatarDismissed || allAvatarsDismissed) && !isHelpPage) {
    return null;
  }
  
  // Apply 45-second delay across entire site (except help pages)
  if (!canShowAvatars && !isHelpPage) {
    return null;
  }

  // Use i18n.language as the primary source of truth for language detection
  const currentLanguage = i18n.language || 'es';

  const getDefaultMessage = () => {
    switch (currentLanguage) {
      case 'en':
        return "Here if you need assistance.";
      case 'pt':
        return "Aqui se precisar de ajuda.";
      case 'ro':
        return "Aici dacă ai nevoie de ajutor.";
      default:
        return "Aquí estoy. Si me necesitas, pregunta lo que quieras.";
    }
  };

  const displayMessage = message || getDefaultMessage();

  const handleDismiss = () => {
    setIsDismissed(true);
    
    // Store session flags to suppress ALL avatars for the session (global dismissal)
    const avatarDismissedKey = `dismissed_avatar_${avatarId}`;
    sessionStorage.setItem(avatarDismissedKey, 'true');
    sessionStorage.setItem('dismissed_all_avatars', 'true');
    
    onClose?.();
  };

  // Handle voice recording
  const handleVoiceToggle = () => {
    console.log(`🔧 EnhancedAvatarAssistant handleVoiceToggle START for ${avatarId}`);
    
    try {
      console.log(`🔧 EnhancedAvatarAssistant handleVoiceToggle called for ${avatarId}`, {
        isRecording,
        voiceLoading,
        hasStartRecording: typeof startRecording === 'function',
        hasStopRecording: typeof stopRecording === 'function'
      });
      
      // Activate avatar when starting voice chat
      addActiveAvatar(avatarId, gif);
      
      if (isRecording) {
        console.log(`🛑 EnhancedAvatarAssistant stopping recording for ${avatarId}`);
        stopRecording();
      } else {
        console.log(`🎙️ EnhancedAvatarAssistant starting recording for ${avatarId}`);
        startRecording();
      }
    } catch (error) {
      console.error(`❌ EnhancedAvatarAssistant handleVoiceToggle ERROR for ${avatarId}:`, error);
    }
  };

  if (isDismissed) {
    return null;
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50';
      default:
        return 'relative';
    }
  };

  return (
    <div className={`${getPositionStyles()} animate-fade-in`} id={`avatar-${avatarId}`} data-avatar-id={avatarId}>
      <div className="relative flex flex-col items-center">
        {/* Avatar with Playback Indicator */}
        <div className="relative">
          {/* Avatar Speaking Indicator - animated soundwaves */}
          {isAvatarSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full border-4 border-blue-400/60 animate-pulse"></div>
              <div className="absolute w-28 h-28 rounded-full border-2 border-blue-300/40 animate-ping"></div>
              {/* Soundwave indicators */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                <div className="flex space-x-1">
                  <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '250ms' }}></div>
                  <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div
            className={`${
              size === 'help-page' ? 'w-16 h-16 md:w-24 md:h-24 max-md:w-144 max-md:h-144' :
              size === 'small' ? 'w-24 h-24 md:w-24 md:h-24 max-md:w-20 max-md:h-20' : 
              'w-24 h-24 md:w-24 md:h-24 max-md:w-48 max-md:h-48'
            } rounded-full overflow-hidden shadow-lg border-2 border-fuchsia-400/50 relative z-10`}
            style={{ boxShadow: '0 0 60px rgba(0,200,255,0.8), 0 0 120px rgba(0,200,255,0.4), 0 0 180px rgba(0,200,255,0.2)' }}
          >
            <img 
              src={gif} 
              alt={`Avatar ${avatarId}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Microphone Button with Recording Indicator */}
        <div className="relative mt-2">
          {/* Recording indicator - pulsing red circles */}
          {isRecording && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full bg-red-500/30 animate-ping"></div>
              <div className="absolute w-12 h-12 rounded-full bg-red-500/50 animate-pulse"></div>
            </div>
          )}
          
          <button
            onClick={handleVoiceToggle}
            disabled={voiceLoading}
            className={`relative rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-10 ${
              size === 'help-page' ? 'w-12 h-12 md:w-12 md:h-12 max-md:w-4 max-md:h-4' : 'w-12 h-12'
            } ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 scale-110' 
                : 'bg-gray-400 hover:bg-gray-500'
            } ${voiceLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isRecording ? 'Stop Recording' : 'Start Voice Chat'}
          >
            {voiceLoading ? (
              <div className={`border-2 border-white border-t-transparent rounded-full animate-spin ${
                size === 'help-page' ? 'w-5 h-5 md:w-5 md:h-5 max-md:w-2 max-md:h-2' : 'w-5 h-5'
              }`} />
            ) : isRecording ? (
              <MicOff className={`text-white ${
                size === 'help-page' ? 'w-6 h-6 md:w-6 md:h-6 max-md:w-2 max-md:h-2' : 'w-6 h-6'
              }`} />
            ) : (
              <Mic className={`text-white ${
                size === 'help-page' ? 'w-6 h-6 md:w-6 md:h-6 max-md:w-2 max-md:h-2' : 'w-6 h-6'
              }`} />
            )}
          </button>
        </div>

        {/* Speech bubble - show for all positions when showMessage is true */}
        {showMessage && (
          <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 rounded-lg px-2 py-1 shadow-md text-[12px] max-w-[80px] text-center z-10 border border-fuchsia-200" style={{ backgroundColor: '#FBF3B4' }}>
            <span className="text-gray-800 leading-tight block">{displayMessage}</span>
            <button 
              onClick={handleDismiss}
              className="absolute -top-1 -right-1 text-white hover:text-white/80 rounded-full w-3 h-3 md:w-3 md:h-3 max-md:w-6 max-md:h-6 flex items-center justify-center border border-gray-300 bg-[#7E26A6] hover:bg-[#7E26A6]/90 transition-colors duration-200"
            >
              <X size={6} className="md:block max-md:hidden" />
              <X size={12} className="hidden max-md:block" />
            </button>
            {/* Bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style={{ borderTopColor: '#FBF3B4' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
