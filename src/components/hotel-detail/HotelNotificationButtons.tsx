
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, TrendingDown, Calendar } from 'lucide-react';
import { useUserNotifications } from '@/hooks/useUserNotifications';
import { useAuth } from '@/context/AuthContext';

interface HotelNotificationButtonsProps {
  hotelId: string;
  isAvailable?: boolean;
}

export const HotelNotificationButtons: React.FC<HotelNotificationButtonsProps> = ({ 
  hotelId, 
  isAvailable = false 
}) => {
  const { user } = useAuth();
  const { loading, addNotification, removeNotification, hasNotification } = useUserNotifications(hotelId);

  if (!user) {
    return null; // Don't show notification buttons to non-authenticated users
  }

  const handleAvailabilityNotification = () => {
    if (hasNotification('availability')) {
      removeNotification('availability');
    } else {
      addNotification('availability');
    }
  };

  const handlePriceNotification = () => {
    if (hasNotification('price')) {
      removeNotification('price');
    } else {
      addNotification('price');
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Availability notification - only show if hotel is not currently available */}
      {!isAvailable && (
        <Button
          variant={hasNotification('availability') ? "default" : "outline"}
          onClick={handleAvailabilityNotification}
          disabled={loading}
          className="w-full flex items-center gap-2"
        >
          {hasNotification('availability') ? (
            <>
              <BellOff className="w-4 h-4" />
              Stop availability alerts
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Notify me when available
            </>
          )}
        </Button>
      )}

      {/* Price drop notification */}
      <Button
        variant={hasNotification('price') ? "default" : "outline"}
        onClick={handlePriceNotification}
        disabled={loading}
        className="w-full flex items-center gap-2"
      >
        {hasNotification('price') ? (
          <>
            <BellOff className="w-4 h-4" />
            Stop price alerts
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4" />
            Notify me if price drops
          </>
        )}
      </Button>
    </div>
  );
};
