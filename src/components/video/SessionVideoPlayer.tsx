import React, { useState, useEffect } from 'react';
import { X, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

interface SessionVideoPlayerProps {
  onClose: () => void;
  onVideoEnd?: () => void;
}

export const SessionVideoPlayer: React.FC<SessionVideoPlayerProps> = ({ onClose, onVideoEnd }) => {
  const [isMuted, setIsMuted] = useState(true);
  const { language } = useTranslation();
  const location = useLocation();

  // Determine video URL based on language and route
  const getVideoUrl = () => {
    const isHotelsPage = location.pathname === '/hotels';
    
    if (language === 'en' || language === 'pt' || language === 'ro') {
      // English, Portuguese, Romanian use the same video
      if (isHotelsPage) {
        return 'https://www.youtube.com/embed/MV6uoOWM4Oo?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1';
      } else {
        return 'https://www.youtube.com/embed/ZzaoV58t_SM?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1';
      }
    } else {
      // Spanish keeps its own video
      if (isHotelsPage) {
        return 'https://www.youtube.com/embed/FGStOitWN7k?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1';
      } else {
        return 'https://www.youtube.com/embed/R8u7a3bYTJQ?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1&t=2s';
      }
    }
  };

  const handleActivateSound = () => {
    // Try to unmute the iframe (may not work due to browser restrictions)
    const iframe = document.querySelector('#session-video-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        setIsMuted(false);
      } catch (error) {
        // If unable to unmute, open video in new tab with sound
        const videoId = getVideoUrl().match(/embed\/([^?]+)/)?.[1];
        if (videoId) {
          window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        }
      }
    }
  };

  const getSoundButtonText = () => {
    switch (language) {
      case 'es': return 'Activar Sonido';
      case 'pt': return 'Ativar Som';
      case 'ro': return 'Activează Sunetul';
      default: return 'Activate Sound';
    }
  };

  const handleClose = () => {
    // Mark video as shown in session storage
    sessionStorage.setItem('session-video-shown', 'true');
    onVideoEnd?.();
    onClose();
  };

  // Listen for video end events from YouTube iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'video-ended' || (data.info && data.info.playerState === 0)) {
          // Video ended
          onVideoEnd?.();
          handleClose();
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onVideoEnd]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm flex items-center justify-center">
      {/* Video Container */}
      <div className="relative aspect-video" style={{width: "80vw", maxWidth: "80vw"}}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors"
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sound Activation Button */}
        <button
          onClick={handleActivateSound}
          className="absolute top-2 left-2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-lg px-3 py-2 flex items-center gap-2 transition-colors"
          aria-label="Activate sound"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">{getSoundButtonText()}</span>
        </button>

        {/* Video iframe */}
        <iframe
          id="session-video-iframe"
          src={getVideoUrl()}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Session Video"
        />
      </div>

      {/* Background click to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={handleClose}
        aria-label="Close video background"
      />
    </div>
  );
};