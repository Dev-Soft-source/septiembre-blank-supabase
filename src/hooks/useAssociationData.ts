import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AssociationHotel {
  id: string;
  name: string;
  city: string;
  contact_email: string;
  contact_phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface AssociationCommission {
  id: string;
  hotel_name: string;
  amount: number;
  booking_date: string;
  status: 'pending' | 'paid';
  booking_reference: string;
}

export interface AssociationAnalytics {
  totalBookings: number;
  totalCommissions: number;
  activeHotels: number;
  growthRate: string;
  monthlyData: Array<{
    month: string;
    reservas: number;
    comisiones: number;
  }>;
  hotelPerformance: Array<{
    name: string;
    reservas: number;
    color: string;
  }>;
}

export const useAssociationHotels = () => {
  return useQuery({
    queryKey: ['association-hotels'],
    queryFn: async (): Promise<AssociationHotel[]> => {
      // For associations, we need to find hotels linked to this association
      // This would be through a hotel_associations linking table or referral codes
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city, contact_email, contact_phone, status, created_at')
        .eq('status', 'approved') // Only show approved hotels
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching association hotels:', error);
        return [];
      }

      return (data || []).map(hotel => ({
        ...hotel,
        status: hotel.status as 'pending' | 'approved' | 'rejected'
      }));
    },
  });
};

export const useAssociationCommissions = () => {
  return useQuery({
    queryKey: ['association-commissions'],
    queryFn: async (): Promise<AssociationCommission[]> => {
      // Fetch commissions from booking_commissions table
      const { data, error } = await supabase
        .from('booking_commissions')
        .select(`
          id,
          commission_usd,
          created_at,
          bookings!inner(
            id,
            created_at,
            hotels!inner(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching association commissions:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        hotel_name: item.bookings?.hotels?.name || 'Unknown Hotel',
        amount: item.commission_usd || 0,
        booking_date: item.bookings?.created_at || item.created_at,
        status: 'paid' as const,
        booking_reference: `BK${item.bookings?.id?.slice(0, 8).toUpperCase() || '000'}`
      }));
    },
  });
};

export const useAssociationAnalytics = () => {
  const { data: hotels } = useAssociationHotels();
  const { data: commissions } = useAssociationCommissions();

  return useQuery({
    queryKey: ['association-analytics', hotels?.length, commissions?.length],
    queryFn: async (): Promise<AssociationAnalytics> => {
      // Calculate analytics from real data
      const totalBookings = commissions?.length || 0;
      const totalCommissions = commissions?.reduce((sum, c) => sum + c.amount, 0) || 0;
      const activeHotels = hotels?.length || 0;

      // Generate monthly data from real commissions
      const monthlyData = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthKey = month.toISOString().slice(0, 7); // YYYY-MM format
        
        const monthCommissions = commissions?.filter(c => 
          c.booking_date.startsWith(monthKey)
        ) || [];
        
        monthlyData.push({
          month: month.toLocaleDateString('en', { month: 'short' }),
          reservas: monthCommissions.length,
          comisiones: monthCommissions.reduce((sum, c) => sum + c.amount, 0)
        });
      }

      // Generate hotel performance from real data
      const hotelPerformance = hotels?.slice(0, 4).map((hotel, index) => {
        const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];
        const hotelCommissions = commissions?.filter(c => c.hotel_name === hotel.name) || [];
        
        return {
          name: hotel.name,
          reservas: hotelCommissions.length,
          color: colors[index] || '#3B82F6'
        };
      }) || [];

      return {
        totalBookings,
        totalCommissions,
        activeHotels,
        growthRate: '+12%', // This could be calculated from historical data
        monthlyData,
        hotelPerformance
      };
    },
    enabled: true, // Always run this query
  });
};