import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SessionVideoPlayer } from './SessionVideoPlayer';
import { useTranslation } from '@/hooks/useTranslation';
import { navigationTracker } from '@/utils/navigationTracker';
import { useVideo } from '@/contexts/VideoContext';

interface VideoSessionManagerProps {
  onVideoStateChange?: (isVideoVisible: boolean) => void;
}

export const VideoSessionManager: React.FC<VideoSessionManagerProps> = ({ onVideoStateChange }) => {
  const [showVideo, setShowVideo] = useState(false);
  const { language } = useTranslation();
  const location = useLocation();
  const { setIsYouTubeVideoPlaying, setHasYouTubeVideoFinished } = useVideo();

  // Check if current route should show video - ONLY specific pages allowed
  const shouldShowVideo = () => {
    const pathname = location.pathname;
    const allowedPaths = [
      '/faq',
      '/afinidades', 
      '/promotor-local',
      '/embajador'
    ];
    
    // Check if on dashboard/admin routes (always exclude)
    const isDashboard = pathname.includes('/dashboard') || 
                       pathname.includes('/panel') ||
                       pathname.includes('/admin') ||
                       pathname.includes('/login') ||
                       pathname.includes('/register') ||
                       pathname.includes('/signup') ||
                       pathname.includes('/auth');
    
    return allowedPaths.includes(pathname) && !isDashboard;
  };

  // Track navigation for autoplay logic
  useEffect(() => {
    navigationTracker.trackNavigation(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Check if video has already been shown this session or if on excluded route
    const videoShown = sessionStorage.getItem('session-video-shown');
    
    // Only show video if:
    // 1. Not already shown this session
    // 2. On allowed route
    // 3. User has performed internal navigation (not direct landing)
    if (!videoShown && shouldShowVideo() && navigationTracker.hasPerformedInternalNavigation()) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setShowVideo(true);
        setIsYouTubeVideoPlaying(true);
        onVideoStateChange?.(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [onVideoStateChange, location.pathname, setIsYouTubeVideoPlaying]);

  const handleCloseVideo = () => {
    setShowVideo(false);
    setIsYouTubeVideoPlaying(false);
    setHasYouTubeVideoFinished(true);
    onVideoStateChange?.(false);
  };

  // If language changes before video is shown, update the video selection
  useEffect(() => {
    if (showVideo) {
      // Video is already showing, it will use the current language
      // The SessionVideoPlayer component will handle the language detection
    }
  }, [language, showVideo]);

  if (!showVideo) {
    return null;
  }

  return <SessionVideoPlayer onClose={handleCloseVideo} onVideoEnd={() => {
    setIsYouTubeVideoPlaying(false);
    setHasYouTubeVideoFinished(true);
  }} />;
};