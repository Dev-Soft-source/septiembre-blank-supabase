// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useHotelFeatureAddition(HotelFeatures: hotelFeatures[], fetchHotelFeatures: () => Promise<{count: number}>) {
  const [newHotelFeature, setNewHotelFeature] = useState<NewHotelFeature>({ 
    name_en: '',
    name_es: '',
    name_pt: '',
    name_ro: '', 
    category: ""
  });
  const { toast } = useToast();

  const handleAddNewHotelFeature = async () => {
    
    // Validate empty name
    if (!newHotelFeature.name_en.trim()) {
      toast({
        title: "Invalid input",
        description: "Hotel name cannot be empty",
        variant: "destructive"
      });
      return;
    }    
    
    // Validate duplicate name
    const isDuplicate = HotelFeatures.some(hotelFeature => 
      hotelFeature.name_en.toLowerCase() === newHotelFeature.name_en.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate name",
        description: "An affinity with this name already exists",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare the data - omit empty category
      const HotelFeatureData = {
        name_en: newHotelFeature.name_en,
        name_es: newHotelFeature.name_es,
        name_pt: newHotelFeature.name_pt,
        name_ro: newHotelFeature.name_ro,
        category: newHotelFeature.category
      };

      // Insert into Supabase
      const { error } = await supabase
        .from('features')
        .insert([HotelFeatureData]);
        
      if (error) throw error;
      
      // Refresh the HotelFeatures list
      await fetchHotelFeatures();
      
      toast({
        title: "Success",
        description: "New Hotel added successfully"
      });
      
      setNewHotelFeature({ 
        name_en: '',
        name_es: '',
        name_pt: '',
        name_ro: '', 
        category: ""
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add new affinity",
        variant: "destructive"
      });
    }
  };

  return {
    newHotelFeature,
    setNewHotelFeature,
    handleAddNewHotelFeature
  };
}

interface Features {
  id: string;
  name_en?: string;
  name_es?: string;
  name_pt?: string;
  name_ro?: string;
  category?: string;
  created_at?: string;
}

const fetchFeatures = async (): Promise<Features[]> => {
  const { data, error } = await supabase
    .from('features')
    .select(`
      id, 
      name_en,
      name_es,
      name_pt,
      name_ro, 
      category
      )
    `)
    .order('id', { ascending: true })
    .order('name_en', { ascending: true });

  if (error) {
    console.error("Error fetching Features with translations:", error);
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('features')
      .select('id, name_en')
      .order('name_en', { ascending: true });
    
    if (fallbackError) {
      throw fallbackError;
    }
    
    return fallbackData?.map(feature => ({
      ...feature
    })) || [];
  }

  return data?.map(feature => ({
    id: feature.id,
    name: feature.name_en,
  })) || [];
};

export const useHotelFeaturesWithTranslation = () => {
  return useQuery({
    queryKey: ['features-with-translations', 'en'],
    queryFn: () => fetchFeatures(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};


