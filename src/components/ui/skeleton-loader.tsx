import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

interface SkeletonLoaderProps {
  variant: 'card' | 'list' | 'text' | 'image' | 'button';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ variant, count = 1, className }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        );
      
      case 'image':
        return <Skeleton className="aspect-video w-full rounded-lg" />;
      
      case 'button':
        return <Skeleton className="h-10 w-24 rounded-md" />;
      
      default:
        return <Skeleton className="h-4 w-full" />;
    }
  };

  return (
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={count > 1 ? "mb-4 last:mb-0" : ""}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}