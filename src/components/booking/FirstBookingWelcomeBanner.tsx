
import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FirstBookingWelcomeBannerProps {
  onClose?: () => void;
}

export const FirstBookingWelcomeBanner: React.FC<FirstBookingWelcomeBannerProps> = ({ onClose }) => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800/50 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
              <span>🎉</span>
              You've just booked your first Hotel-Living experience!
            </h3>
            <p className="text-green-700 dark:text-green-300 mt-1">
              Welcome! Your adventure starts soon.
            </p>
          </div>
        </div>
        <Sparkles className="w-8 h-8 text-green-500 dark:text-green-400" />
      </div>
    </Card>
  );
};
