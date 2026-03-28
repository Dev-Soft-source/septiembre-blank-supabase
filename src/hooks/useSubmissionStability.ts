import { useState, useCallback, useRef } from 'react';
import { useRegistrationLock } from './useRegistrationLock';
import { useDataIntegrity } from './useDataIntegrity';
import { supabase } from '@/integrations/supabase/client';

interface SubmissionState {
  isSubmitting: boolean;
  isRetrying: boolean;
  lastAttempt?: Date;
  attemptCount: number;
}

interface SubmissionOptions {
  hotelId?: string;
  maxRetries?: number;
  retryDelay?: number;
}

export function useSubmissionStability(options: SubmissionOptions = {}) {
  const { hotelId, maxRetries = 3, retryDelay = 2000 } = options;
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    isRetrying: false,
    attemptCount: 0
  });

  const submissionIdRef = useRef<string>();
  const {
    lockState,
    isSubmissionInProgress,
    acquireSubmissionLock,
    releaseSubmissionLock
  } = useRegistrationLock({ hotelId });

  const {
    validateImageUploads,
    checkDuplicateSubmission,
    validateDataConsistency,
    cleanupOrphanedData
  } = useDataIntegrity();

  // Safe submission with all stability checks
  const submitWithStabilityChecks = useCallback(async (
    formData: any,
    submitFunction: () => Promise<any>
  ) => {
    // Check if locked
    if (lockState.isLocked) {
      throw new Error(`Submission blocked: ${lockState.lockReason}`);
    }

    // Check for concurrent submission
    if (!acquireSubmissionLock()) {
      throw new Error('Another submission is already in progress');
    }

    try {
      // Generate unique submission ID
      submissionIdRef.current = crypto.randomUUID();
      
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: true,
        lastAttempt: new Date(),
        attemptCount: prev.attemptCount + 1
      }));

      // Validate data consistency
      const consistencyCheck = validateDataConsistency(formData);
      if (!consistencyCheck.isValid) {
        throw new Error(`Data validation failed: ${consistencyCheck.errors.join(', ')}`);
      }

      // Check for duplicates (only based on hotel name and owner, email is optional)
      if (formData.hotelName && formData.owner_id) {
        const duplicateCheck = await checkDuplicateSubmission(
          formData.hotelName,
          '', // Email is optional, don't use for duplicate checking
          formData.owner_id
        );
        
        if (duplicateCheck.isDuplicate) {
          throw new Error(`Duplicate submission detected. Existing hotel ID: ${duplicateCheck.existingHotelId}`);
        }
      }

      // Validate image uploads
      if (formData.photos) {
        const imageValidation = validateImageUploads(
          formData.photos.hotel || [],
          formData.photos.room || []
        );
        
        if (!imageValidation.allImagesUploaded) {
          throw new Error(`Image upload incomplete. Failed: ${imageValidation.failedUploads.join(', ')}`);
        }
      }

      // Execute submission
      const result = await submitFunction();
      
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false
      }));

      return result;

    } catch (error) {
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false
      }));
      throw error;
    } finally {
      releaseSubmissionLock();
    }
  }, [
    lockState,
    acquireSubmissionLock,
    releaseSubmissionLock,
    validateDataConsistency,
    checkDuplicateSubmission,
    validateImageUploads
  ]);

  // Retry with exponential backoff
  const retryWithBackoff = useCallback(async (
    formData: any,
    submitFunction: () => Promise<any>
  ) => {
    if (submissionState.attemptCount >= maxRetries) {
      throw new Error(`Maximum retry attempts (${maxRetries}) exceeded`);
    }

    setSubmissionState(prev => ({
      ...prev,
      isRetrying: true
    }));

    // Calculate exponential backoff delay
    const delay = retryDelay * Math.pow(2, submissionState.attemptCount - 1);
    
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      const result = await submitWithStabilityChecks(formData, submitFunction);
      
      setSubmissionState(prev => ({
        ...prev,
        isRetrying: false,
        attemptCount: 0 // Reset on success
      }));

      return result;
    } catch (error) {
      setSubmissionState(prev => ({
        ...prev,
        isRetrying: false
      }));
      throw error;
    }
  }, [submissionState.attemptCount, maxRetries, retryDelay, submitWithStabilityChecks]);

  // Delete with cleanup
  const deleteWithCleanup = useCallback(async (hotelIdToDelete: string) => {
    if (!hotelIdToDelete) {
      throw new Error('Hotel ID is required for deletion');
    }

    try {
      // First cleanup orphaned data
      const cleanupResult = await cleanupOrphanedData(hotelIdToDelete);
      
      if (!cleanupResult.success) {
        console.warn('Orphaned data cleanup failed:', cleanupResult.error);
        // Continue with deletion even if cleanup partially fails
      }

      // Delete the main hotel record
      const { error: deleteError } = await supabase
        .from('hotels')
        .delete()
        .eq('id', hotelIdToDelete);

      if (deleteError) {
        throw deleteError;
      }

      return {
        success: true,
        cleanedUpRecords: cleanupResult.orphanedRecords || []
      };
    } catch (error) {
      console.error('Delete with cleanup failed:', error);
      throw error;
    }
  }, [cleanupOrphanedData]);

  // Reset submission state
  const resetSubmissionState = useCallback(() => {
    setSubmissionState({
      isSubmitting: false,
      isRetrying: false,
      attemptCount: 0
    });
    submissionIdRef.current = undefined;
  }, []);

  return {
    submissionState,
    lockState,
    isSubmissionInProgress,
    submissionId: submissionIdRef.current,
    submitWithStabilityChecks,
    retryWithBackoff,
    deleteWithCleanup,
    resetSubmissionState
  };
}