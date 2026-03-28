
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Achievement, AchievementData } from '../types';

export const useUserAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const achievementDefinitions: Omit<Achievement, 'isUnlocked'>[] = [
    {
      id: 'first-stay',
      name: 'First Stay',
      description: 'Completed your first reservation',
      icon: '🎉',
      criteria: 'Complete 1 stay'
    },
    {
      id: 'loyal-guest',
      name: 'Loyal Guest',
      description: 'Completed 5 or more stays',
      icon: '🏨',
      criteria: 'Complete 5+ stays'
    },
    {
      id: 'global-explorer',
      name: 'Global Explorer',
      description: 'Booked stays in 3 or more countries',
      icon: '🌍',
      criteria: 'Stay in 3+ countries'
    },
    {
      id: 'affinity-master',
      name: 'Affinity Master',
      description: 'Selected 5 or more different affinities',
      icon: '🧘',
      criteria: 'Select 5+ affinities'
    },
    {
      id: 'contributor',
      name: 'Contributor',
      description: 'Left at least one hotel review',
      icon: '💬',
      criteria: 'Write 1+ review'
    }
  ];

  useEffect(() => {
    const fetchAchievementData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch completed stays count and unique countries
        const { data: completedBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            hotels (country)
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed');

        if (bookingsError) throw bookingsError;

        // User affinities feature discontinued - set to 0
        const userAffinities = [];
        const affinitiesError = null;

        // Fetch reviews count
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('id')
          .eq('user_id', user.id);

        if (reviewsError) throw reviewsError;

        // Calculate achievement data
        const completedStays = completedBookings?.length || 0;
        const uniqueCountries = new Set(
          completedBookings?.map(booking => booking.hotels?.country).filter(Boolean)
        ).size;
        const affinitiesCount = userAffinities?.length || 0;
        const reviewsCount = reviews?.length || 0;
        const hasFirstStay = completedStays > 0;

        const achievementData: AchievementData = {
          completedStays,
          uniqueCountries,
          affinitiesCount,
          reviewsCount,
          hasFirstStay
        };

        // Determine which achievements are unlocked
        const unlockedAchievements = achievementDefinitions.map(achievement => ({
          ...achievement,
          isUnlocked: checkAchievementUnlocked(achievement.id, achievementData)
        }));

        setAchievements(unlockedAchievements);
      } catch (error) {
        console.error('Error fetching achievement data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievementData();
  }, [user]);

  const checkAchievementUnlocked = (achievementId: string, data: AchievementData): boolean => {
    switch (achievementId) {
      case 'first-stay':
        return data.hasFirstStay;
      case 'loyal-guest':
        return data.completedStays >= 5;
      case 'global-explorer':
        return data.uniqueCountries >= 3;
      case 'affinity-master':
        return data.affinitiesCount >= 5;
      case 'contributor':
        return data.reviewsCount >= 1;
      default:
        return false;
    }
  };

  return {
    achievements,
    loading,
    unlockedCount: achievements.filter(a => a.isUnlocked).length,
    totalCount: achievements.length
  };
};
