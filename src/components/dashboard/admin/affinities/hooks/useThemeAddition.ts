
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Theme, NewTheme } from "../types";

export function useThemeAddition(themes: Theme[], fetchThemes: () => Promise<{count: number}>) {
  const [newTheme, setNewTheme] = useState<NewTheme>({ 
    name: "", 
    description: "", 
    category: "", 
    level: 1,
    sort_order: 0
  });
  const { toast } = useToast();

  const handleAddNewTheme = async () => {
    // Validate empty name
    if (!newTheme.name.trim()) {
      toast({
        title: "Invalid input",
        description: "Affinity name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Validate duplicate name
    const isDuplicate = themes.some(theme => 
      theme.name.toLowerCase() === newTheme.name.toLowerCase()
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
      const themeData = {
        name: newTheme.name,
        description: newTheme.description,
        level: newTheme.level,
        sort_order: newTheme.sort_order,
        ...(newTheme.category ? { category: newTheme.category } : {})
      };

      const { error } = await supabase
        .from('themes')
        .insert([themeData]);
        
      if (error) throw error;
      
      // Refresh the themes list
      await fetchThemes();
      
      toast({
        title: "Success",
        description: "New affinity added successfully"
      });
      
      setNewTheme({ 
        name: "", 
        description: "", 
        category: "", 
        level: 1,
        sort_order: 0
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
    newTheme,
    setNewTheme,
    handleAddNewTheme
  };
}
