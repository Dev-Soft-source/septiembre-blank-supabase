
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { useBookingOperations } from '@/hooks/useBookingOperations';
import { format } from 'date-fns';

interface BookingModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export const BookingModificationModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onSuccess 
}: BookingModificationModalProps) => {
  const { t } = useTranslation();
  const { modifyBooking, loading } = useBookingOperations();
  const [newCheckIn, setNewCheckIn] = useState(
    booking ? format(new Date(booking.check_in), 'yyyy-MM-dd') : ''
  );
  const [newCheckOut, setNewCheckOut] = useState(
    booking ? format(new Date(booking.check_out), 'yyyy-MM-dd') : ''
  );

  const handleSave = async () => {
    if (!booking || !newCheckIn || !newCheckOut) return;

    if (window.confirm(t('booking.actions.confirmModify'))) {
      const success = await modifyBooking(booking.id, newCheckIn, newCheckOut);
      if (success) {
        onSuccess();
        onClose();
      }
    }
  };

  const handleCancel = () => {
    setNewCheckIn(booking ? format(new Date(booking.check_in), 'yyyy-MM-dd') : '');
    setNewCheckOut(booking ? format(new Date(booking.check_out), 'yyyy-MM-dd') : '');
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('booking.modify.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="newCheckIn">{t('booking.modify.newCheckIn')}</Label>
              <Input
                id="newCheckIn"
                type="date"
                value={newCheckIn}
                onChange={(e) => setNewCheckIn(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            
            <div>
              <Label htmlFor="newCheckOut">{t('booking.modify.newCheckOut')}</Label>
              <Input
                id="newCheckOut"
                type="date"
                value={newCheckOut}
                onChange={(e) => setNewCheckOut(e.target.value)}
                min={newCheckIn}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              {t('booking.modify.cancel')}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading || !newCheckIn || !newCheckOut || newCheckIn >= newCheckOut}
            >
              {loading ? t('booking.actions.modifying') : t('booking.modify.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
