import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';

interface CheckInDaySectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const CheckInDaySection = ({ form }: CheckInDaySectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionItem value="checkin-day" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger 
        className="px-6 py-4 text-white hover:no-underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">14</span>
          <span className="text-[18px] font-semibold">{t('checkInDay.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="checkInDay"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value} open={isOpen} onOpenChange={setIsOpen}>
                <FormControl>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#68178D] border-white/20">
                  <SelectItem value="Monday">{t('checkInDay.monday')}</SelectItem>
                  <SelectItem value="Tuesday">{t('checkInDay.tuesday')}</SelectItem>
                  <SelectItem value="Wednesday">{t('checkInDay.wednesday')}</SelectItem>
                  <SelectItem value="Thursday">{t('checkInDay.thursday')}</SelectItem>
                  <SelectItem value="Friday">{t('checkInDay.friday')}</SelectItem>
                  <SelectItem value="Saturday">{t('checkInDay.saturday')}</SelectItem>
                  <SelectItem value="Sunday">{t('checkInDay.sunday')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
};