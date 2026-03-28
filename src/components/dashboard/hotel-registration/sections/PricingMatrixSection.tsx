import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
interface PricingMatrixSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}
export const PricingMatrixSection = ({
  form
}: PricingMatrixSectionProps) => {
  const {
    t
  } = useTranslation('dashboard/hotel-registration');
  const stayLengths = form.watch('stayLengths') || [];
  const classification = form.watch('classification');
  const pricingMatrix = form.watch('pricingMatrix') || [];
  const getPriceLimit = (classification: string) => {
    switch (classification) {
      case '***':
        return 1500;
      case '****':
        return 2500;
      case '*****':
        return 5000;
      default:
        return 1500;
    }
  };
  const priceLimit = getPriceLimit(classification);
  const updatePricing = (duration: number, field: 'doubleRoom' | 'singleRoom', value: number) => {
    const updated = [...pricingMatrix];
    const existingIndex = updated.findIndex(p => p.duration === duration);
    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        [field]: value
      };
    } else {
      updated.push({
        duration,
        doubleRoom: field === 'doubleRoom' ? value : 0,
        singleRoom: field === 'singleRoom' ? value : 0
      });
    }
    form.setValue('pricingMatrix', updated);
  };
  const getPriceForDuration = (duration: number, field: 'doubleRoom' | 'singleRoom') => {
    const pricing = pricingMatrix.find(p => p.duration === duration);
    return pricing?.[field] || 0;
  };
  const calculateLowestMonthlyPrice = () => {
    if (stayLengths.length === 0) return 0;
    const proportionalPrices = [];

    // Calculate proportional price for each selected duration
    for (const length of stayLengths) {
      const duration = parseInt(length);
      const pricing = pricingMatrix.find(p => p.duration === duration);
      if (pricing?.doubleRoom && pricing.doubleRoom > 0) {
        // Formula: (double_room_price / duration) × 29
        const proportionalPrice = Math.round(pricing.doubleRoom / duration * 29);
        proportionalPrices.push(proportionalPrice);
      }
    }

    // Return the lowest proportional price, or 0 if no valid prices
    return proportionalPrices.length > 0 ? Math.min(...proportionalPrices) : 0;
  };

  // Calculate and update price_per_month whenever pricing matrix changes
  React.useEffect(() => {
    const monthlyPrice = calculateLowestMonthlyPrice();
    if (monthlyPrice > 0) {
      form.setValue('price_per_month', monthlyPrice);
    }
  }, [pricingMatrix, stayLengths, form]);
  const lowestMonthlyPrice = calculateLowestMonthlyPrice();
  return <AccordionItem value="pricing-matrix" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">16</span>
          <span className="text-[18px] font-semibold">{t('pricingMatrix.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="border border-yellow-500/30 rounded-lg p-4 bg-[#2a5b07]">
            <h4 className="text-yellow-200 font-semibold mb-3 text-base">Hotel Living Pricing Policy</h4>
            <div className="text-yellow-100 text-sm space-y-3">
              <p>To ensure both hotel profitability and fair value for guests, Hotel Living establishes the following rules:</p>
              
              <div>
                <h5 className="font-semibold mb-1 text-base">1. General rule</h5>
                <p>The maximum rate that can be charged through Hotel Living for extended stays (8, 15, 22, or 29 days) is 60% of the hotel's official standard nightly rate, regardless of whether this base rate includes full board, half board, bed & breakfast, or room only.</p>
                <p className="mt-2 italic">Recommendation: Hotels are encouraged to consider applying even greater discounts, as these bookings typically involve vacant rooms where each reservation represents almost pure profit, with much lower marginal costs (cleaning, utilities, maintenance) and long-stay guests generating extra consumption of other services.</p>
              </div>
              
              <div>
                <h5 className="font-semibold mb-1 text-base">2. Hotels with base rate of room only or bed & breakfast</h5>
                <p>Maximum: 60% of the hotel's standard nightly rate.</p>
                <p>If such hotels wish to attract more guests by offering additional meals, they may apply extra charges within the following limits:</p>
                <p className="ml-4">A. Half board → Maximum: 80% of the hotel's standard nightly rate.</p>
                <p className="ml-4">B. Full board → Maximum: 100% of the hotel's standard nightly rate.</p>
              </div>
              
              <div>
                <h5 className="font-semibold mb-1 text-base">3. Fundamental rule</h5>
                <p>Hotel Living will verify the official rates of each property across other booking platforms.</p>
                <p>Any discrepancies or attempts to inflate the base rate will automatically disqualify the hotel from participating in Hotel Living, and therefore from monetizing its vacant rooms.</p>
              </div>
            </div>
          </div>

          {stayLengths.length === 0 ? <p className="text-white/70">{t('pricingMatrix.selectStayLengthsFirst')}</p> : <div className="space-y-6">
                {lowestMonthlyPrice > 0 && <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                      Your lowest proportional monthly price is estimated at: €{lowestMonthlyPrice}
                    </p>
                  </div>}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white p-2">{t('pricingMatrix.duration')}</th>
                      <th className="text-left text-white p-2">{t('pricingMatrix.doubleRoom')}</th>
                      <th className="text-left text-white p-2">{t('pricingMatrix.singleRoom')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stayLengths.map(length => {
                  const duration = parseInt(length);
                  return <tr key={duration} className="border-b border-white/10">
                          <td className="text-white p-2">{duration} {t('pricingMatrix.days')}</td>
                          <td className="p-2">
                            <Input type="number" placeholder="€" value={getPriceForDuration(duration, 'doubleRoom')} onChange={e => updatePricing(duration, 'doubleRoom', parseInt(e.target.value) || 0)} className="bg-white/10 border-white/30 text-white" max={priceLimit} />
                          </td>
                          <td className="p-2">
                            <Input type="number" placeholder="€" value={getPriceForDuration(duration, 'singleRoom')} onChange={e => updatePricing(duration, 'singleRoom', parseInt(e.target.value) || 0)} className="bg-white/10 border-white/30 text-white" max={priceLimit} />
                          </td>
                        </tr>;
                })}
                  </tbody>
                </table>
              </div>
            </div>}
        </div>
      </AccordionContent>
    </AccordionItem>;
};