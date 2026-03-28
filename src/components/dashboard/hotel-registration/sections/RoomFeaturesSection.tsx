import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AddCustomOptionModal } from '@/components/common/AddCustomOptionModal';
import { HotelRegistrationFormData } from '../NewHotelRegistrationForm';
import { supabase } from "@/integrations/supabase/client";
import { useRoomFeatureAddition, useRoomsWithTranslation } from "@/components/dashboard/admin/affinities/hooks/useRoomFeatureAddition";

interface RoomFeaturesSectionProps {
  form: UseFormReturn<HotelRegistrationFormData>;
}

export const RoomFeaturesSection = ({ form }: RoomFeaturesSectionProps) => {
  const { t } = useTranslation('dashboard/hotel-registration');
  const selectedFeatures = form.watch('roomFeatures') || [];
  const { data: rooms, isLoading } = useRoomsWithTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [roomFeaturesList, setRoomFeaturesList] = useState<any[]>([]);
  const [filteredThemes, setFilteredThemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  // Fetch room features from Supabase
  const fetchRoomFeatures = async () => {
    const { data, error, count } = await supabase
      .from("rooms")
      .select("*", { count: "exact" });
    if (error) throw error;

    setRoomFeaturesList(data || []);
    return { count: count ?? 0 };
  };
  // Hook to manage adding new features
  const { newRoomFeature, setNewRoomFeature, handleAddNewRoomFeature } =
    useRoomFeatureAddition(roomFeaturesList, fetchRoomFeatures);

  // Initial fetch
  useEffect(() => {
    fetchRoomFeatures();
  }, []);

  // Preselect neutral affinities
  useEffect(() => {
    if (!isLoading && rooms.length > 0 && !isInitialized && selectedFeatures.length === 0) {
      setIsInitialized(true);
    }
  }, [rooms, isLoading, form, selectedFeatures.length, isInitialized]);

  // Automatically add new theme when newRoomFeature changes
  useEffect(() => {
    if (newRoomFeature?.name_en && newRoomFeature?.name_en.trim() !== '') {
      handleAddNewRoomFeature();
    }
  }, [newRoomFeature]);

  useEffect(() => {
      setFilteredThemes(
        roomFeaturesList.filter(theme =>
          theme?.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  }, [roomFeaturesList, searchTerm]);

  // Handle feature checkbox change
  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      form.setValue('roomFeatures', [...selectedFeatures, feature]);
    } else {
      form.setValue('roomFeatures', selectedFeatures.filter(f => f !== feature));
    }
  };

  // Add custom feature directly
  const handleAddCustomFeature = (featureName: string) => {
    setNewRoomFeature({name_en:featureName, name_es: '', name_pt: '', name: '', category: ''});
    const selected = form.getValues('roomFeatures') || [];
    // prevent adding duplicates
    if (selected.includes(featureName)) return; // Prevent duplicates
    form.setValue('roomFeatures', [...selected, featureName]);
  };

  return (
    <AccordionItem value="room-features" className="bg-white/5 border-white/20 rounded-lg">
      <AccordionTrigger className="px-6 py-4 text-white hover:no-underline">
        <div className="flex items-center space-x-3">
          <span className="bg-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">9</span>
          <span className="text-[18px] font-semibold">{t('roomFeatures.title')}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <FormField
          control={form.control}
          name="roomFeatures"
          render={() => (
            <FormItem>
              <FormLabel className="text-white">{t('roomFeatures.label')}</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {isLoading ? (
                    <div className="text-white text-sm">{t('roomFeatures.loading')}</div>
                  ) : (
                    filteredThemes.map((feature, index) => {
                      const featureKey = feature?.id ?? `feature-${index}`;
                      return (
                        <div key={featureKey} className="flex items-center space-x-2">
                          <Checkbox
                            id={featureKey}
                            checked={selectedFeatures.includes(feature?.name_en ?? '')}
                            onCheckedChange={(checked) => feature?.name_en && handleFeatureChange(feature.name_en, checked as boolean)}
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

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-xs font-medium">Step 9 Requirements:</p>
                <p className="text-blue-200 text-xs">Select at least 3 room features. ({selectedFeatures.length}/3)</p>
              </div>

              {selectedFeatures.length < 3 && (
                <p className="text-red-400 text-sm mt-2">
                  Select at least 3 room features ({selectedFeatures.length}/3)
                </p>
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
                  Add New Room Feature
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
          category="room_features"
          title="Room Feature"
        />
      </AccordionContent>
    </AccordionItem>
  );
};
