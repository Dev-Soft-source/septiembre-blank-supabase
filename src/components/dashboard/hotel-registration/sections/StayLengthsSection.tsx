import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';

interface StayLengthsSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const StayLengthsSection = ({ form }: StayLengthsSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const selectedLengths = form.watch('stayLengths') || [];

  const handleLengthChange = (length: string, checked: boolean) => {
    if (checked) {
      form.setValue('stayLengths', [...selectedLengths, length as '8' | '15' | '22' | '29']);
    } else {
      form.setValue('stayLengths', selectedLengths.filter(l => l !== length));
    }
  };

  return (
    <AccordionItem value="stay-lengths" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">13</span>
          <span className="text-[18px] font-semibold">{t('stayLengths.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="stayLengths"
          render={() => (
            <FormItem>
              <FormLabel className="text-white">{t('stayLengths.label')}</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {['8', '15', '22', '29'].map((length) => (
                    <div key={length} className="flex items-center space-x-2">
                      <Checkbox
                        id={length}
                        checked={selectedLengths.includes(length as '8' | '15' | '22' | '29')}
                        onCheckedChange={(checked) => handleLengthChange(length, checked as boolean)}
                        className="border-white/30"
                      />
                      <label htmlFor={length} className="text-white text-sm cursor-pointer">
                        {length} {t('stayLengths.days')}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
};