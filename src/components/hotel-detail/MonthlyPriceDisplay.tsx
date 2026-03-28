import React from 'react';
import { useMonthlyPriceFromPackages } from '@/hooks/useMonthlyPriceFromPackages';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

interface MonthlyPriceDisplayProps {
  hotelId: string;
  currency?: string;
  fallbackPrice?: number;
}

export const MonthlyPriceDisplay: React.FC<MonthlyPriceDisplayProps> = ({
  hotelId,
  currency = "USD",
  fallbackPrice
}) => {
  const { t, language } = useTranslationWithFallback('hotel');
  const { monthlyPrice, isLoading, hasPackages } = useMonthlyPriceFromPackages(hotelId, currency);

  // Debug Romanian translation
  console.log('🇷🇴 MonthlyPriceDisplay Debug:', {
    language,
    translation: t('detail.perMonth29Days'),
    fallbackTest: t('perMonth29Days'),
    hasPackages,
    monthlyPrice
  });

  // Determine which price to display
  const displayPrice = hasPackages && monthlyPrice ? monthlyPrice : fallbackPrice;
  const showFromLabel = hasPackages && monthlyPrice; // Only show "from" when calculated from packages

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="h-6 bg-white/20 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!displayPrice) {
    return (
      <div className="text-center">
        <div className="text-lg text-white/70">
          Price on request
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-base font-bold text-white mb-3 text-center">
        Monthly price: starting from
      </h3>
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
          }).format(displayPrice)}
        </div>
        <div className="text-sm text-purple-200">
          {t('detail.perMonth29Days')}
        </div>
      </div>
    </>
  );
};