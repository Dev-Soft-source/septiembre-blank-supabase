
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/useTranslation';

interface NotificationsCardProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  bookingConfirmations: boolean;
  setBookingConfirmations: (value: boolean) => void;
  reviewAlerts: boolean;
  setReviewAlerts: (value: boolean) => void;
  paymentNotifications: boolean;
  setPaymentNotifications: (value: boolean) => void;
}

export const NotificationsCard = ({
  emailNotifications,
  setEmailNotifications,
  bookingConfirmations,
  setBookingConfirmations,
  reviewAlerts,
  setReviewAlerts,
  paymentNotifications,
  setPaymentNotifications
}: NotificationsCardProps) => {
  const { t } = useTranslation('dashboard/settings');
  
  return (
    <Card>
      <CardHeader className="bg-[#7a0486] border border-white">
        <CardTitle>{t('notificationPreferences')}</CardTitle>
        <CardDescription>{t('notificationPreferencesDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 bg-[#860493] border-x border-b border-white">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">{t('emailNotifications')}</Label>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>
        
        <div className="space-y-4 pt-4 border-t border-white">
          <h4 className="font-medium">{t('notificationTypes')}</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">{t('newBookingConfirmations')}</Label>
            </div>
            <Switch checked={bookingConfirmations} onCheckedChange={setBookingConfirmations} disabled={!emailNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">{t('reviewAlerts')}</Label>
            </div>
            <Switch checked={reviewAlerts} onCheckedChange={setReviewAlerts} disabled={!emailNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">{t('paymentNotifications')}</Label>
            </div>
            <Switch checked={paymentNotifications} onCheckedChange={setPaymentNotifications} disabled={!emailNotifications} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
