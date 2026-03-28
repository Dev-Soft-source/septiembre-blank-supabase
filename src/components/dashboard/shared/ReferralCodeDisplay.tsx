import React from 'react';
import { Hash, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface ReferralCodeDisplayProps {
  code: string;
  className?: string;
  variant?: 'card' | 'banner' | 'inline';
}

export const ReferralCodeDisplay: React.FC<ReferralCodeDisplayProps> = ({ 
  code, 
  className = '', 
  variant = 'inline' 
}) => {
  const { toast } = useToast();
  const { t } = useTranslation('dashboard/profile');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: t('codeCopied'),
      duration: 2000,
    });
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-4 border border-white/20 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white/80 text-sm">{t('referralCode')}</p>
              <p className="text-white font-mono text-lg font-bold">{code}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Copy className="w-4 h-4 mr-2" />
            {t('copyCode')}
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white/5 border border-white/10 rounded-lg p-4 ${className}`}>
        <div className="space-y-2">
          <label className="block text-white/80 mb-2 flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-400" />
            {t('referralCode')}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono">
              {code}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Hash className="w-4 h-4" />
        {t('referralCode')}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 font-mono bg-muted px-3 py-2 rounded-md text-sm">
          {code}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};