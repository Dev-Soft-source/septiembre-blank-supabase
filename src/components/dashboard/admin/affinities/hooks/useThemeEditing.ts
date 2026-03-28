
// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditingTheme, Theme } from "../types";

export function useThemeEditing(themes: Theme[], setThemes: React.Dispatch<React.SetStateAction<Theme[]>>) {
  const [editingTheme, setEditingTheme] = useState<null | EditingTheme>(null);
  const { toast } = useToast();

  const handleEdit = (id: string, field: string, value: string) => {
    setEditingTheme({ id, field, value });
  };

  const handleSaveEdit = async () => {
    if (!editingTheme) return;
    
    // Validate empty name
    if (editingTheme.field === 'name' && !editingTheme.value.trim()) {
      toast({
        title: "Invalid input",
        description: "Affinity name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Validate duplicate name
    if (editingTheme.field === 'name') {
      const isDuplicate = themes.some(theme => 
        theme.id !== editingTheme.id && 
        theme.name.toLowerCase() === editingTheme.value.toLowerCase()
      );
      
      if (isDuplicate) {
        toast({
          title: "Duplicate name",
          description: "An affinity with this name already exists",
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      const { error } = await supabase
        .from('themes')
        .update({ [editingTheme.field]: editingTheme.value })
        .eq('id', editingTheme.id);
        
      if (error) throw error;
      
      setThemes(prev => prev.map(theme => 
        theme.id === editingTheme.id 
          ? { ...theme, [editingTheme.field]: editingTheme.value } 
          : theme
      ));
      
      toast({
        title: "Success",
        description: "Affinity updated successfully"
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update affinity",
        variant: "destructive"
      });
    } finally {
      setEditingTheme(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTheme(null);
  };

  return {
    editingTheme,
    setEditingTheme,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit
  };
}
