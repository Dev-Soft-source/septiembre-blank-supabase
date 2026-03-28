
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';

interface CurrencyCardProps {
  currency: string;
  setCurrency: (value: string) => void;
}

export const CurrencyCard = ({ currency, setCurrency }: CurrencyCardProps) => {
  const { t } = useTranslation('dashboard/settings');
  
  return (
    <Card>
      <CardHeader className="bg-[#7a0486] border border-white">
        <CardTitle>{t('currencySettings')}</CardTitle>
        <CardDescription>{t('currencySettingsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="bg-[#860493] border-x border-b border-white">
        <div className="space-y-4">
          <div>
            <Label htmlFor="currency" className="block text-base mb-2">{t('preferredCurrency')}</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full bg-[#9b87f5] text-white h-12 border-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-[#9b87f5] text-white border-[#7A0486]">
                {["USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD"].map(currency => (
                  <SelectItem key={currency} value={currency} className="text-white hover:bg-[#7E69AB] focus:bg-[#7E69AB]">
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
