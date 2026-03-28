
import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { BookingStatus } from '@/types/booking';

interface BookingStatusBadgeProps {
  status: string;
  className?: string;
}

export const BookingStatusBadge = ({ status, className }: BookingStatusBadgeProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BookingStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      case BookingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusColor(status),
        className
      )}
    >
      {t(`booking.status.${status}`)}
    </span>
  );
};
