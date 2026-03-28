import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TabAvatarProps {
  avatarId: string;
  gif: string;
  message: string;
  onClose: () => void;
}

// Function to format avatar messages with final sentence on separate line
function formatMessageWithFinalSentence(message: string): string {
  console.log('🔍 Avatar message formatting:', { 
    original: message,
    hasNewlines: message.includes('\n'),
    splitByNewlines: message.split('\n')
  });
  
  // Convert ALL \n to <br> tags for proper HTML line breaks
  let formatted = message.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
  
  console.log('✅ Final formatted message:', { formatted });
  return formatted;
}

export function TabAvatar({ avatarId, gif, message, onClose }: TabAvatarProps) {
  const [showMessage, setShowMessage] = useState(true);

  console.log('🎭 TabAvatar rendered:', { 
    avatarId, 
    message, 
    messageLength: message.length,
    containsNewlines: message.includes('\n'),
    newlineCount: (message.match(/\n/g) || []).length
  });

  // Check if this specific tab avatar was dismissed in this session
  const avatarDismissedKey = `dismissed_avatar_${avatarId}`;
  const isAvatarDismissed = sessionStorage.getItem(avatarDismissedKey) === 'true';
  
  // If this avatar was dismissed, don't render
  if (isAvatarDismissed) {
    return null;
  }

  useEffect(() => {
    // Hide message after 7 seconds but keep avatar visible
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    // Store session flag to suppress this specific avatar for the session
    const avatarDismissedKey = `dismissed_avatar_${avatarId}`;
    sessionStorage.setItem(avatarDismissedKey, 'true');
    onClose();
  };

  return (
    <div className="relative">
      {/* Avatar Image */}
      <div className="relative">
        <img 
          src={gif} 
          alt={avatarId}
          data-avatar-id={avatarId}
          className="w-20 h-20 max-md:w-12 max-md:h-12 rounded-full object-cover shadow-lg border-2 border-white"
          style={{ objectPosition: 'center' }}
        />
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Message bubble */}
      {showMessage && (
        <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 rounded-lg px-3 py-2 shadow-lg text-xs max-md:text-sm font-medium text-gray-800 text-center max-w-[140px] max-md:max-w-[180px] leading-tight border border-gray-200" style={{ backgroundColor: '#FBF3B4' }}>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent" style={{ borderTopColor: '#FBF3B4' }}></div>
          <div dangerouslySetInnerHTML={{ __html: formatMessageWithFinalSentence(message) }} style={{ lineHeight: '1.3' }} />
        </div>
      )}
    </div>
  );
}
