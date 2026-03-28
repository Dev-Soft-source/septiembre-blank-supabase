import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFiltersByCategoryWithLanguage } from '@/hooks/useFiltersByCategoryWithLanguage';
import { AddCustomOptionModal } from '@/components/common/AddCustomOptionModal';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { supabase } from "@/integrations/supabase/client";
import { useHotelFeatureAddition, useHotelFeaturesWithTranslation } from "@/components/dashboard/admin/affinities/hooks/useHotelFeatureAddition";

interface HotelFeaturesSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const HotelFeaturesSection = ({ form }: HotelFeaturesSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const selectedFeatures = form.watch('hotelFeatures') || [];
  const { data: hotels, isLoading } = useHotelFeaturesWithTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [hotelFeaturesList, setHotelFeaturesList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch hotel features from Supabase
  const fetchHotelFeatures = async () => {
    const { data, error, count } = await supabase
      .from("features")
      .select("*", { count: "exact" });
    if (error) throw error;

    setHotelFeaturesList(data || []);
    return { count: count ?? 0 };
  };

  // Hook to manage adding new features
  const { newHotelFeature, setNewHotelFeature, handleAddNewHotelFeature } =
    useHotelFeatureAddition(hotelFeaturesList, fetchHotelFeatures);

  // Initial fetch
  useEffect(() => {
    fetchHotelFeatures();
  }, []);

  // Preselect neutral affinities
  useEffect(() => {
    if (!isLoading && hotels.length > 0 && !isInitialized && selectedFeatures.length === 0) {
      setIsInitialized(true);
    }
  }, [hotels, isLoading, form, selectedFeatures.length, isInitialized]);

  // Automatically add new theme when newHotelFeature changes
  useEffect(() => {
    if (newHotelFeature?.name_en && newHotelFeature.name_en.trim() !== '') {
      handleAddNewHotelFeature();
    }
  }, [newHotelFeature]);

  // ✅ Safe filter (avoid crashing on missing name)
  const filteredThemes = hotelFeaturesList.filter(theme =>
    theme?.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle feature checkbox change
  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      form.setValue('hotelFeatures', [...selectedFeatures, feature]);
    } else {
      form.setValue('hotelFeatures', selectedFeatures.filter(f => f !== feature));
    }
  };

  // Add custom feature directly
  const handleAddCustomFeature = (featureName: string) => {
    setNewHotelFeature({name_en:featureName, name_es: '', name_pt: '', name: '', category: ''});
    const selected = form.getValues('hotelFeatures') || [];

    // Add the custom feature to the form
    if (selected.includes(featureName)) return; // Prevent duplicates
    form.setValue('hotelFeatures', [...selected, featureName]);
  };

  return (
    <AccordionItem value="hotel-features" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">8</span>
          <span className="text-[18px] font-semibold">{t('hotelFeatures.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="hotelFeatures"
          render={() => (
            <FormItem>
              <FormLabel className="text-white">{t('hotelFeatures.label')}</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {isLoading ? (
                    <div className="text-white text-sm">{t('hotelFeatures.loading')}</div>
                  ) : (
                    filteredThemes?.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.id}
                          checked={selectedFeatures.includes(feature.name_en)}
                          onCheckedChange={(checked) => handleFeatureChange(feature.name_en, checked as boolean)}
                          className="border-white/30"
                        />
                        <label
                          htmlFor={feature.id}
                          className="text-white text-sm cursor-pointer"
                        >
                          {feature.name_en}
                        </label>
                      </div>
                    ))
                  )}
                 </div>
               </FormControl>
               <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-xs font-medium">{t('hotelFeatures.step8Requirements')}</p>
                  <p className="text-blue-200 text-xs">{t('hotelFeatures.selectMinimumFeatures', { count: selectedFeatures.length })}</p>
                </div>
               <FormMessage />
                {selectedFeatures.length === 0 && (
                  <p className="text-red-400 text-sm mt-2">{t('hotelFeatures.required')}</p>
                )}
                
                {/* Add Custom Option Button */}
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(true)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Hotel Feature
                  </Button>
                </div>
              </FormItem>
           )}
         />
         
         {/* Add Custom Option Modal */}
         <AddCustomOptionModal
           isOpen={showAddModal}
           onClose={() => setShowAddModal(false)}
           onAdd={handleAddCustomFeature}
           category="hotel_features"
           title="Hotel Feature"
         />
       </AccordionContent>
     </AccordionItem>
   );
 };