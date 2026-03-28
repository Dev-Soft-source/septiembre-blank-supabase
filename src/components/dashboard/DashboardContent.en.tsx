
import React from 'react';
import { ArrowUp, BarChart2, Building, Calendar, Star, Users, Clock, Sparkles, MessageSquare } from 'lucide-react';
import StatCard from './StatCard';
import ActionCard from './ActionCard';
import { useReviewNotifications } from '@/hooks/useReviewNotifications';
import { Button } from '@/components/ui/button';
import { ReferralCodeBanner } from '@/components/dashboard/shared/ReferralCodeBanner';

interface DashboardContentENProps {
  setActiveTab?: (tab: string) => void;
}

export const DashboardContentEN = ({ setActiveTab }: DashboardContentENProps = {}) => {
  const {
    notifications,
    newNotificationsCount,
    loading: notificationsLoading
  } = useReviewNotifications();
  
  const stats = [{
    title: 'Total Bookings',
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: <Calendar className="w-4 h-4" />
  }, {
    title: 'Revenue',
    value: '$0',
    change: '0%',
    trend: 'neutral',
    icon: <BarChart2 className="w-4 h-4" />
  }, {
    title: 'Average Rating',
    value: '0.0',
    change: '0.0',
    trend: 'neutral',
    icon: <Star className="w-4 h-4" />
  }, {
    title: 'Guests',
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: <Users className="w-4 h-4" />
  }];
  
  const actions = [{
    title: 'Add Property',
    description: 'List a new property on our platform',
    icon: <Building className="w-5 h-5" />,
    onClick: () => setActiveTab?.('properties')
  }, {
    title: 'View Bookings',
    description: 'Manage your current reservations',
    icon: <Calendar className="w-5 h-5" />,
    onClick: () => setActiveTab?.('bookings')
  }, {
    title: 'View Analytics',
    description: 'Track your performance metrics',
    icon: <BarChart2 className="w-5 h-5" />,
    onClick: () => setActiveTab?.('analytics')
  }, {
    title: 'Manage Reviews',
    description: 'Respond to guest feedback',
    icon: <MessageSquare className="w-5 h-5" />,
    onClick: () => setActiveTab?.('reviews')
  }];
  
  return <div className="space-y-8">
      {/* Referral Code Banner */}
      <ReferralCodeBanner variant="compact" />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatCard key={`stat-${stat.title}-${i}`} {...stat} />)}
      </div>

      {/* Welcome Message for New Hotel Owners */}
      <div className="glass-card rounded-2xl p-6 border border-fuchsia-500/20 bg-[#7a0486]">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Welcome to Hotel-Living</h2>
        <p className="text-sm sm:text-base text-foreground/80 mb-4">
          Start your journey as a Hotel-Living partner. Add your first property to get started.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, i) => <ActionCard key={`action-${action.title}-${i}`} {...action} />)}
        </div>
      </div>

      {/* Two Column Layout for Reviews and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews with Notifications */}
        <div className="glass-card rounded-2xl p-6 bg-[#7a0486]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Reviews</h2>
          </div>
          
          <div className="text-center py-8 text-foreground/60 bg-[#9939f9]">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet</p>
            <p className="text-sm mt-2">Reviews from guests will appear here</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="glass-card rounded-2xl p-6 bg-[#5d0478]">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Bookings</h2>
          
          <div className="text-center py-8 text-foreground/60 bg-[#a54afe]">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No bookings yet</p>
            <p className="text-sm mt-2">New bookings will appear here</p>
          </div>
        </div>
      </div>
    </div>;
};

export default DashboardContentEN;
