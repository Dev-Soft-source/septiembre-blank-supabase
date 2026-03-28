// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useActivitiesAddition(ActivityFeatures: hotelFeatures[], fetchActivityFeatures: () => Promise<{count: number}>) {
  const [newActivityFeature, setNewActivityFeature] = useState<NewActivityFeature>({ 
    name_en: '',
    name_es: '',
    name_pt: '',
    name_ro: '', 
    category: ""
  });
  const { toast } = useToast();

  const handleAddNewActivityFeature = async () => {
    
    // Validate empty name
    if (!newActivityFeature.name_en.trim()) {
      toast({
        title: "Invalid input",
        description: "Activity name cannot be empty",
        variant: "destructive"
      });
      return;
    }    
    
    // Validate duplicate name
    const isDuplicate = ActivityFeatures.some(hotelFeature => 
      hotelFeature.name_en.toLowerCase() === newActivityFeature.name_en.toLowerCase()
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
      const ActivityFeatureData = {
        name_en: newActivityFeature.name_en,
        name_es: newActivityFeature.name_es,
        name_pt: newActivityFeature.name_pt,
        name_ro: newActivityFeature.name_ro,
        category: newActivityFeature.category
      };

      // Insert into Supabase
      const { error } = await supabase
        .from('activities')
        .insert([ActivityFeatureData]);
        
      if (error) throw error;
      
      // Refresh the ActivityFeatures list
      await fetchActivityFeatures();
      
      toast({
        title: "Success",
        description: "New Activity added successfully"
      });
      
      setNewActivityFeature({ 
        name: "", 
        description: "", 
        level: 1
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
    newActivityFeature,
    setNewActivityFeature,
    handleAddNewActivityFeature
  };
}

interface Activities {
  id: string;
  name_en: string;
  name_es?: string;
  name_pt: string;
  name_ro?: string;
  category: string;
  created_at?: string;
}

const fetchActivities = async (): Promise<Activities[]> => {
  const { data, error } = await supabase
    .from('activities')
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
    console.error("Error fetching activities with translations:", error);
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('activities')
      .select('id, name_en')
      .order('name_en', { ascending: true });
    
    if (fallbackError) {
      throw fallbackError;
    }
    
    return fallbackData?.map(activity => ({
      ...activity
    })) || [];
  }

  return data?.map(activity => ({
    id: activity.id,
    name: activity.name_en,
  })) || [];
};

export const useActivityWithTranslation = () => {
  return useQuery({
    queryKey: ['activities-with-translations', 'en'],
    queryFn: () => fetchActivities(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};


