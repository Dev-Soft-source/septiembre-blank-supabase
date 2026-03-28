
import React from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
// JotForm utilities removed

interface GoogleMapsWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { isLoaded, isLoading, error } = useGoogleMaps();

  // JotForm conflict detection removed

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Loading Google Maps...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-destructive">Error loading Google Maps: {error}</div>
      </div>
    );
  }

  if (!isLoaded) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
