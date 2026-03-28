import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { AddCustomOptionModal } from '@/components/common/AddCustomOptionModal';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { useFiltersByCategoryWithLanguage } from '@/hooks/useFiltersByCategoryWithLanguage';
import { useActivitiesAddition, useActivityWithTranslation } from "@/components/dashboard/admin/affinities/hooks/useActivitiesAddition";

interface ActivitiesSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const ActivitiesSection = ({ form }: ActivitiesSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const { data: activities, isLoading } = useActivityWithTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activityFeaturesList, setActivityFeaturesList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const selectedActivities = form.watch('activities') || [];

  // Fetch Activity features from Supabase
  const fetchActivityFeatures = async () => {
    const { data, error, count } = await supabase
      .from("activities")
      .select("*", { count: "exact" });
    if (error) throw error;
    
    setActivityFeaturesList(data || []);
    return { count: count ?? 0 };
  };

  // Hook to manage adding new features
  const { newActivityFeature, setNewActivityFeature, handleAddNewActivityFeature } =
    useActivitiesAddition(activityFeaturesList, fetchActivityFeatures);
  
  // Initial fetch
  useEffect(() => {
    fetchActivityFeatures();
  }, []);

  // Preselect neutral affinities
  useEffect(() => {
    if (!isLoading && activities.length > 0 && !isInitialized && selectedActivities.length === 0) {
      setIsInitialized(true);
    }
  }, [activities, isLoading, form, isInitialized, selectedActivities.length]);

  // Automatically add new theme when newActivityFeature changes
  useEffect(() => {
    if (newActivityFeature?.name_en && newActivityFeature.name_en.trim() !== '') {
      handleAddNewActivityFeature();
    }
  }, [newActivityFeature]);

  // Filter activities based on search term
  const filteredActivities = activityFeaturesList.filter(activity =>
    activity?.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
  ); 
  
  // Handle checkbox change
  const handleActivityChange = (activityId: string, checked: boolean) => {
    if (checked) {
      form.setValue('activities', [...selectedActivities, activityId]);
    } else {
      form.setValue('activities', selectedActivities.filter(f => f !== activityId));
    }
  };

  // Validation for minimum 4 activities
  const validateActivities = (value: string[]) => {
    if (!value || value.length < 4) {
      return t('activities.validationMessage');
    }
    return true;
  };

  //setNewActivityFeature used instead of setNewHotelFeature
  const handleAddCustomActivity = (activityName: string) => {
    setNewActivityFeature({name_en: activityName, category: "", name_es:"", name_pt:"", name_ro:""});
    const selected = form.getValues('activities') || [];

    // Prevent duplicates
    if (selected.includes(activityName)) return;     
    form.setValue('activities', [...selected, activityName]);
  };

  return (
    <AccordionItem value="activities" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">11</span>
          <span className="text-[18px] font-semibold">{t('activities.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="activities"
          // rules={{ validate: validateActivities }}
          render={() => (
            <FormItem>
              <FormLabel className="text-white">{t('activities.selectActivities')}</FormLabel>
              
              <div className="mt-2 p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white/80 text-sm">
                  {t('activities.informativeText')}
                </p>
              </div>
              
              <div className="mt-4 space-y-4">
                <Input
                  placeholder={t('activities.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />

                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-white/50">{t('activities.loading')}</div>
                    ) : (
                      filteredActivities.map((feature, index) => {
                        const featureKey = feature?.id ?? `feature-${index}`;
                        return (
                          <div key={featureKey} className="flex items-center space-x-2">
                            <Checkbox
                              id={featureKey}
                              checked={selectedActivities.includes(feature?.name_en ?? '')}
                              onCheckedChange={(checked) => feature?.name_en && handleActivityChange(feature.name_en, checked as boolean)}
                              className="border-white/30"
                            />
                            <label htmlFor={featureKey} className="text-white text-sm cursor-pointer">
                              {feature?.name_en ?? "Unnamed Feature"}
                            </label>
                          </div>
                        );
                      })
                    )}
                  </div>
                </FormControl>
                
                <FormMessage className="text-red-400" />
                
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(true)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Activity
                  </Button>
                </div>
              </div>
            </FormItem>
          )}
        />
        
        <AddCustomOptionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCustomActivity}
          category="activities"
          title="Activity"
        />
      </AccordionContent>
    </AccordionItem>
  );
};
