// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";

export function useAffinitiesFeatureAddition(AffinitiesFeatures: AffinitiesFeature[], fetchAffinitiesFeatures: () => Promise<{count: number}>) {
  const [newAffinitiesFeature, setNewAffinitiesFeature] = useState<NewAffinitiesFeature>({ 
    name: '',
    level: '',
    parent_id: '',
    sort_order: '',
    description: '',
    category: ''
  });
  const { toast } = useToast();

  const handleAddNewAffinitiesFeature = async () => {
    // Validate empty name
    if (!newAffinitiesFeature.name.trim()) {
      toast({
        title: "Invalid input",
        description: "Affinities name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Validate duplicate name
    const isDuplicate = AffinitiesFeatures.some(affinitiesFeature => 
      affinitiesFeature.name.toLowerCase() === newAffinitiesFeature.name.toLowerCase()
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
      const AffinitiesFeatureData = {
        name: newAffinitiesFeature.name,
        level: 1,
        parent_id: null,
        sort_order: null,
        category: newAffinitiesFeature.name,
        description: ''                
      };

      const { error } = await supabase
        .from('themes')
        .insert([AffinitiesFeatureData]);
        
      if (error) throw error;
      
      // Refresh the AffinitiesFeatures list
      await fetchAffinitiesFeatures();
      
      toast({
        title: "Success",
        description: "New Affinities added successfully"
      });
      
      setNewAffinitiesFeature({ 
        name: '',
        level: '',
        parent_id: '',
        sort_order: '',
        description: '',
        category: ''
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
    newAffinitiesFeature,
    setNewAffinitiesFeature,
    handleAddNewAffinitiesFeature
  };
}

interface Affinities {  
  id: string;
  name?: string;
  level?: string;
  parent_id?: string;
  sort_order: string,
  description: string;
  category: string;
}

const fetchAffinities = async (): Promise<Affinities[]> => {
  const { data, error } = await supabase
    .from('themes')
    .select('id, name, level, description, category') // <-- correct syntax
    .order('id', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching affinities with translations:", error);

    // fallback: only fetch minimal fields
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('themes')
      .select('id, name')
      .order('name', { ascending: true });

    if (fallbackError) throw fallbackError;

    return fallbackData || [];
  }

  return data || [];
};


export const useAffinitiesWithTranslation = () => {
  return useQuery({
    queryKey: ['affinities-with-translations', 'en'],
    queryFn: () => fetchAffinities(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

