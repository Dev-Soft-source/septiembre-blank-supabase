import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';

interface TermsConditionsSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export function TermsConditionsSection({ form }: TermsConditionsSectionProps) {
  const { t } = useTranslation('dashboard/hotel-registration');

  return (
    <div className="bg-white/5 border border-white/20 rounded-lg p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{t('termsConditions.title')}</h3>
        <div className="prose prose-sm max-w-none text-white/70">
          <p className="mb-4">
            {t('termsConditions.description')}
          </p>
          <div className="text-sm space-y-2">
            <p>{t('termsConditions.termsText')}</p>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-white/30 data-[state=checked]:bg-fuchsia-500 data-[state=checked]:border-fuchsia-500"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium text-white">
                {t('termsConditions.acceptTerms')}
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}