import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HotelStarfield } from '@/components/hotels/HotelStarfield';
import { SEOMetadata } from '@/components/SEOMetadata';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, LogOut } from 'lucide-react';
import GroupBookingIntegrationContent from '@/components/leaderliving/GroupBookingIntegrationContent';
interface InvitedPerson {
  id: string;
  name: string;
  status: 'pending' | 'confirmed';
  comment?: string;
}
export default function DashboardLeaderLiving() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invitedPeople, setInvitedPeople] = useState<InvitedPerson[]>([]);
  // Removed showAddPerson and newPerson states as per requirements

  const navigate = useNavigate();
  const {
    t
  } = useTranslation('dashboard/leaderliving');

  // Generate mock leader code (in real app, this would come from database)
  const leaderCode = `FR${Math.floor(Math.random() * 9000) + 1000}`;
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
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/login/leaderliving');
          return;
        }
        setUser(session.user);

        // Check if user has leaderliving role
        const {
          data: userRoles
        } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'leaderliving');
        if (!userRoles || userRoles.length === 0) {
          toast.error('Access denied. This account is not registered as Líder Living.');
          await supabase.auth.signOut();
          navigate('/login/leaderliving');
          return;
        }

        // Get user profile
        const {
          data: profileData
        } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
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
      const {
        data: {
          subscription
        }
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session?.user) {
          navigate('/login/leaderliving');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [navigate]);
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t('actions.logOut'));
      window.location.href = '/'; // Direct redirect to ensure proper logout
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  // Critical: Monitor auth state and redirect immediately on logout
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, redirecting to home");
        window.location.href = '/';
      }
    };
    checkAuth();
  }, []);
  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  const handleCopyCode = () => {
    copyToClipboard(leaderCode, t('notifications.codeCopied'));
  };
  const handleInvitePeople = () => {
    const message = t('quickActions.inviteMessage', {
      code: leaderCode
    });
    copyToClipboard(message, t('notifications.inviteMessageCopied'));
  };

  // Removed handleAddPerson and handleDeletePerson functions as per requirements

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen flex flex-col">
    <SEOMetadata title="Panel Líder Living | Hotel-Living" description="Manage your Líder Living groups, track commissions and build your community." url={typeof window !== 'undefined' ? window.location.href : "https://hotel-living.com/dashboard/leaderliving"} />

    <HotelStarfield />
    <Navbar />

    <main className="flex-1 pt-16">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="bg-[#630297]/90 backdrop-blur-sm rounded-lg p-8 text-white shadow-[0_0_60px_rgba(0,200,255,0.8)]">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <Button variant="outline" onClick={handleSignOut} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <LogOut className="w-4 h-4 mr-2" />
              {t('actions.logOut')}
            </Button>
          </div>

          {/* SECTION A - Welcome & Personal Code */}
          <div className="bg-[#7E26A6] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('welcome.title')}</h2>
            <p className="text-white/90 mb-6 leading-relaxed">
              {t('welcome.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('welcome.personalCode')}</label>
                <div className="flex gap-2">
                  <Input value={leaderCode} readOnly className="bg-white/20 border-white/30 text-white font-mono text-lg" />
                  <Button onClick={handleCopyCode} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Button onClick={handleCopyCode} className="w-full bg-white/20 hover:bg-white/30 border border-white/30">
                  {t('welcome.copyCode')}
                </Button>
              </div>
            </div>

            <p className="text-white/80 text-sm mt-4">
              {t('welcome.shareMessage')}
            </p>
          </div>

          {/* SECTION B - Mi Grupo */}
          <div className="bg-white/10 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t('myGroup.title')}</h2>

            {/* Group Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-sm">{t('myGroup.groupSummary.title')}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/70">{t('myGroup.groupSummary.linkedHotel')}: </span>
                    <span className="text-white/90">{t('myGroup.groupSummary.noHotel')}</span>
                  </div>
                  <div>
                    <span className="text-white/70">{t('myGroup.groupSummary.affinity')}: </span>
                    <span className="text-white/90">{t('myGroup.groupSummary.noAffinity')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-sm">{t('myGroup.accumulatedBonuses.title')}</h3>
                <div className="text-2xl font-bold text-green-400">USD $0.00</div>
                <div className="text-sm text-white/70">{t('myGroup.accumulatedBonuses.total')}</div>
                <div className="text-xs text-white/60 mt-2 italic">
                  {t('myGroup.accumulatedBonuses.bonusNote')}
                </div>
              </div>
            </div>

            {/* Invited People - Remove Add Person button and functionality */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">

                {/* Removed Add Person button as per requirements */}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-white/10 rounded-lg overflow-hidden">
                  <thead className="bg-white/20">
                    <tr>
                      <th className="px-4 py-3 text-left">{t('myGroup.invitedPeople.name')}</th>
                      <th className="px-4 py-3 text-left">{t('myGroup.invitedPeople.status')}</th>
                      <th className="px-4 py-3 text-left">{t('myGroup.invitedPeople.comment')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-white/60">
                        Participants will be added automatically when they purchase packages
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION C - Public Page Link */}
          <div className="bg-white/10 rounded-lg p-6 mb-8">
            <Button variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 p-6 h-auto">
              <div className="text-center">
                <ExternalLink className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{t('publicPage.link')}</div>
              </div>
            </Button>
          </div>

          {/* SECTION D - Booking Integration & Hotel Communication */}
          <div className="bg-white/10 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Group Management</h2>

            <div className="space-y-6">
              <GroupProposalForm />
              <GroupBookingIntegrationContent />
            </div>
          </div>

          {/* Footer message */}
          <div className="text-center text-white/70 text-sm">
            {t('footer.message')}
          </div>
        </div>
      </div>
    </main>
  </div>;
}

// Group Proposal Form Component
const GroupProposalForm = () => {
  const {
    t
  } = useTranslation('dashboard/leaderliving');
  const [formData, setFormData] = useState({
    groupTopic: '',
    proposedHotel: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupTopic.trim() || !formData.proposedHotel.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      // Group proposals feature discontinued
      console.log('Group proposals feature discontinued:', formData);
      toast.error("Feature Discontinued: Group proposals feature is no longer available.");
      setFormData({
        groupTopic: '',
        proposedHotel: ''
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="bg-white/10 rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4">{t('myGroups.proposeGroup.title')}</h3>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          {t('myGroups.proposeGroup.groupTopic')}
        </label>
        <Input value={formData.groupTopic} onChange={e => setFormData({
          ...formData,
          groupTopic: e.target.value
        })} className="bg-white/20 border-white/30 text-white placeholder:text-white/60" placeholder={t('myGroups.proposeGroup.groupTopic')} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          {t('myGroups.proposeGroup.proposedHotel')}
        </label>
        <Input value={formData.proposedHotel} onChange={e => setFormData({
          ...formData,
          proposedHotel: e.target.value
        })} className="bg-white/20 border-white/30 text-white placeholder:text-white/60" placeholder={t('myGroups.proposeGroup.proposedHotel')} required />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00C8FF] hover:bg-[#00A8DF] text-white">
        {isSubmitting ? 'Submitting...' : t('myGroups.proposeGroup.submit')}
      </Button>
    </form>
  </div>;
};