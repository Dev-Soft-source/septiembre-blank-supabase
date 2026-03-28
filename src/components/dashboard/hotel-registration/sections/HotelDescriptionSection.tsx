import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';

interface HotelDescriptionSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const HotelDescriptionSection = ({ form }: HotelDescriptionSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const description = form.watch('hotelDescription') || '';

  return (
    <AccordionItem value="hotel-description" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">5</span>
          <span className="text-[18px] font-semibold">{t('hotelDescription.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="hotelDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">{t('hotelDescription.label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('hotelDescription.placeholder')}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between text-sm mt-1">
                <FormMessage />
                <span className={`${description.length < 200 ? 'text-red-400' : 'text-green-400'}`}>
                  {description.length}/200 {t('hotelDescription.minCharacters')}
                </span>
              </div>
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
};