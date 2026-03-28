
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoTestimonialContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  currentVideoIndex: number;
  setCurrentVideoIndex: (index: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

const VideoTestimonialContext = createContext<VideoTestimonialContextType | undefined>(undefined);

export const useVideoTestimonial = () => {
  const context = useContext(VideoTestimonialContext);
  if (!context) {
    throw new Error('useVideoTestimonial must be used within VideoTestimonialProvider');
  }
  return context;
};

export const VideoTestimonialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <VideoTestimonialContext.Provider
      value={{
        isVisible,
        setIsVisible,
        currentVideoIndex,
        setCurrentVideoIndex,
        isMuted,
        setIsMuted,
      }}
    >
      {children}
    </VideoTestimonialContext.Provider>
  );
};
