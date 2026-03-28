import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { SEOMetadata } from '@/components/SEOMetadata';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';
import LeaderLivingLayout from '@/components/leaderliving/LeaderLivingLayout';
import { PresentationTab } from '@/components/leaderliving/tabs/PresentationTab';
import { MyGroupsTab } from '@/components/leaderliving/tabs/MyGroupsTab';
import { ProposeGroupTab } from '@/components/leaderliving/tabs/ProposeGroupTab';
import { PublicPageTab } from '@/components/leaderliving/tabs/PublicPageTab';
import { HotelProposalsTab } from '@/components/leaderliving/tabs/HotelProposalsTab';
import { FinancesTab } from '@/components/leaderliving/tabs/FinancesTab';
import { MyDataTab } from '@/components/leaderliving/tabs/MyDataTab';

export default function DashboardLeaderLivingNew() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Developer bypass: Allow unrestricted access in Lovable environment
        if (isLovableDevelopmentMode()) {
          console.log('DashboardLeaderLiving: Developer override active, granting access');
          setUser({
            id: 'dev-user',
            email: 'developer@lovable.app'
          });
          setProfile({
            id: 'dev-user',
            first_name: 'Developer',
            last_name: 'User',
            email: 'developer@lovable.app'
          });
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/login/leaderliving');
          return;
        }

        setUser(session.user);

        // Check if user has leaderliving role
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'leaderliving');

        if (!userRoles || userRoles.length === 0) {
          toast.error('Access denied. This account is not registered as Líder Living.');
          await supabase.auth.signOut();
          navigate('/login/leaderliving');
          return;
        }

        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        setProfile(profileData);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login/leaderliving');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes - skip in dev mode
    if (!isLovableDevelopmentMode()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session?.user) {
          navigate('/login/leaderliving');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <SEOMetadata 
        title="Panel Líder Living | Hotel-Living" 
        description="Manage your Líder Living groups, track commissions and build your community." 
        url={typeof window !== 'undefined' ? window.location.href : "https://hotel-living.com/dashboard/leaderliving"} 
      />
      
      <LeaderLivingLayout>
        <Routes>
          <Route path="/" element={<PresentationTab />} />
          <Route path="/my-groups" element={<MyGroupsTab />} />
          <Route path="/propose-group" element={<ProposeGroupTab />} />
          <Route path="/public-page" element={<PublicPageTab />} />
          <Route path="/hotel-proposals" element={<HotelProposalsTab />} />
          <Route path="/finances" element={<FinancesTab />} />
          <Route path="/my-data" element={<MyDataTab />} />
        </Routes>
      </LeaderLivingLayout>
    </>
  );
}