
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { AchievementBadge } from './AchievementBadge';
import { useUserAchievements } from './hooks/useUserAchievements';

export const UserMilestones: React.FC = () => {
  const { achievements, loading, unlockedCount, totalCount } = useUserAchievements();

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Your Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading your achievements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Milestones
          <span className="text-sm font-normal text-foreground/60">
            ({unlockedCount}/{totalCount} unlocked)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-4 text-foreground/60">
            Start your journey to unlock achievements!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge 
                key={achievement.id} 
                achievement={achievement} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
