import { useState, useEffect } from "react";
import { X, Mic, MicOff } from "lucide-react";
import { useVoiceAvatar } from "@/hooks/useVoiceAvatar";
import { type AvatarId } from "@/constants/avatarVoices";

interface AvatarAssistantProps {
  avatarId: AvatarId;
  gif: string;
  isVisible: boolean;
  onClose?: () => void;
}

const getMessage = () => {
  const lang = navigator.language;
  if (lang.startsWith("en")) return "I'll stay here in case you need me.";
  if (lang.startsWith("pt")) return "Fico por aqui caso precise de mim."; 
  if (lang.startsWith("ro")) return "Rămân aici în caz că ai nevoie de mine.";
  return "Me quedo por aquí por si me necesitas.";
};

export function AvatarAssistant({ avatarId, gif, isVisible, onClose }: AvatarAssistantProps) {
  const [isDismissed, setIsDismissed] = useState(false);

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

  useEffect(() => {
    // Check if user already has an active avatar
    const activeAvatar = localStorage.getItem('activeAvatar');
    if (activeAvatar && activeAvatar !== avatarId) {
      setIsDismissed(true);
    }
  }, [avatarId]);

  const handleDismiss = () => {
    setIsDismissed(true);
    onClose?.();
  };

  // Handle voice recording
  const handleVoiceToggle = () => {
    console.log(`🔧 AvatarAssistant handleVoiceToggle called for ${avatarId}`, {
      isRecording,
      voiceLoading,
      hasStartRecording: typeof startRecording === 'function',
      hasStopRecording: typeof stopRecording === 'function'
    });
    
    // Set as active avatar when starting voice chat
    localStorage.setItem('activeAvatar', avatarId);
    
    if (isRecording) {
      console.log(`🛑 Stopping recording for ${avatarId}`);
      stopRecording();
    } else {
      console.log(`🎙️ Starting recording for ${avatarId}`);
      startRecording();
    }
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="relative mb-4 flex justify-center animate-fade-in">
      <div className="relative flex flex-col items-center">
        {/* Avatar with Voice Indicator */}
        <div className="relative">
          {/* Avatar Speaking Indicator */}
          {isAvatarSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full border-4 border-blue-400/60 animate-pulse"></div>
              <div className="absolute w-16 h-16 rounded-full border-2 border-blue-300/40 animate-ping"></div>
            </div>
          )}
          
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg relative z-10">
            <img 
              src={gif} 
              alt={`Avatar ${avatarId}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Microphone Button */}
        <div className="relative mt-2">
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full bg-red-500/30 animate-ping"></div>
              <div className="absolute w-12 h-12 rounded-full bg-red-500/50 animate-pulse"></div>
            </div>
          )}
          
          <button
            onClick={handleVoiceToggle}
            disabled={voiceLoading}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-10 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 scale-110' 
                : 'bg-gray-400 hover:bg-gray-500'
            } ${voiceLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isRecording ? 'Stop Recording' : 'Start Voice Chat'}
          >
            {voiceLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Speech bubble */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-md text-xs whitespace-nowrap z-10">
          <span className="text-gray-800">{getMessage()}</span>
          <button 
            onClick={handleDismiss}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X size={12} />
          </button>
          {/* Bubble tail */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      </div>
    </div>
  );
}