import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  PlusCircle, 
  ExternalLink, 
  Building2, 
  DollarSign, 
  User,
  LogOut
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const leaderTabs = [
  {
    id: 'presentation',
    path: '/dashboard/leaderliving',
    icon: Heart,
    nameKey: 'tabs.presentation',
    descriptionKey: 'tabs.presentationDesc'
  },
  {
    id: 'my-groups',
    path: '/dashboard/leaderliving/my-groups',
    icon: Users,
    nameKey: 'tabs.myGroups',
    descriptionKey: 'tabs.myGroupsDesc'
  },
  {
    id: 'propose-group',
    path: '/dashboard/leaderliving/propose-group',
    icon: PlusCircle,
    nameKey: 'tabs.proposeGroup',
    descriptionKey: 'tabs.proposeGroupDesc'
  },
  {
    id: 'public-page',
    path: '/dashboard/leaderliving/public-page',
    icon: ExternalLink,
    nameKey: 'tabs.publicPage',
    descriptionKey: 'tabs.publicPageDesc'
  },
  {
    id: 'hotel-proposals',
    path: '/dashboard/leaderliving/hotel-proposals',
    icon: Building2,
    nameKey: 'tabs.hotelProposals',
    descriptionKey: 'tabs.hotelProposalsDesc'
  },
  {
    id: 'finances',
    path: '/dashboard/leaderliving/finances',
    icon: DollarSign,
    nameKey: 'tabs.finances',
    descriptionKey: 'tabs.financesDesc'
  },
  {
    id: 'my-data',
    path: '/dashboard/leaderliving/my-data',
    icon: User,
    nameKey: 'tabs.myData',
    descriptionKey: 'tabs.myDataDesc'
  }
];

interface LeaderLivingLayoutProps {
  children: React.ReactNode;
}

export default function LeaderLivingLayout({ children }: LeaderLivingLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard/leaderliving');

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success(t('actions.logOut'));
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <HotelStarfield />
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="w-64 shadow-lg border-r border-white/20 bg-[#630297]/90 backdrop-blur-sm shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)] relative flex flex-col">
          <div className="p-6 border-b border-white/20">
            <h1 className="text-xl font-bold text-white">{t('title')}</h1>
            <p className="text-sm text-white">Group Leader Panel</p>
          </div>
          
          <nav className="mt-6 flex-1 pb-20">
            <div className="px-3">
              {leaderTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path || 
                  (tab.path === '/dashboard/leaderliving' && location.pathname === '/dashboard/leaderliving');
                
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`
                      relative flex items-center px-3 py-2 mb-1 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-white/20 text-white border-r-2 border-white/50' 
                        : 'text-white hover:bg-white/10'
                      }
                    `}
                    style={{ zIndex: 10 }}
                  >
                    <Icon className="w-5 h-5 mr-3 text-white" />
                    <div className="flex-1">
                      <div className="font-medium text-white">{t(tab.nameKey)}</div>
                      <div className="text-xs text-white opacity-90">{t(tab.descriptionKey)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sign out button in sidebar */}
          <div className="p-4 mt-2" style={{ zIndex: 5 }}>
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('actions.logOut')}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#630297]/90 backdrop-blur-sm shadow-[0_0_60px_rgba(0,200,255,0.8),0_0_120px_rgba(0,200,255,0.4),0_0_180px_rgba(0,200,255,0.2)]">
          <div className="p-8 text-white">
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}