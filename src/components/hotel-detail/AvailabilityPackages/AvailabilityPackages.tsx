import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { AvailabilityPackagesProps, AvailabilityPackage } from '@/types/availability-package';
import { useRealTimeAvailability } from '@/hooks/useRealTimeAvailability';
import { AvailabilityPackageCard } from './AvailabilityPackageCard';
import { PackageBookingModal } from '@/components/booking/PackageBookingModal';
import { WaitlistModal } from './WaitlistModal';
import { format } from 'date-fns';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { GroupLeaderDisplay } from './GroupLeaderDisplay';
export function AvailabilityPackages({
  hotelId,
  onPackageSelect,
  hotelName,
  pricePerMonth,
  pricingMatrix = [],
  hotelCategory = 3
}: AvailabilityPackagesProps) {
  const {
    t
  } = useTranslationWithFallback('hotel-detail');
  const [selectedPackage, setSelectedPackage] = useState<AvailabilityPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waitlistPackage, setWaitlistPackage] = useState<AvailabilityPackage | null>(null);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const {
    packages,
    isLoading,
    error,
    lastUpdated,
    refreshAvailability
  } = useRealTimeAvailability({
    hotelId
  });
  const handleReserve = (packageData: AvailabilityPackage) => {
    setSelectedPackage(packageData);
    setIsModalOpen(true);
    if (onPackageSelect) {
      onPackageSelect(packageData);
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };
  const handleJoinWaitlist = (packageData: AvailabilityPackage) => {
    setWaitlistPackage(packageData);
    setIsWaitlistModalOpen(true);
  };
  const handleWaitlistClose = () => {
    setIsWaitlistModalOpen(false);
    setWaitlistPackage(null);
  };
  if (error) {
    console.error('AvailabilityPackages error:', error, {
      hotelId
    });
    return <Card className="bg-red-950/20 border-red-500/30">
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-200 mb-2">{t('hotelDetail.errorLoadingPackages')}</h3>
          <p className="text-red-300/80">{error}</p>
          <Button variant="outline" size="sm" onClick={refreshAvailability} className="mt-4 bg-red-800/50 border-red-600/50 text-white hover:bg-red-700/50">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('hotelDetail.tryAgain')}
          </Button>
        </div>
      </Card>;
  }
  return <Card className="bg-[#6000B3] border-border shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">{t('hotelDetail.availableStays')}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <GroupLeaderDisplay hotelId={hotelId} />
            <span className="text-sm text-white/70">
              {t('hotelDetail.updated')} {format(lastUpdated, 'HH:mm')}
            </span>
            <Button variant="outline" size="sm" onClick={refreshAvailability} disabled={isLoading} className="bg-purple-800/50 border-purple-600/50 text-white hover:bg-purple-700/50">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {isLoading ? <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="animate-pulse">
                <div className="h-24 bg-purple-800/30 rounded-lg"></div>
              </div>)}
          </div> : <div className="space-y-4">
            {packages.map(pkg => <AvailabilityPackageCard key={pkg.id} package={pkg} onReserve={handleReserve} onJoinWaitlist={handleJoinWaitlist} hotelName={hotelName} pricePerMonth={pricePerMonth} pricingMatrix={pricingMatrix} mealPlan="half_board" hotelCategory={hotelCategory} />)}
            
            <div className="mt-6 p-4 bg-purple-800/30 border border-purple-600/50 rounded-lg">
              
            </div>
          </div>}
      </div>
      
      {hotelName && (pricePerMonth || pricingMatrix.length > 0) && <>
          <PackageBookingModal isOpen={isModalOpen} onClose={handleModalClose} package={selectedPackage} hotelName={hotelName} hotelId={hotelId} pricePerMonth={pricePerMonth} pricingMatrix={pricingMatrix} />
          
          <WaitlistModal isOpen={isWaitlistModalOpen} onClose={handleWaitlistClose} package={waitlistPackage} hotelName={hotelName} />
        </>}
    </Card>;
}