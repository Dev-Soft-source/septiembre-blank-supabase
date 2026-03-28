
import { useCallback } from "react";
import { useAutoSave } from "@/hooks/useAutoSave";
import { PropertyFormData } from "./usePropertyFormData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function usePropertyFormAutoSave(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void,
  editingHotelId?: string | null
) {
  const { user } = useAuth();

  const saveDraft = useCallback(async (data: PropertyFormData) => {
    if (!user?.id) return;
    
    try {
      const draftKey = `hotel_registration_draft_${user.id}`;
      const draftData = {
        ...data,
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      console.log('[AUTO-SAVE] Draft saved successfully');
    } catch (error) {
      console.error('[AUTO-SAVE] Failed to save draft:', error);
    }
  }, [user?.id]);

  const loadDraft = useCallback((): PropertyFormData | null => {
    if (!user?.id) return null;
    
    try {
      const draftKey = `hotel_registration_draft_${user.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        console.log('[AUTO-SAVE] Draft loaded successfully');
        return parsedDraft;
      }
    } catch (error) {
      console.error('[AUTO-SAVE] Failed to load draft:', error);
    }
    return null;
  }, [user?.id]);

  const clearDraft = useCallback(() => {
    if (!user?.id) return;
    
    try {
      const draftKey = `hotel_registration_draft_${user.id}`;
      localStorage.removeItem(draftKey);
      console.log('[AUTO-SAVE] Draft cleared successfully');
    } catch (error) {
      console.error('[AUTO-SAVE] Failed to clear draft:', error);
    }
  }, [user?.id]);

  const autoSave = useAutoSave(formData, saveDraft, {
    interval: 15000, // Auto-save every 15 seconds
    enabled: true // Auto-save ENABLED to prevent data loss
  });

  return {
    ...autoSave,
    loadDraft,
    clearDraft
  };
}
