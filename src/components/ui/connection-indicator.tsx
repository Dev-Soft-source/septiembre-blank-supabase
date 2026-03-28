import React, { useEffect, useState } from 'react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionIndicatorProps {
  className?: string;
  showWhenOnline?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function ConnectionIndicator({ 
  className,
  showWhenOnline = false,
  position = 'bottom-right'
}: ConnectionIndicatorProps) {
  const { isOnline, wasOffline } = useConnectionStatus();
  const [showIndicator, setShowIndicator] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowIndicator(true);
    } else if (wasOffline) {
      // Show reconnection message briefly
      setJustReconnected(true);
      setShowIndicator(true);
      
      const timer = setTimeout(() => {
        setShowIndicator(showWhenOnline);
        setJustReconnected(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(showWhenOnline);
    }
  }, [isOnline, wasOffline, showWhenOnline]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (!showIndicator) return <></>;

  return (
    <div className={cn(
      "fixed z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 text-sm font-medium",
      positionClasses[position],
      isOnline 
        ? justReconnected
          ? "bg-green-600 text-white"
          : "bg-green-100 text-green-800 border border-green-200"
        : "bg-red-600 text-white",
      "animate-fade-in",
      className
    )}>
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          {justReconnected ? 'Reconnected' : 'Online'}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          No connection
        </>
      )}
    </div>
  );
}