import React from 'react';
import { useConnectionNotification } from '@/hooks/useConnectionNotification';

export function ConnectionBanner() {
  const { showBanner, bannerType, message, hideBanner } = useConnectionNotification();

  if (!showBanner) return null;

  return (
    <div 
      className={`connection-banner ${bannerType}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <span>{message}</span>
        {bannerType === 'offline' && (
          <button
            onClick={hideBanner}
            className="ml-4 text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            aria-label="Dismiss connection notification"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}