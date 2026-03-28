import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoContextType {
  isYouTubeVideoPlaying: boolean;
  setIsYouTubeVideoPlaying: (playing: boolean) => void;
  hasYouTubeVideoFinished: boolean;
  setHasYouTubeVideoFinished: (finished: boolean) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within VideoProvider');
  }
  return context;
};

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isYouTubeVideoPlaying, setIsYouTubeVideoPlaying] = useState(false);
  const [hasYouTubeVideoFinished, setHasYouTubeVideoFinished] = useState(false);

  return (
    <VideoContext.Provider
      value={{
        isYouTubeVideoPlaying,
        setIsYouTubeVideoPlaying,
        hasYouTubeVideoFinished,
        setHasYouTubeVideoFinished,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};