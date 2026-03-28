import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { useVoiceAvatar } from "@/hooks/useVoiceAvatar";
import { useTranslation } from "@/hooks/useTranslation";
import { type AvatarId } from "@/constants/avatarVoices";

interface InteractiveAvatarProps {
  avatar: { id: string; gif: string };
  position: 'bottom-left' | 'bottom-right';
  onClose?: () => void;
}

export function InteractiveAvatar({ avatar, position, onClose }: InteractiveAvatarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation('faq');
  
  const {
    isRecording,
    isPlaying,
    isLoading,
    waitingToRecord,
    startRecording,
    stopRecording,
    endSession
  } = useVoiceAvatar({
    avatarId: avatar.id as AvatarId,
    onMessage: (message) => {
      console.log(`Avatar ${avatar.id} message:`, message);
    }
  });

  const positionClasses = position === 'bottom-right' 
    ? 'fixed bottom-8 right-8 z-40' 
    : 'fixed bottom-8 left-8 z-40';

  const getAvatarMessage = (avatarId: string) => {
    return t(`avatars.${avatarId}.shortMessage`, undefined);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleClose = () => {
    endSession();
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`${positionClasses} animate-fade-in`}>
      <div className="relative">
        {/* Avatar */}
        <div className="w-16 h-16 md:w-16 md:h-16 max-md:w-32 max-md:h-32 rounded-full overflow-hidden shadow-lg border-2 border-fuchsia-400/50 relative">
          <img 
            src={avatar.gif} 
            alt={`Avatar ${avatar.id}`}
            className="w-full h-full object-cover"
          />
          
          {/* Microphone Button Overlay */}
          <button
            onClick={handleVoiceToggle}
            disabled={isLoading}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500/80 text-white' 
                : waitingToRecord || isPlaying
                ? 'bg-yellow-500/80 text-white'
                : isLoading
                ? 'bg-blue-500/80 text-white'
                : 'bg-black/40 text-white opacity-0 hover:opacity-100'
            }`}
            title={
              isRecording 
                ? "Stop Recording" 
                : waitingToRecord 
                ? "Waiting for intro..." 
                : isPlaying 
                ? "Avatar Speaking..." 
                : isLoading 
                ? "Processing..." 
                : "Start Voice Chat"
            }
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Speech bubble */}
        <div className="absolute -top-20 md:-top-20 max-md:-top-40 left-1/2 transform -translate-x-1/2 rounded-lg px-2 py-1 md:px-2 md:py-1 max-md:px-4 max-md:py-2 shadow-md text-[12px] md:text-[12px] max-md:text-[17px] max-w-[80px] md:max-w-[80px] max-md:max-w-[160px] text-center z-10 border border-fuchsia-200" style={{ backgroundColor: '#FBF3B4' }}>
          <span className="text-gray-800 leading-tight block">
            {isRecording ? "🎤 Recording..." : 
             waitingToRecord ? "🔊 Starting..." :
             isPlaying ? "🗣️ Speaking..." :
             isLoading ? "⏳ Thinking..." :
             getAvatarMessage(avatar.id)}
          </span>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
            title="Close"
          >
            ×
          </button>
          
          {/* Bubble tail */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style={{ borderTopColor: '#FBF3B4' }}></div>
        </div>
      </div>
    </div>
  );
}