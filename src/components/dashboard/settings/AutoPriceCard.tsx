
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/useTranslation';

interface AutoPriceCardProps {
  enableAutoPrice: boolean;
  setEnableAutoPrice: (value: boolean) => void;
  priceIncreasePercent: string;
  setPriceIncreasePercent: (value: string) => void;
}

export const AutoPriceCard = ({
  enableAutoPrice,
  setEnableAutoPrice,
  priceIncreasePercent,
  setPriceIncreasePercent
}: AutoPriceCardProps) => {
  const { t } = useTranslation('dashboard/settings');
  
  return (
    <Card>
      <CardHeader className="bg-[#7a0486] border border-white">
        <CardTitle>{t('progressivePriceIncrease')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-[#860493] border-x border-b border-white">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-price-increase">{t('enableAutoPriceIncrease')}</Label>
          <Switch id="auto-price-increase" checked={enableAutoPrice} onCheckedChange={setEnableAutoPrice} />
        </div>
        
        {enableAutoPrice && (
          <div className="space-y-6">
            <div>
              <Label className="block text-base mb-2">{t('percentTotalIncrease')}</Label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={priceIncreasePercent} 
                  onChange={e => setPriceIncreasePercent(e.target.value)} 
                  min="1" 
                  max="100" 
                  className="bg-[#A67CAB] text-[#68178D] w-36 mr-2 h-12 border-white" 
                />
                <span className="text-2xl">%</span>
              </div>
            </div>
            
            <div className="pt-4">
              
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
