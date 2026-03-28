import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { CountryDropdown } from '../components/CountryDropdown';
import { SimpleAddressAutocomplete } from '../components/SimpleAddressAutocomplete';
import { MapPreview } from '../components/MapPreview';

interface HotelBasicInfoSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const HotelBasicInfoSection = ({ form }: HotelBasicInfoSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');

  return (
    <AccordionItem value="basic-info" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">1</span>
          <span className="text-[18px] font-semibold">{t('basicInfo.title')}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-6">
        <div className="space-y-6">

          {/* Hotel Name */}
          <FormField
            control={form.control}
            name="hotelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('basicInfo.hotelName')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('basicInfo.hotelNamePlaceholder')}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    {...field}
                    value={field.value ?? ''} // <-- controlled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Rooms */}
          <FormField
            control={form.control}
            name="totalRooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('basicInfo.totalRooms')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder={t('basicInfo.totalRoomsPlaceholder')}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    {...field}
                    value={field.value ?? ''} // <-- controlled
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('basicInfo.address')}</FormLabel>
                <FormControl>
                  <SimpleAddressAutocomplete
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onAddressComponents={(components) => {
                      if (components.locality) form.setValue('city', components.locality);
                      if (components.postal_code) form.setValue('postalCode', components.postal_code);
                      if (components.country) form.setValue('country', components.country);
                    }}
                    placeholder={t('basicInfo.addressPlaceholder')}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('basicInfo.city')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('basicInfo.cityPlaceholder')}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      {...field}
                      value={field.value ?? ''} // <-- controlled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{t('basicInfo.postalCode')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('basicInfo.postalCodePlaceholder')}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      {...field}
                      value={field.value ?? ''} // <-- controlled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">{t('basicInfo.country')}</FormLabel>
                <FormControl>
                  <CountryDropdown
                    value={field.value ?? ''} // <-- controlled
                    onChange={field.onChange}
                    placeholder={t('basicInfo.countryPlaceholder')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Info box */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-xs font-medium">{t('basicInfo.step1Requirements')}</p>
            <p className="text-blue-200 text-xs">{t('basicInfo.allAddressFieldsRequired')}</p>
          </div>

          {/* Map Preview */}
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/70 text-sm mb-2">Map Preview</p>
            <MapPreview
              address={form.watch('address') ?? ''}
              city={form.watch('city') ?? ''}
              country={form.watch('country') ?? ''}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
