// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useRoomFeatureAddition(RoomFeatures: RoomFeature[], fetchRoomFeatures: () => Promise<{count: number}>) {
  const [newRoomFeature, setNewRoomFeature] = useState<NewRoomFeature>({ 
    name_en: '',
    name_es: '',
    name_pt: '',
    name_ro: '',
    category: ''
  });
  const { toast } = useToast();

  const handleAddNewRoomFeature = async () => {
    // Validate empty name
    if (!newRoomFeature.name_en.trim()) {
      toast({
        title: "Invalid input",
        description: "Room name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Validate duplicate name
    const isDuplicate = RoomFeatures.some(roomFeature => 
      roomFeature.name_en.toLowerCase() === newRoomFeature.name_en.toLowerCase()
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
      const RoomFeatureData = {
        name_en: newRoomFeature.name_en,
        name_es: '',
        name_pt: '',
        name_ro: '',
        category: '',
      };

      const { error } = await supabase
        .from('rooms')
        .insert([RoomFeatureData]);
        
      if (error) throw error;
      
      // Refresh the RoomFeatures list
      await fetchRoomFeatures();
      
      toast({
        title: "Success",
        description: "New Room added successfully"
      });
      
      setNewRoomFeature({ 
        name_en: "", 
        name_es: '',
        name_pt: '',
        name_ro: '',
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
    newRoomFeature,
    setNewRoomFeature,
    handleAddNewRoomFeature
  };
}

interface Room {
  id: string;
  name_en?: string;
  name_es?: string;
  name_pt?: string;
  name_ro?: string;
  category?: string;
  created_at?: string;
}

const fetchRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
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
    console.error("Error fetching rooms with translations:", error);
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('rooms')
      .select('id, name_en')
      .order('name_en', { ascending: true });
    
    if (fallbackError) {
      throw fallbackError;
    }
    
    return fallbackData?.map(room => ({
      ...room
    })) || [];
  }

  return data?.map(room => ({
    id: room.id,
    name: room.name_en,
  })) || [];
};

export const useRoomsWithTranslation = () => {
  return useQuery({
    queryKey: ['rooms-with-translations', 'en'],
    queryFn: () => fetchRooms(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

