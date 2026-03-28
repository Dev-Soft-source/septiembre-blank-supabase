import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
}

export function ProgressRing({ 
  progress, 
  size = 'md', 
  className,
  showPercentage = false 
}: ProgressRingProps) {
  const sizeMap = {
    sm: { dimension: 24, strokeWidth: 2, textSize: 'text-xs' },
    md: { dimension: 32, strokeWidth: 3, textSize: 'text-sm' },
    lg: { dimension: 48, strokeWidth: 4, textSize: 'text-base' }
  };
  
  const { dimension, strokeWidth, textSize } = sizeMap[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-300 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      {showPercentage && (
        <span className={cn("absolute font-medium text-gray-600 dark:text-gray-400", textSize)}>
          {progress}%
        </span>
      )}
    </div>
  );
}