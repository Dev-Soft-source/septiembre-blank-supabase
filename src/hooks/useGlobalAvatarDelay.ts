import { useState, useEffect } from 'react';

export const useGlobalAvatarDelay = (delayMs: number = 45000) => {
  const [canShowAvatars, setCanShowAvatars] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanShowAvatars(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);
  
  return canShowAvatars;
};