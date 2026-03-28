import { useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { HotelRegistrationFormData } from "@/components/dashboard/hotel-registration/NewHotelRegistrationForm";

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB localStorage limit

// Create a safe subset of form data for auto-save
interface AutoSaveData {
  hotelName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phone?: string;
  website?: string;
  classification?: string;
  propertyType?: string;
  propertyStyle?: string;
  hotelDescription?: string;
  roomDescription?: string;
  idealGuests?: string;
  atmosphere?: string;
  location?: string;
  hotelFeatures?: string[];
  roomFeatures?: string[];
  activities?: string[];
  clientAffinities?: string[];
  checkInDay?: string;
  mealPlan?: string;
  stayLengths?: string[];
  weeklyLaundryIncluded?: boolean;
  externalLaundryAvailable?: boolean;
  numberOfRooms?: string;
  price_per_month?: number;
  termsAccepted?: boolean;
  timestamp?: number;
  version?: string;
}

export function useCheckpointAutoSave(
  formData: HotelRegistrationFormData,
  enabled: boolean = true
) {
  const { user, session } = useAuth();
  const lastSaveTimeRef = useRef<number>(0);

  const getStorageKey = useCallback(() => {
    const userId = user?.id || session?.user?.id;
    if (userId) {
      return `hotel_registration_reliable_${userId}`;
    }
    
    // Fallback: try to detect user from existing localStorage keys
    const keys = Object.keys(localStorage);
    const hotelKey = keys.find(key => key.startsWith('hotel_registration_reliable_'));
    return hotelKey || 'hotel_registration_reliable_temp';
  }, [user?.id, session?.user?.id]);

  const createSafeFormData = useCallback((data: HotelRegistrationFormData): AutoSaveData => {
    const safeData: AutoSaveData = {};
    
    // Include all safe fields
    Object.keys(data).forEach(key => {
      const fieldKey = key as keyof HotelRegistrationFormData;
      (safeData as any)[fieldKey] = data[fieldKey];
    });

    // Add metadata
    safeData.timestamp = Date.now();
    safeData.version = '2.1';

    return safeData;
  }, []);

  const checkStorageSize = useCallback((data: string): boolean => {
    const currentSize = new Blob([data]).size;
    return currentSize < MAX_STORAGE_SIZE;
  }, []);

  const saveAtCheckpoint = useCallback(async (checkpointName: string) => {
    const userId = user?.id || session?.user?.id;
    if (!enabled || (!userId && !getStorageKey().includes('temp'))) {
      return { success: false, reason: 'User not identified or auto-save disabled' };
    }

    try {
      const now = Date.now();
      
      // Throttle saves to prevent excessive localStorage writes
      if (now - lastSaveTimeRef.current < 5000) { // Min 5 seconds between saves
        return { success: false, reason: 'Too frequent' };
      }

      const safeData = createSafeFormData(formData);
      const dataString = JSON.stringify(safeData);

      // Check if data size is reasonable
      if (!checkStorageSize(dataString)) {
        console.warn('[CHECKPOINT-SAVE] Data too large for localStorage');
        return { success: false, reason: 'Data too large' };
      }

      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, dataString);
      
      lastSaveTimeRef.current = now;
      console.log(`[CHECKPOINT-SAVE] Draft saved at ${checkpointName} checkpoint at`, new Date(now).toLocaleTimeString());
      
      return { success: true };
    } catch (error) {
      console.error('[CHECKPOINT-SAVE] Failed to save at checkpoint:', error);
      return { success: false, reason: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [formData, getStorageKey, user?.id, session?.user?.id, enabled, createSafeFormData, checkStorageSize]);

  const hasValidDraftData = useCallback((draft: AutoSaveData | null): boolean => {
    if (!draft) return false;
    
    // Check for meaningful form data (exclude metadata fields)
    const meaningfulFields = ['hotelName', 'address', 'city', 'country', 'phone', 'email', 'website', 'hotelDescription'];
    
    // Require at least one substantial text field with meaningful content (minimum 2 characters)
    const hasTextContent = meaningfulFields.some(field => {
      const value = draft[field as keyof AutoSaveData];
      return value && typeof value === 'string' && value.trim().length >= 2;
    });
    
    return hasTextContent;
  }, []);

  const loadDraft = useCallback((): AutoSaveData | null => {
    try {
      const storageKey = getStorageKey();
      const savedDraft = localStorage.getItem(storageKey);
      
      if (!savedDraft) {
        return null;
      }

      const parsedDraft = JSON.parse(savedDraft);
      
      // Version check (support both 2.0 and 2.1)
      if (parsedDraft.version !== '2.0' && parsedDraft.version !== '2.1') {
        console.warn('[CHECKPOINT-SAVE] Incompatible draft version, clearing old draft');
        clearDraft();
        return null;
      }

      // Age check (7 days max)
      const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
      if (parsedDraft.timestamp && (Date.now() - parsedDraft.timestamp) > MAX_AGE) {
        console.warn('[CHECKPOINT-SAVE] Draft too old, clearing');
        clearDraft();
        return null;
      }

      // Only log and return if there's valid data
      if (hasValidDraftData(parsedDraft)) {
        console.log('[CHECKPOINT-SAVE] Draft loaded successfully');
        return parsedDraft;
      }
      
      return null;
    } catch (error) {
      console.error('[CHECKPOINT-SAVE] Failed to load draft:', error);
      // Clear corrupted draft
      clearDraft();
      return null;
    }
  }, [getStorageKey, hasValidDraftData]);

  const clearDraft = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      console.log('[CHECKPOINT-SAVE] Draft cleared successfully');
    } catch (error) {
      console.error('[CHECKPOINT-SAVE] Failed to clear draft:', error);
    }
  }, [getStorageKey]);

  const hasValidDraft = useCallback((): boolean => {
    const draft = loadDraft();
    return hasValidDraftData(draft);
  }, [loadDraft, hasValidDraftData]);

  const getDraftAge = useCallback((): number | null => {
    const draft = loadDraft();
    if (!draft?.timestamp) {
      return null;
    }
    return Date.now() - draft.timestamp;
  }, [loadDraft]);

  // Helper function to check if checkpoint should trigger
  const checkSectionCompletion = useCallback((sectionIndex: number): boolean => {
    switch (sectionIndex) {
      case 6: // After ROOM DESCRIPTION section
        return !!(formData.hotelName && formData.roomDescription);
      case 12: // After MEAL PLANS section
        return !!(formData.hotelName && formData.roomDescription && formData.mealPlan);
      default:
        return false;
    }
  }, [formData]);

  return {
    saveAtCheckpoint,
    loadDraft,
    clearDraft,
    hasValidDraft,
    hasValidDraftData,
    getDraftAge,
    checkSectionCompletion,
    isEnabled: enabled && !!(user?.id || session?.user?.id)
  };
}