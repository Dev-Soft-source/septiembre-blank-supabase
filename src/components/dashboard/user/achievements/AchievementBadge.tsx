
import React from 'react';
import { cn } from '@/lib/utils';
import { Achievement } from './types';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  return (
    <div 
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-200",
        achievement.isUnlocked 
          ? "bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 border-fuchsia-500/30 shadow-lg hover:shadow-xl hover:scale-105" 
          : "bg-background/5 border-foreground/10 opacity-50"
      )}
    >
      <div className="text-center">
        <div className={cn(
          "text-3xl mb-2 transition-all duration-200",
          achievement.isUnlocked ? "grayscale-0" : "grayscale"
        )}>
          {achievement.icon}
        </div>
        <h3 className={cn(
          "font-semibold text-sm mb-1",
          achievement.isUnlocked ? "text-foreground" : "text-foreground/50"
        )}>
          {achievement.name}
        </h3>
        <p className={cn(
          "text-xs leading-relaxed",
          achievement.isUnlocked ? "text-foreground/70" : "text-foreground/40"
        )}>
          {achievement.description}
        </p>
        <div className={cn(
          "text-xs mt-2 px-2 py-1 rounded-full",
          achievement.isUnlocked 
            ? "bg-fuchsia-500/20 text-fuchsia-300" 
            : "bg-foreground/5 text-foreground/40"
        )}>
          {achievement.criteria}
        </div>
      </div>
      
      {achievement.isUnlocked && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
};
