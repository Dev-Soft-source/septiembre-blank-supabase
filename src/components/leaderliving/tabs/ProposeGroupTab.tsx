import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { isLovableDevelopmentMode } from '@/utils/dashboardSecurity';

export const ProposeGroupTab: React.FC = () => {
  const { t } = useTranslation('dashboard/leaderliving');
  const [formData, setFormData] = useState({
    groupTopic: '',
    proposedHotel: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Group proposals feature has been discontinued
    toast.error('Group proposal feature is currently discontinued. Please contact support for assistance.');
    return;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t('myGroups.proposeGroup.title')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              {t('myGroups.proposeGroup.groupTopic')}
            </label>
            <Input
              value={formData.groupTopic}
              onChange={(e) => setFormData({ ...formData, groupTopic: e.target.value })}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              placeholder={t('myGroups.proposeGroup.groupTopic')}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              {t('myGroups.proposeGroup.proposedHotel')}
            </label>
            <Input
              value={formData.proposedHotel}
              onChange={(e) => setFormData({ ...formData, proposedHotel: e.target.value })}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              placeholder={t('myGroups.proposeGroup.proposedHotel')}
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00C8FF] hover:bg-[#00A8DF] text-white"
          >
            {isSubmitting ? 'Submitting...' : t('myGroups.proposeGroup.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};