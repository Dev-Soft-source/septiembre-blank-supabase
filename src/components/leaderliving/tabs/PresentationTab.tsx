import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export const PresentationTab: React.FC = () => {
  const { t } = useTranslation('dashboard/leaderliving');
  
  // Generate mock leader code (in real app, this would come from database)
  const leaderCode = `FR${Math.floor(Math.random() * 9000) + 1000}`;

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
    const message = t('quickActions.inviteMessage', { code: leaderCode });
    copyToClipboard(message, t('notifications.inviteMessageCopied'));
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Personal Code */}
      <div className="bg-[#7E26A6] rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{t('welcome.title')}</h2>
        <p className="text-white/90 mb-6 leading-relaxed">
          {t('welcome.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('welcome.personalCode')}</label>
            <div className="flex gap-2">
              <Input 
                value={leaderCode} 
                readOnly 
                className="bg-white/20 border-white/30 text-white font-mono text-lg" 
              />
              <Button 
                onClick={handleCopyCode} 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <Button 
              onClick={handleInvitePeople} 
              className="w-full bg-white/20 hover:bg-white/30 border border-white/30"
            >
              {t('quickActions.invitePeople')}
            </Button>
          </div>
        </div>
        
        <p className="text-white/80 text-sm mt-4">
          {t('welcome.shareMessage')}
        </p>
      </div>

      {/* Group Summary */}
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t('myGroup.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Participants Table */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">{t('myGroup.invitedPeople.title')}</h3>
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

      {/* Footer message */}
      <div className="text-center text-white/70 text-sm">
        {t('footer.message')}
      </div>
    </div>
  );
};