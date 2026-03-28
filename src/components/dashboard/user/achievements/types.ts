
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  isUnlocked: boolean;
}

export interface AchievementData {
  completedStays: number;
  uniqueCountries: number;
  affinitiesCount: number;
  reviewsCount: number;
  hasFirstStay: boolean;
}
