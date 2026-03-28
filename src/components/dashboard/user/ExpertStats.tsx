
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, Trophy, Heart } from 'lucide-react';
import { useExpertStats } from '@/hooks/useExpertStats';

export const ExpertStats: React.FC = () => {
  const { stats, loading } = useExpertStats();

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Your Travel Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Your Travel Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>
            You've stayed in <strong>{stats.citiesCount}</strong> {stats.citiesCount === 1 ? 'city' : 'cities'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-white">
          <Star className="w-4 h-4 text-purple-400" />
          <span>
            Experienced <strong>{stats.affinitiesCount}</strong> different {stats.affinitiesCount === 1 ? 'affinity' : 'affinities'}
          </span>
        </div>

        {stats.favoriteDestination && (
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-4 h-4 text-red-400" />
            <span>
              Favorite destination: <strong>{stats.favoriteDestination}</strong>
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-white/20">
          <p className="text-sm text-white/80">
            Total stays: <strong className="text-yellow-400">{stats.totalStays}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
