import { useState, useEffect } from 'react';
import { useConnectionStatus } from './useConnectionStatus';

export function useConnectionNotification() {
  const { isOnline } = useConnectionStatus();
  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState<'offline' | 'reconnected'>('offline');
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline && !wasOffline) {
      // Connection lost
      setWasOffline(true);
      setBannerType('offline');
      setShowBanner(true);
    } else if (isOnline && wasOffline) {
      // Connection restored
      setBannerType('reconnected');
      setShowBanner(true);
      setWasOffline(false);
      
      // Hide reconnection banner after 3 seconds
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    } else if (isOnline && !wasOffline) {
      // Initially online, hide any banner
      setShowBanner(false);
    }
  }, [isOnline, wasOffline]);

  const hideBanner = () => {
    setShowBanner(false);
  };

  const getMessage = () => {
    switch (bannerType) {
      case 'offline':
        return 'Connection lost. Trying to reconnect...';
      case 'reconnected':
        return 'Connection restored!';
      default:
        return '';
    }
  };

  return {
    showBanner,
    bannerType,
    message: getMessage(),
    hideBanner,
    isOnline
  };
}