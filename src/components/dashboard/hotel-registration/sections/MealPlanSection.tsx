
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';

interface MealPlanSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const MealPlanSection = ({ form }: MealPlanSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionItem value="meal-plan" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger 
        className="px-6 py-4 text-white hover:no-underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">12</span>
          <span className="text-[18px] font-semibold">{t('mealPlans.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6 space-y-6">
        <FormField
          control={form.control}
          name="mealPlan"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value} open={isOpen} onOpenChange={setIsOpen}>
                <FormControl>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#68178D] border-white/20">
                  <SelectItem value="Room Only">{t('mealPlans.roomOnly')}</SelectItem>
                  <SelectItem value="Breakfast Included">{t('mealPlans.breakfast')}</SelectItem>
                  <SelectItem value="Half Board (Breakfast + Dinner)">{t('mealPlans.halfBoard')}</SelectItem>
                  <SelectItem value="Full Board (All Meals)">{t('mealPlans.fullBoard')}</SelectItem>
                  <SelectItem value="All Inclusive">{t('mealPlans.allInclusive')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <FormLabel className="text-white">Servicios de Lavandería *</FormLabel>
          <p className="text-white/80 text-sm">Seleccione al menos una opción de servicio de lavandería</p>
          
          <FormField
            control={form.control}
            name="weeklyLaundryIncluded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white/30"
                  />
                </FormControl>
                <FormLabel className="text-white text-sm cursor-pointer">
                  Lavandería semanal incluída
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="externalLaundryAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white/30"
                  />
                </FormControl>
                <FormLabel className="text-white text-sm cursor-pointer">
                  Lavandería exterior disponible
                </FormLabel>
              </FormItem>
            )}
          />
          
          {!form.watch('weeklyLaundryIncluded') && !form.watch('externalLaundryAvailable') && (
            <p className="text-red-400 text-sm">* Debe seleccionar al menos una opción de servicio de lavandería</p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
