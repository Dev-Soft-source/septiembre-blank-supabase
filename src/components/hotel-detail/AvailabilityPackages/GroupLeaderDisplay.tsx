import React from 'react';
import { Link } from 'react-router-dom';
import { getHotelLeader } from '@/data/hotel-leader-mapping';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

interface GroupLeaderDisplayProps {
  hotelId: string;
}

export const GroupLeaderDisplay: React.FC<GroupLeaderDisplayProps> = ({ hotelId }) => {
  const { t } = useTranslationWithFallback('hotel-detail');
  const leader = getHotelLeader(hotelId);

  if (!leader) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Link 
        to={`/leaders/${leader.slug}`}
        className="block hover:opacity-80 transition-opacity"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-400/50 bg-purple-600/20 shadow-lg hover:shadow-xl transition-shadow">
          <img
            src={leader.avatar_url}
            alt={`${leader.full_name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </Link>
      <span className="text-xs text-white/90 font-medium text-center">
        {t('groupLeader')}
      </span>
    </div>
  );
};