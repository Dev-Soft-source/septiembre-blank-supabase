// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from 'react';
import { Copy, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const TopRightReferralCode: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (!user?.id) {
        console.log('TopRightReferralCode: No user ID available');
        setLoading(false);
        return;
      }
      
      console.log('TopRightReferralCode: Fetching referral code for user:', user.id);
      
      try {
        // Fetch the user's profile code directly
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('code')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) {
          console.error('TopRightReferralCode: Profile database error:', profileError);
        } else if (profileData?.code) {
          console.log('TopRightReferralCode: Profile code found:', profileData.code);
          setReferralCode(profileData.code);
        } else {
          console.log('TopRightReferralCode: No code found in profile');
        }
      } catch (error) {
        console.error('TopRightReferralCode: Error fetching referral code:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralCode();
  }, [user?.id]);

  const copyToClipboard = () => {
    if (!referralCode) return;
    
    navigator.clipboard.writeText(referralCode);
    toast({
      title: 'Referral code copied!',
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
        <div className="flex items-center gap-2 sm:gap-3">
          <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <span className="text-sm sm:text-lg text-muted-foreground font-semibold">Code:</span>
          <span className="font-mono text-lg sm:text-xl font-bold text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
        <div className="flex items-center gap-2 sm:gap-3">
          <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <span className="text-sm sm:text-lg text-muted-foreground font-semibold">Code:</span>
          <span className="font-mono text-lg sm:text-xl font-bold text-foreground">N/A</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
      <div className="flex items-center gap-2 sm:gap-3">
        <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
        <span className="text-sm sm:text-lg text-muted-foreground font-semibold">Code:</span>
        <span className="font-mono text-lg sm:text-xl font-bold text-foreground">{referralCode}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm sm:text-lg transition-colors ml-1 sm:ml-2"
          title="Copy referral code"
        >
          <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};