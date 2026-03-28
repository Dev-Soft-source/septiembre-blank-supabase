
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';
import { useExpertMode } from '@/hooks/useExpertMode';

export const ExpertBadge: React.FC = () => {
  const { isExpert, bookingsCount, loading } = useExpertMode();

  if (loading || !isExpert) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <Badge 
        variant="default" 
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 px-3 py-1 text-sm font-bold shadow-lg border-2 border-yellow-300"
      >
        <Star className="w-4 h-4 mr-1 fill-current" />
        🌟 Hotel-Living Expert
      </Badge>
      <span className="text-sm text-white/70">
        {bookingsCount} completed stays
      </span>
    </div>
  );
};
