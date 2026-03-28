import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVideo } from '@/contexts/VideoContext';
import { X, Mic, MicOff } from 'lucide-react';

const englishTestimonials = [
  'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videoenglish/INGLeS%20TESTIMONIO%201.webm',
  'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videoenglish/INGLeS-TESTIMONIO-2_small.webm',
  'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videoenglish/INGLeS-TESTIMONIO-3.mp4'
];

export function EnglishVideoTestimonials() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { isYouTubeVideoPlaying, hasYouTubeVideoFinished } = useVideo();
  const [isVisible, setIsVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [totalVideosShown, setTotalVideosShown] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  // Check if ANY testimonial videos were closed in this session (global session dismissal)
  const anyVideosClosedInSession = sessionStorage.getItem('dismissed_video_spanish_testimonials') === 'true' ||
                                   sessionStorage.getItem('dismissed_video_english_testimonials') === 'true';
  

  // Show on allowed pages only, non-Spanish languages, if NO videos were closed, and NO YouTube video is playing
  const allowedPaths = ['/faq', '/afinidades', '/promotor-local', '/embajador'];
  const shouldShowVideos = allowedPaths.includes(location.pathname) && 
                          i18n.language !== 'es' && 
                          !anyVideosClosedInSession && 
                          !isYouTubeVideoPlaying &&
                          hasYouTubeVideoFinished;
  
  // Debug logging
  console.log('English video testimonials debug:', {
    pathname: location.pathname,
    language: i18n.language,
    anyVideosClosedInSession,
    isYouTubeVideoPlaying,
    hasYouTubeVideoFinished,
    shouldShowVideos,
    isVisible,
    currentVideoIndex,
    isComplete,
    totalVideosShown
  });

  // Maximum videos to show: 2 full loops (3 videos x 2 loops = 6 total)
  const maxVideosToShow = englishTestimonials.length * 2;

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Main video scheduling logic with absolute timing
  useEffect(() => {
    if (!shouldShowVideos || hasStartedRef.current || isComplete) {
      return;
    }

    console.log('Starting English testimonial video sequence');
    hasStartedRef.current = true;
    startTimeRef.current = Date.now();

    // Fixed start times: 1, 41, 81, 121, 161, 201 seconds (for 3 videos, 2 loops, 40s gap)
    const absoluteStartTimes = [1, 41, 81, 121, 161, 201]; // 2 full loops for 3 videos

    absoluteStartTimes.forEach((startTime, absoluteIndex) => {
      if (absoluteIndex >= maxVideosToShow) return;
      
      const videoIndex = absoluteIndex % englishTestimonials.length;
      const delay = startTime * 1000; // Convert to milliseconds

      timerRef.current = setTimeout(() => {
        console.log(`Starting English video ${absoluteIndex + 1} (index ${videoIndex}) at absolute time ${startTime}s`);
        setCurrentVideoIndex(videoIndex);
        setIsVisible(true);
        setTotalVideosShown(absoluteIndex + 1);
      }, delay);
    });

    // Set completion timer after last video completes
    const completionDelay = (absoluteStartTimes[absoluteStartTimes.length - 1] + 60) * 1000; // 60s buffer for last video
    setTimeout(() => {
      console.log('English testimonial sequence complete after 2 loops');
      setIsComplete(true);
    }, completionDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [shouldShowVideos, isComplete, maxVideosToShow]);

  // Handle video playback and transitions
  useEffect(() => {
    if (!isVisible || !videoRef.current || isComplete) return;

    const video = videoRef.current;

    const handleLoadedData = () => {
      console.log('English video loaded:', currentVideoIndex);
      // Set audio state properly
      video.muted = isMuted;
      // Auto-play the video
      video.play().catch((error) => {
        console.error('Error playing English video:', error);
      });
    };

    const handleEnded = () => {
      console.log('English video ended:', currentVideoIndex);
      // Hide video immediately after it ends
      setIsVisible(false);
    };

    const handleError = (error: any) => {
      console.error('English video loading error:', error);
    };

    const handleCanPlay = () => {
      console.log('English video can play:', currentVideoIndex);
      // Ensure proper video setup
      video.muted = isMuted;
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    // Set the video source
    video.src = englishTestimonials[currentVideoIndex];
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isVisible, currentVideoIndex, isComplete, isMuted]);

  const handleToggleAudio = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      console.log('Audio toggled:', newMutedState ? 'muted' : 'unmuted');
    }
  };

  const handleClose = () => {
    console.log('English video manually closed - applying global testimonial dismissal');
    // Set BOTH session storage flags to prevent ALL testimonial videos from showing again
    sessionStorage.setItem('dismissed_video_spanish_testimonials', 'true');
    sessionStorage.setItem('dismissed_video_english_testimonials', 'true');
    setIsVisible(false);
    setIsComplete(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Always return JSX, never return null early after hooks
  if (!shouldShowVideos || !isVisible || isComplete) {
    return <></>;
  }

  return (
    <div
      className="group"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: window.innerWidth <= 768 ? '130px' : '110px',
        height: window.innerWidth <= 768 ? '230px' : '195px',
        maxWidth: window.innerWidth <= 768 ? '130px' : '110px',
        maxHeight: window.innerWidth <= 768 ? '230px' : '195px',
        minWidth: window.innerWidth <= 768 ? '130px' : '110px',
        minHeight: window.innerWidth <= 768 ? '230px' : '195px',
        zIndex: 50,
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        backgroundColor: '#68178D',
        flexShrink: 0,
        pointerEvents: 'auto'
      }}
    >
      <video
        ref={videoRef}
        muted={isMuted}
        playsInline
        preload="metadata"
        style={{
          width: window.innerWidth <= 768 ? '130px' : '110px',
          height: window.innerWidth <= 768 ? '230px' : '195px',
          maxWidth: window.innerWidth <= 768 ? '130px' : '110px',
          maxHeight: window.innerWidth <= 768 ? '230px' : '195px',
          minWidth: window.innerWidth <= 768 ? '130px' : '110px',
          minHeight: window.innerWidth <= 768 ? '230px' : '195px',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none'
        }}
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 w-8 h-8 bg-[#68178D]/50 hover:bg-[#68178D]/70 rounded-full flex items-center justify-center transition-colors"
        style={{ pointerEvents: 'auto' }}
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Audio toggle button */}
      <button
        onClick={handleToggleAudio}
        className="absolute top-2 left-2 w-6 h-6 bg-[#68178D]/50 hover:bg-[#68178D]/70 rounded-full flex items-center justify-center transition-colors"
        style={{ pointerEvents: 'auto' }}
        title={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? (
          <MicOff className="w-3 h-3 text-white" />
        ) : (
          <Mic className="w-3 h-3 text-white" />
        )}
      </button>
    </div>
  );
}