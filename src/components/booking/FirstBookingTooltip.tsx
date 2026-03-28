
import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FirstBookingTooltipProps {
  step: 'dates' | 'meals' | 'review';
  className?: string;
}

export const FirstBookingTooltip: React.FC<FirstBookingTooltipProps> = ({ step, className }) => {
  const getTooltipContent = () => {
    switch (step) {
      case 'dates':
        return {
          icon: '📅',
          text: 'Choose your check-in date — remember, all stays are fixed-length!'
        };
      case 'meals':
        return {
          icon: '🍽️',
          text: 'Add the food services you want — you can combine them freely.'
        };
      case 'review':
        return {
          icon: '💬',
          text: 'Questions? We\'re here to help. Review your info and confirm!'
        };
      default:
        return { icon: 'ℹ️', text: 'Helpful tip!' };
    }
  };

  const { icon, text } = getTooltipContent();

  return (
    <div className={cn(
      "flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg text-sm text-blue-800 dark:text-blue-200 mb-4",
      className
    )}>
      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <span className="text-lg mr-1">{icon}</span>
      <span>{text}</span>
    </div>
  );
};
