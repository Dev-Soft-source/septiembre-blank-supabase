import React, { Suspense } from 'react';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

export function LazyWrapper({ 
  children, 
  fallback,
  minHeight = "200px"
}: LazyWrapperProps) {
  const defaultFallback = (
    <div 
      className="flex items-center justify-center w-full animate-pulse bg-muted/20 rounded"
      style={{ minHeight }}
    >
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}