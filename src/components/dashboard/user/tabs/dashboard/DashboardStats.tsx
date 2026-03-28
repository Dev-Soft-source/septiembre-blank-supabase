
import React from "react";
import DashboardCard from "../../DashboardCard";
import { Calendar, CalendarCheck, Building } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

interface DashboardStatsProps {
  bookingsCount: number;
  completedStaysCount: number;
  savedHotelsCount: number;
  isLoading: boolean;
}

export default function DashboardStats({
  bookingsCount,
  completedStaysCount,
  savedHotelsCount,
  isLoading
}: DashboardStatsProps) {
  const { t } = useTranslation('dashboard/stats');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="animate-pulse h-28 bg-fuchsia-500/10 rounded-xl"></div>
        <div className="animate-pulse h-28 bg-fuchsia-500/10 rounded-xl"></div>
        <div className="animate-pulse h-28 bg-fuchsia-500/10 rounded-xl"></div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <DashboardCard 
        title={t('upcomingStays')} 
        value={bookingsCount.toString()} 
        icon={<Calendar className="w-6 h-6" />} 
        color="fuchsia" 
      />
      <DashboardCard 
        title={t('completedStays')} 
        value={completedStaysCount.toString()} 
        icon={<CalendarCheck className="w-6 h-6" />} 
        color="cyan" 
      />
      <DashboardCard 
        title={t('savedHotels')} 
        value={savedHotelsCount.toString()} 
        icon={<Building className="w-6 h-6" />} 
        color="amber" 
      />
    </div>
  );
}
