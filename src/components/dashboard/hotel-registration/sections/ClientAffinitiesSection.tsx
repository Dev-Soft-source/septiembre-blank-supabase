import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AddCustomOptionModal } from '@/components/common/AddCustomOptionModal';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { supabase } from "@/integrations/supabase/client";
import { useAffinitiesFeatureAddition, useAffinitiesWithTranslation } from "@/components/dashboard/admin/affinities/hooks/useAffinitiesAddition";

interface ClientAffinitiesSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const ClientAffinitiesSection = ({ form }: ClientAffinitiesSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const selectedFeatures = form.watch('clientAffinities') || [];
  const { data: affinities, isLoading } = useAffinitiesWithTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [affinitiesFeaturesList, setAffinitiesFeaturesList] = useState<any[]>([]);
   const [filteredAffinities, setFilteredAffinities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  // Fetch affinities features from Supabase
  const fetchAffinitiesFeatures = async () => {
    const { data, error, count } = await supabase
      .from("themes")
      .select("*", { count: "exact" });
    if (error) throw error;
    
    setAffinitiesFeaturesList(data || []);
    return { count: count ?? 0 };
  };

  // Hook to manage adding new features
  const { newAffinitiesFeature, setNewAffinitiesFeature, handleAddNewAffinitiesFeature } =
    useAffinitiesFeatureAddition(affinitiesFeaturesList, fetchAffinitiesFeatures);

  // Initial fetch
  useEffect(() => {
    fetchAffinitiesFeatures();
  }, []);

  // Preselect neutral affinities
  useEffect(() => {
    if (!isLoading && affinities.length > 0 && !isInitialized && selectedFeatures.length === 0) {
      setIsInitialized(true);
    }
  }, [affinities, isLoading, form, selectedFeatures.length, isInitialized]);

  // Automatically add new theme when newAffinitiesFeature changes
  useEffect(() => {
    if (newAffinitiesFeature?.name && newAffinitiesFeature?.name.trim() !== '') {
      handleAddNewAffinitiesFeature();
    }
  }, [newAffinitiesFeature]);

  useEffect(() => {
      setFilteredAffinities(
        affinitiesFeaturesList.filter(theme =>
          theme?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
  }, [affinitiesFeaturesList, searchTerm]);

  const handleAffinityChange = (feature: string, checked: boolean) => {
    if (checked) {
      form.setValue('clientAffinities', [...selectedFeatures, feature]);
    } else {
      form.setValue('clientAffinities', selectedFeatures.filter(f => f !== feature));
    }
  };

  // Validation for minimum 3 affinities
  const validateAffinities = (value: string[]) => {
    if (!value || value.length < 3) {
      return t('clientAffinities.validationMessage');
    }
    return true;
  };

  const handleAddCustomAffinity = (affinityName: string) => {
    setNewAffinitiesFeature({name:affinityName, level: 1, category: affinityName, description: ''});
    const selected = form.getValues('roomFeatures') || [];
    
    // prevent adding duplicates
    if (selected.includes(affinityName)) return; // Prevent duplicates
   form.setValue('clientAffinities', [...selected, affinityName]);
  };

  return (
    <AccordionItem value="client-affinities" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">10</span>
          <span className="text-[18px] font-semibold">{t('clientAffinities.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="clientAffinities"
          // rules={{ validate: validateAffinities }}
          render={() => (
            <FormItem>
              <FormLabel className="text-white">{t('clientAffinities.selectAffinities')}</FormLabel>
              
              {/* Informative text */}
              <div className="mt-2 p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white/80 text-sm">
                  {t('clientAffinities.informativeText')}
                </p>
              </div>
              
              <div className="mt-4 space-y-4">
                <Input
                  placeholder={t('clientAffinities.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />

                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-white/50">{t('clientAffinities.loading')}</div>
                    ) : (
                      filteredAffinities.map((theme, index) => {
                        const themeKey = theme?.id ?? `theme-${index}`;
                        return(
                          <div key={themeKey} className="flex items-center space-x-2">
                          <Checkbox
                            id={themeKey}
                            checked={selectedFeatures.includes(theme?.name ?? '')}
                            onCheckedChange={(checked) => theme?.name && handleAffinityChange(theme.name, checked as boolean)}
                            className="border-white/30"
                          />
                          <label
                            htmlFor={themeKey}
                            className="text-white text-sm cursor-pointer"
                          >
                            {theme.name}
                          </label>
                        </div>
                        );                        
                      })
                    )}
                  </div>
                </FormControl>
                
                <FormMessage className="text-red-400" />
                
                {/* Add Custom Option Button */}
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(true)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Affinity
                  </Button>
                </div>
              </div>
            </FormItem>
          )}
        />
        
        {/* Add Custom Option Modal */}
        <AddCustomOptionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCustomAffinity}
          category="affinities"
          title="Client Affinity"
        />
      </AccordionContent>
    </AccordionItem>
  );
};