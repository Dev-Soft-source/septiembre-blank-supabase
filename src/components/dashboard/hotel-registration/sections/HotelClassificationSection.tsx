import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent, Accordion } from '@/components/ui/accordion';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { Star } from 'lucide-react';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';

interface HotelClassificationSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const HotelClassificationSection = ({ form }: HotelClassificationSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  // Detect when accordion content becomes visible
  useEffect(() => {
    // Open the select dropdown only when the accordion content is visible
    if (accordionValue === 'classification') {
      setIsSelectOpen(true);
    } else {
      setIsSelectOpen(false);
    }
  }, [accordionValue]);

  return (
    <Accordion type="single" value={accordionValue} onValueChange={setAccordionValue}>
      <AccordionItem value="classification" className="bg-white/5 border-white/20 rounded-lg">
        <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
          <div className="flex items-center space-x-3">
            <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">2</span>
            <span className="text-[18px] font-semibold">{t('classification.title')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <FormField
            control={form.control}
            name="classification"
            render={({ field }) => (
              <FormItem>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder={t('classification.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#68178D] border-white/20">
                    {[3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(num)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                            ))}
                          </div>
                          <span>{num} stars</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
