// @ts-nocheck
// TypeScript checking disabled for Supabase schema compatibility
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditingTheme, Theme } from "../types";
import { useAsyncState } from "@/hooks/useDiscriminatedState";
import { AsyncState } from "@/types/discriminated-unions";

export function useThemeEditing(themes: Theme[], setThemes: React.Dispatch<React.SetStateAction<Theme[]>>) {
  const [editingTheme, setEditingTheme] = useState<null | EditingTheme>(null);
  const { toast } = useToast();
  
  // Use modern async state management
  const saveState = useAsyncState<void>();

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
    
    // Use modern async state management
    const result = await saveState.execute(async () => {
      const { error } = await supabase
        .from('themes')
        .update({ [editingTheme.field]: editingTheme.value })
        .eq('id', editingTheme.id);
        
      if (error) throw error;
      
      // Update local state
      setThemes(prev => prev.map(theme => 
        theme.id === editingTheme.id 
          ? { ...theme, [editingTheme.field]: editingTheme.value } 
          : theme
      ));
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Affinity updated successfully"
      });
      setEditingTheme(null);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingTheme(null);
    saveState.reset();
  };

  return {
    editingTheme,
    setEditingTheme,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    isSaving: saveState.isLoading,
    saveError: saveState.error,
    saveState: saveState.state
  };
}