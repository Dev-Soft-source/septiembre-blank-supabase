import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVideoTestimonial } from '@/contexts/VideoTestimonialContext';
import { useVideo } from '@/contexts/VideoContext';
import { X, Volume2, VolumeX } from 'lucide-react';

const videoTestimonials = [
  {
    url: 'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videos/testimonio1.webm',
    id: 'testimonio1'
  },
  {
    url: 'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videos/testimonio2.webm',
    id: 'testimonio2'
  },
  {
    url: 'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videos/testimonio3.webm',
    id: 'testimonio3'
  },
  {
    url: 'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videos/testimonio4.webm',
    id: 'testimonio4'
  },
  {
    url: 'https://pgdzrvdwgoomjnnegkcn.supabase.co/storage/v1/object/public/videos/testimonio5.webm',
    id: 'testimonio5'
  }
];

export function GlobalVideoTestimonials() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { isYouTubeVideoPlaying, hasYouTubeVideoFinished } = useVideo();
  const {
    isVisible,
    setIsVisible,
    currentVideoIndex,
    setCurrentVideoIndex,
    isMuted,
    setIsMuted,
  } = useVideoTestimonial();

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  const hasErrorRef = useRef(false);
  const isLoadedRef = useRef(false);

  // Check if ANY testimonial videos were closed in this session (global session dismissal)
  const anyVideosClosedInSession = sessionStorage.getItem('dismissed_video_spanish_testimonials') === 'true' ||
                                   sessionStorage.getItem('dismissed_video_english_testimonials') === 'true';
  

  // Show on allowed pages only, Spanish language, if NO videos were closed, and NO YouTube video is playing
  const allowedPaths = ['/faq', '/afinidades', '/promotor-local', '/embajador'];
  const shouldShowVideos = allowedPaths.includes(location.pathname) && 
                          i18n.language === 'es' && 
                          !anyVideosClosedInSession && 
                          !isYouTubeVideoPlaying &&
                          hasYouTubeVideoFinished;
  
  // Debug logging
  console.log('Spanish video testimonials debug:', {
    pathname: location.pathname,
    language: i18n.language,
    anyVideosClosedInSession,
    isYouTubeVideoPlaying,
    hasYouTubeVideoFinished,
    shouldShowVideos,
    isVisible,
    currentVideoIndex
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (cycleTimerRef.current) {
        clearTimeout(cycleTimerRef.current);
      }
    };
  }, []);

  // Main video scheduling logic with absolute timing - 2 full loops max
  useEffect(() => {
    if (!shouldShowVideos || hasStartedRef.current) {
      return;
    }

    console.log('Starting Spanish testimonial video sequence');
    hasStartedRef.current = true;
    startTimeRef.current = Date.now();

    // Fixed start times: 1, 41, 81, 121, 161, 201, 241, 281, 321, 361 seconds (for 5 videos, 2 loops, 40s gap)
    const absoluteStartTimes = [1, 41, 81, 121, 161, 201, 241, 281, 321, 361]; // 2 full loops for 5 videos

    absoluteStartTimes.forEach((startTime, absoluteIndex) => {
      const videoIndex = absoluteIndex % videoTestimonials.length;
      const delay = startTime * 1000; // Convert to milliseconds

      setTimeout(() => {
        console.log(`Starting Spanish video ${absoluteIndex + 1} (index ${videoIndex}) at absolute time ${startTime}s`);
        setCurrentVideoIndex(videoIndex);
        setIsVisible(true);
        hasErrorRef.current = false;
        isLoadedRef.current = false;
      }, delay);
    });

    // Set completion flag after last video completes
    const completionDelay = (absoluteStartTimes[absoluteStartTimes.length - 1] + 60) * 1000; // 60s buffer for last video
    setTimeout(() => {
      console.log('Spanish testimonial sequence complete after 2 loops');
    }, completionDelay);
  }, [shouldShowVideos, setCurrentVideoIndex, setIsVisible]);

  // Handle video loading and playback
  useEffect(() => {
    if (!isVisible || !videoRef.current) return;

    const video = videoRef.current;
    const currentVideo = videoTestimonials[currentVideoIndex];

    console.log('Setting up video:', currentVideo.id);

    const handleLoadedData = () => {
      console.log('Video loaded successfully:', currentVideo.id);
      isLoadedRef.current = true;
      hasErrorRef.current = false;

      // Auto-play the video
      video.play().catch((error) => {
        console.error('Error playing video:', error);
        hasErrorRef.current = true;
      });
    };

    const handleError = (error: any) => {
      console.error('Video loading error:', error);
      hasErrorRef.current = true;
    };

    const handleEnded = () => {
      console.log('Video ended:', currentVideo.id);
      // Hide video when it ends to prevent frozen frame
      setIsVisible(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    // Set the video source
    video.src = currentVideo.url;
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isVisible, currentVideoIndex]);

  const handleClose = () => {
    console.log('Video manually closed - applying global testimonial dismissal');
    // Set BOTH session storage flags to prevent ALL testimonial videos from showing again
    sessionStorage.setItem('dismissed_video_spanish_testimonials', 'true');
    sessionStorage.setItem('dismissed_video_english_testimonials', 'true');
    setIsVisible(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Always return JSX, never return null early after hooks
  if (!shouldShowVideos || !isVisible) {
    return <></>;
  }

  const currentVideo = videoTestimonials[currentVideoIndex];

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

      {/* Volume toggle button */}
      <button
        onClick={toggleMute}
        className="absolute top-2 left-2 w-6 h-6 bg-[#68178D]/50 hover:bg-[#68178D]/70 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        style={{ pointerEvents: 'auto' }}
      >
        {isMuted ? (
          <VolumeX className="w-3 h-3 text-white" />
        ) : (
          <Volume2 className="w-3 h-3 text-white" />
        )}
      </button>
    </div>
  );
}
