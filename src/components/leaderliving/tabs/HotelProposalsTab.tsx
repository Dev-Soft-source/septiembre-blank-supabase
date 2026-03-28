import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

interface HotelProposal {
  id: string;
  hotel_name: string;
  city: string;
  affinity?: string;
  proposed_dates: string;
  available_rooms: number;
  hotel_url?: string;
  created_at: string;
}

export const HotelProposalsTab: React.FC = () => {
  const { t } = useTranslation('dashboard/leaderliving');
  const [proposals, setProposals] = useState<HotelProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHotelProposals();
  }, []);

  const fetchHotelProposals = async () => {
    try {
      setIsLoading(true);
      
      // For now, using mock data since we don't have hotel proposals table yet
      // In production, this would query the actual hotel_proposals table
      const mockProposals: HotelProposal[] = [
        {
          id: '1',
          hotel_name: 'Hotel Paradise Resort',
          city: 'Cancun, Mexico',
          affinity: 'Beach & Relaxation',
          proposed_dates: 'March 15-22, 2024',
          available_rooms: 25,
          hotel_url: '/hotels/paradise-resort',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          hotel_name: 'Mountain View Lodge',
          city: 'Aspen, Colorado',
          affinity: 'Adventure & Nature',
          proposed_dates: 'April 10-17, 2024',
          available_rooms: 15,
          hotel_url: '/hotels/mountain-lodge',
          created_at: new Date().toISOString()
        }
      ];

      // Only show mock data in development mode
      if (isLovableDevelopmentMode()) {
        setProposals(mockProposals);
      } else {
        setProposals([]);
      }
    } catch (error) {
      console.error('Error fetching hotel proposals:', error);
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading hotel proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t('hotelProposals.title')}</h2>
        
        {proposals.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <p className="text-lg mb-4">{t('hotelProposals.noProposals')}</p>
            <p className="text-sm">{t('hotelProposals.noProposalsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-white/10 rounded-lg p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1">
                      {t('hotelProposals.fields.hotelName')}
                    </label>
                    <p className="text-white font-semibold">{proposal.hotel_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1">
                      {t('hotelProposals.fields.city')}
                    </label>
                    <p className="text-white">{proposal.city}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1">
                      {t('hotelProposals.fields.affinity')}
                    </label>
                    <p className="text-white">{proposal.affinity || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1">
                      {t('hotelProposals.fields.proposedDates')}
                    </label>
                    <p className="text-white">{proposal.proposed_dates}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1">
                      {t('hotelProposals.fields.availableRooms')}
                    </label>
                    <p className="text-white font-semibold">{proposal.available_rooms} rooms</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1">
                      {t('hotelProposals.fields.hotelPage')}
                    </label>
                    {proposal.hotel_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        onClick={() => window.open(proposal.hotel_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Hotel
                      </Button>
                    ) : (
                      <p className="text-white/60 text-sm">Not available</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};