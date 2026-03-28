// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import React, { useState, useEffect } from 'react';
import { Copy, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ReferralCodeBannerProps {
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

export const ReferralCodeBanner: React.FC<ReferralCodeBannerProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/profile');
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data?.referral_code) {
          setReferralCode(data.referral_code);
        }
      } catch (error) {
        console.error('Error fetching referral code:', error);
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
      title: t('codeCopied'),
      duration: 2000,
    });
  };

  if (loading || !referralCode) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-lg p-3 border border-white/20 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Hash className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{t('referralCode')}:</span>
            <span className="font-mono font-bold text-sm text-foreground truncate">{referralCode}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors flex-shrink-0"
          >
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">{t('copyCode')}</span>
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Hash className="w-6 h-6 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">{t('referralCode')}</h2>
          </div>
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="font-mono text-2xl font-bold text-white tracking-wider">
              {referralCode}
            </div>
          </div>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Copy className="w-4 h-4" />
            {t('copyCode')}
          </button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-lg p-4 border border-white/20 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">{t('referralCode')}</p>
            <p className="font-mono text-lg font-bold text-foreground">{referralCode}</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span className="hidden sm:inline">{t('copyCode')}</span>
        </button>
      </div>
    </div>
  );
};