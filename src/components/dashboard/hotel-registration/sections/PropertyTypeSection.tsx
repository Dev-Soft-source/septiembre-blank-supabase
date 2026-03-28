import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { supabase } from "@/integrations/supabase/client";

interface PropertyTypeSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const PropertyTypeSection = ({ form }: PropertyTypeSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const [isOpen, setIsOpen] = useState(false);
  const [hotelFeaturesList, setHotelFeaturesList] = useState<{ id: string; name_en: string }[]>([]);

  const fetchHotelFeatures = async () => {
    const { data, error, count } = await supabase
      .from("property_types")
      .select("id, name_en", { count: "exact" }) // Fetch id for key
      .order("name_en");
    if (error) throw error;

    setHotelFeaturesList(data || []);
    return { count: count ?? 0 };
  };

  useEffect(() => {
    fetchHotelFeatures();
  }, []);

  return (
    <AccordionItem value="property-type" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger
        className="px-6 py-4 text-white hover:no-underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">3</span>
          <span className="text-[18px] font-semibold">{t('propertyType.title')}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                open={isOpen}
                onOpenChange={setIsOpen}
              >
                <FormControl>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="bg-[#68178D] border-white/20">
                  {hotelFeaturesList.map((feature) => (
                    <SelectItem key={feature.id} value={feature.name_en}>
                      {feature.name_en}
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
  );
};
