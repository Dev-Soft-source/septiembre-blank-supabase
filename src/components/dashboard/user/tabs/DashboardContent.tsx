
import React from 'react';
import { ArrowUp, BarChart2, Building, Calendar, Star, Users, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../StatCard';
import ActionCard from '../../ActionCard';
import { useReviewNotifications } from '@/hooks/useReviewNotifications';
import { Button } from '@/components/ui/button';
import { RecommendedHotels } from '@/components/dashboard/user/RecommendedHotels';
import { ReferralCodeBanner } from '@/components/dashboard/shared/ReferralCodeBanner';

import { useFirstBookingMode } from '@/hooks/useFirstBookingMode';
import { useSavedHotelsCount } from '@/components/dashboard/hooks/useSavedHotelsCount';
import { ExpertBadge } from '@/components/dashboard/user/ExpertBadge';
import { ExpertStats } from '@/components/dashboard/user/ExpertStats';
import { AffinityBadges } from '@/components/dashboard/user/AffinityBadges';
import { useExpertMode } from '@/hooks/useExpertMode';
import { useTranslation } from '@/hooks/useTranslation';

export const DashboardContent = () => {
  const navigate = useNavigate();
  const { isFirstTimeUser, loading: firstTimeLoading } = useFirstBookingMode();
  const { savedHotelsCount, isLoading: savedHotelsLoading } = useSavedHotelsCount();
  const { isExpert } = useExpertMode();
  const { t } = useTranslation('dashboard/user');
  const {
    notifications,
    newNotificationsCount,
    loading: notificationsLoading
  } = useReviewNotifications();
  
  const stats = [{
    title: t('userDashboard.dashboard.stats.totalBookings'),
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: <Calendar className="w-4 h-4" />
  }, {
    title: t('userDashboard.dashboard.stats.savedHotels'),
    value: savedHotelsLoading ? '...' : savedHotelsCount.toString(),
    change: '0%',
    trend: 'neutral',
    icon: <Star className="w-4 h-4" />
  }, {
    title: t('userDashboard.dashboard.stats.reviewsWritten'),
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: <MessageSquare className="w-4 h-4" />
  }, {
    title: t('userDashboard.dashboard.stats.freeNights'),
    value: '0',
    change: '0',
    trend: 'neutral',
    icon: <Sparkles className="w-4 h-4" />
  }];
  
  const actions = [{
    title: t('userDashboard.dashboard.quickActions.browseHotels'),
    description: t('userDashboard.dashboard.quickActions.browseHotelsDesc'),
    icon: <Building className="w-5 h-5" />,
    onClick: () => navigate('/hotels')
  }, {
    title: t('userDashboard.dashboard.quickActions.myBookings'),
    description: t('userDashboard.dashboard.quickActions.myBookingsDesc'),
    icon: <Calendar className="w-5 h-5" />,
    onClick: () => {} // This will be handled by tab switching
  }, {
    title: t('userDashboard.dashboard.quickActions.savedHotels'),
    description: t('userDashboard.dashboard.quickActions.savedHotelsDesc'),
    icon: <Star className="w-5 h-5" />,
    onClick: () => {} // This will be handled by tab switching
  }, {
    title: t('userDashboard.dashboard.quickActions.writeReview'),
    description: t('userDashboard.dashboard.quickActions.writeReviewDesc'),
    icon: <MessageSquare className="w-5 h-5" />,
    onClick: () => {} // This will be handled by tab switching
  }];
  
  return (
    <div className="space-y-8">
      
      {/* Expert Badge */}
      <ExpertBadge />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatCard key={`stat-${stat.title}-${i}`} {...stat} />)}
      </div>

      {/* Expert Stats - Only show for expert users */}
      {isExpert && (
        <ExpertStats />
      )}

      {/* Affinity Badges Section */}
      <AffinityBadges />

      {/* Welcome Message */}
      <div className="glass-card rounded-2xl p-6 border border-fuchsia-500/20 bg-[#7a0486]">
        <h2 className="text-xl font-semibold mb-2">{t('userDashboard.dashboard.welcome.title')}</h2>
        <p className="text-foreground/80 mb-4">
          {isExpert ? t('userDashboard.dashboard.welcome.expertWelcome') : t('userDashboard.dashboard.welcome.subtitle')}
        </p>
      </div>

      {/* Recommended Hotels Section - Temporarily disabled to fix black screen issue */}
      {/* <RecommendedHotels /> */}

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
        <h2 className="text-xl font-semibold mb-4">{t('userDashboard.dashboard.quickActions.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, i) => <ActionCard key={`action-${action.title}-${i}`} {...action} />)}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="glass-card rounded-2xl p-6 bg-[#5d0478]">
          <h2 className="text-xl font-semibold mb-4">{t('userDashboard.dashboard.recentActivity.recentBookings')}</h2>
          
          <div className="text-center py-8 text-foreground/60 bg-[#a54afe]">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('userDashboard.dashboard.recentActivity.noBookings')}</p>
            <p className="text-sm mt-2">{t('userDashboard.dashboard.recentActivity.noBookingsDesc')}</p>
          </div>
        </div>

        {/* Saved Hotels */}
        <div className="glass-card rounded-2xl p-6 bg-[#5d0478]">
          <h2 className="text-xl font-semibold mb-4">{t('userDashboard.dashboard.recentActivity.savedHotelsSection')}</h2>
          
          <div className="text-center py-8 text-foreground/60 bg-[#a54afe]">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{savedHotelsCount > 0 ? `${savedHotelsCount} ${t('userDashboard.dashboard.recentActivity.savedHotelsSection').toLowerCase()}` : t('userDashboard.dashboard.recentActivity.noSavedHotels')}</p>
            <p className="text-sm mt-2">{t('userDashboard.dashboard.recentActivity.noSavedHotelsDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
