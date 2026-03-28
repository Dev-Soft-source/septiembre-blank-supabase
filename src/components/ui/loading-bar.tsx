import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingBarProps {
  progress?: number;
  indeterminate?: boolean;
  className?: string;
  height?: 'thin' | 'normal' | 'thick';
}

export function LoadingBar({ 
  progress = 0, 
  indeterminate = false, 
  className,
  height = 'thin'
}: LoadingBarProps) {
  const heightMap = {
    thin: 'h-0.5',
    normal: 'h-1',
    thick: 'h-2'
  };

  if (indeterminate) {
    return (
      <>
        <style>{`
          @keyframes loading-slide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div className={cn("w-full bg-gray-200 dark:bg-gray-700 overflow-hidden", heightMap[height], className)}>
          <div 
            className="h-full bg-primary animate-pulse bg-gradient-to-r from-transparent via-current to-transparent" 
            style={{
              animation: 'loading-slide 2s ease-in-out infinite'
            }} 
          />
        </div>
      </>
    );
  }

  return (
    <div className={cn("w-full bg-gray-200 dark:bg-gray-700", heightMap[height], className)}>
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}