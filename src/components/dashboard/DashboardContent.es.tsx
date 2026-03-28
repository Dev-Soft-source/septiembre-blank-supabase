
import React from 'react';
import { ArrowUp, BarChart2, Building, Calendar, Star, Users, Clock, Sparkles, MessageSquare } from 'lucide-react';
import StatCard from './StatCard';
import ActionCard from './ActionCard';
import { useReviewNotifications } from '@/hooks/useReviewNotifications';
import { Button } from '@/components/ui/button';
import { ReferralCodeBanner } from '@/components/dashboard/shared/ReferralCodeBanner';

interface DashboardContentESProps {
  setActiveTab?: (tab: string) => void;
}

export const DashboardContentES = ({ setActiveTab }: DashboardContentESProps = {}) => {
  const {
    notifications,
    newNotificationsCount,
    loading: notificationsLoading
  } = useReviewNotifications();
  
  const stats = [{
    title: 'Reservas Totales',
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: <Calendar className="w-4 h-4" />
  }, {
    title: 'Ingresos',
    value: '$0',
    change: '0%',
    trend: 'neutral',
    icon: <BarChart2 className="w-4 h-4" />
  }, {
    title: 'Calificación Promedio',
    value: '0.0',
    change: '0.0',
    trend: 'neutral',
    icon: <Star className="w-4 h-4" />
  }, {
    title: 'Huéspedes',
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: <Users className="w-4 h-4" />
  }];
  
  const actions = [{
    title: 'Agregar Propiedad',
    description: 'Lista una nueva propiedad en nuestra plataforma',
    icon: <Building className="w-5 h-5" />,
    onClick: () => setActiveTab?.('properties')
  }, {
    title: 'Ver Reservas',
    description: 'Gestiona tus reservaciones actuales',
    icon: <Calendar className="w-5 h-5" />,
    onClick: () => setActiveTab?.('bookings')
  }, {
    title: 'Ver Analíticas',
    description: 'Rastrea tus métricas de rendimiento',
    icon: <BarChart2 className="w-5 h-5" />,
    onClick: () => setActiveTab?.('analytics')
  }, {
    title: 'Gestionar Reseñas',
    description: 'Responde a los comentarios de los huéspedes',
    icon: <MessageSquare className="w-5 h-5" />,
    onClick: () => setActiveTab?.('reviews')
  }];
  
  return <div className="space-y-6">
      {/* Referral Code Banner */}
      <ReferralCodeBanner variant="compact" />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => <StatCard key={`stat-${stat.title}-${i}`} {...stat} />)}
      </div>

      {/* Welcome Message for New Hotel Owners */}
      <div className="glass-card rounded-2xl p-4 border border-fuchsia-500/20 bg-[#7a0486]">
        <h2 className="text-sm sm:text-base font-semibold mb-2">Bienvenido a Hotel-Living</h2>
        <p className="text-xs sm:text-sm text-foreground/80 mb-3">
          Comienza tu viaje como socio de Hotel-Living. Agrega tu primera propiedad para empezar.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-4 bg-[#7a0486]">
        <h2 className="text-sm sm:text-base font-semibold mb-3">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, i) => <ActionCard key={`action-${action.title}-${i}`} {...action} />)}
        </div>
      </div>

      {/* Two Column Layout for Reviews and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Reviews with Notifications */}
        <div className="glass-card rounded-2xl p-4 bg-[#7a0486]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm sm:text-base font-semibold">Reseñas Recientes</h2>
          </div>
          
          <div className="text-center py-6 text-foreground/60 bg-[#9939f9]">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">No hay reseñas aún</p>
            <p className="text-xs mt-1">Las reseñas de los huéspedes aparecerán aquí</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="glass-card rounded-2xl p-4 bg-[#5d0478]">
          <h2 className="text-sm sm:text-base font-semibold mb-3">Reservas Recientes</h2>
          
          <div className="text-center py-6 text-foreground/60 bg-[#a54afe]">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">No hay reservas aún</p>
            <p className="text-xs mt-1">Las nuevas reservas aparecerán aquí</p>
          </div>
        </div>
      </div>
    </div>;
};

export default DashboardContentES;
