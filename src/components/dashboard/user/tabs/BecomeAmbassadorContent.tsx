import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Star, Send } from 'lucide-react';
export default function BecomeAmbassadorContent() {
  const {
    user,
    profile
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    t
  } = useTranslation('dashboard/user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreed) {
      toast({
        title: t('userDashboard.becomeAmbassador.agreementRequired'),
        description: t('userDashboard.becomeAmbassador.agreementMessage'),
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Submit to admin messages for admin review
      const {
        error
      } = await supabase.from('admin_messages').insert({
        user_id: user?.id,
        subject: t('userDashboard.becomeAmbassador.applicationTitle'),
        message: `User ${profile?.first_name || ''} ${profile?.last_name || ''} (${user?.email}) has expressed interest in becoming an ambassador.

Additional Message: ${message || 'No additional message provided.'}`,
        status: 'pending'
      });
      if (error) throw error;
      toast({
        title: t('userDashboard.becomeAmbassador.applicationSubmitted'),
        description: t('userDashboard.becomeAmbassador.applicationSuccess')
      });
      setMessage('');
      setHasAgreed(false);
    } catch (error) {
      console.error('Error submitting ambassador application:', error);
      toast({
        title: t('userDashboard.becomeAmbassador.submissionFailed'),
        description: t('userDashboard.becomeAmbassador.submissionError'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            {t('userDashboard.becomeAmbassador.title')}
          </h2>
        </div>
        
        <p className="text-foreground/80 mb-6">
          {t('userDashboard.becomeAmbassador.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <Star className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-base">Earn Rewards</h3>
            <p className="text-sm text-foreground/70">Get rewards for successful referrals</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <Send className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-base">Share Hotels</h3>
            <p className="text-sm text-foreground/70">Recommend amazing hotels to travelers</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <Star className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-base">Build Network</h3>
            <p className="text-sm text-foreground/70">Connect with hotels and travelers</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">{t('userDashboard.becomeAmbassador.applicationTitle')}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('userDashboard.becomeAmbassador.name')}</label>
              <Input value={`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Not provided'} disabled className="bg-muted" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('userDashboard.becomeAmbassador.email')}</label>
              <Input value={user?.email || 'Not provided'} disabled className="bg-muted" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('userDashboard.becomeAmbassador.additionalMessage')}</label>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t('userDashboard.becomeAmbassador.placeholder')} rows={4} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="agree" checked={hasAgreed} onCheckedChange={checked => setHasAgreed(checked as boolean)} />
            <label htmlFor="agree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('userDashboard.becomeAmbassador.interestMessage')}
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting || !hasAgreed} className="w-full bg-primary hover:bg-primary/80">
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : t('userDashboard.becomeAmbassador.submitApplication')}
          </Button>
        </form>
      </Card>
    </div>;
}