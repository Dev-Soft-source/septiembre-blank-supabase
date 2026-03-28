import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HotelRegistrationFormData } from '@/components/dashboard/hotel-registration/NewHotelRegistrationForm';

interface SubmissionPayload {
  hotelData: any;
  availabilityPackages: any[];
  hotelImages: any[];
  hotelThemes: string[];
  hotelActivities: string[];
  formData: HotelRegistrationFormData;
  timestamp: number;
  attemptCount: number;
  userId?: string;
}

interface SubmissionAttempt {
  id: string;
  timestamp: number;
  success: boolean;
  error?: string;
  payload: SubmissionPayload;
}

interface SubmissionState {
  isSubmitting: boolean;
  hasFailedSubmission: boolean;
  lastFailedPayload: SubmissionPayload | null;
  submissionComplete: boolean;
  retryCount: number;
}

export function useDataPreservation() {
  const { user } = useAuth();
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    hasFailedSubmission: false,
    lastFailedPayload: null,
    submissionComplete: false,
    retryCount: 0
  });

  const getStorageKey = useCallback(() => {
    return `hotel_registration_failed_submission_${user?.id || 'anonymous'}`;
  }, [user?.id]);

  const saveFailedSubmission = useCallback(async (payload: SubmissionPayload, error: string) => {
    try {
      const failedSubmission: SubmissionAttempt = {
        id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        success: false,
        error,
        payload
      };

      // Save to localStorage for immediate retry capability
      localStorage.setItem(getStorageKey(), JSON.stringify(failedSubmission));
      
      // Log to admin system
      await logSubmissionFailure(failedSubmission);
      
      setSubmissionState(prev => ({
        ...prev,
        hasFailedSubmission: true,
        lastFailedPayload: payload,
        isSubmitting: false
      }));

      console.log('[DATA-PRESERVATION] Failed submission saved locally:', failedSubmission.id);
      return true;
    } catch (saveError) {
      console.error('[DATA-PRESERVATION] Failed to save submission locally:', saveError);
      return false;
    }
  }, [getStorageKey, user?.id]);

  const logSubmissionFailure = useCallback(async (attempt: SubmissionAttempt) => {
    try {
      const logData = {
        timestamp: new Date(attempt.timestamp).toISOString(),
        user_id: user?.id || null,
        attempt_id: attempt.id,
        payload_summary: {
          hotel_name: attempt.payload.formData.hotelName || 'Unknown',
          payload_size_kb: Math.round(JSON.stringify(attempt.payload).length / 1024),
          image_count: attempt.payload.hotelImages.length,
          completed_fields: Object.keys(attempt.payload.formData).filter(key => 
            attempt.payload.formData[key as keyof HotelRegistrationFormData] !== '' && 
            attempt.payload.formData[key as keyof HotelRegistrationFormData] !== null &&
            attempt.payload.formData[key as keyof HotelRegistrationFormData] !== undefined
          ).length,
          attempt_count: attempt.payload.attemptCount
        },
        error_message: attempt.error,
        error_type: 'hotel_registration_failure',
        status: 'failed'
      };

      // Log to admin_messages table for admin review
      const { error: logError } = await supabase
        .from('admin_messages')
        .insert({
          user_id: user?.id,
          subject: `Hotel Registration Submission Failure - ${attempt.payload.formData.hotelName}`,
          message: `
Failed submission attempt details:

Hotel Name: ${attempt.payload.formData.hotelName}
User ID: ${user?.id || 'Anonymous'}
Attempt ID: ${attempt.id}
Timestamp: ${logData.timestamp}
Attempt Count: ${attempt.payload.attemptCount}

Payload Summary:
- Size: ${logData.payload_summary.payload_size_kb} KB
- Images: ${logData.payload_summary.image_count}
- Completed Fields: ${logData.payload_summary.completed_fields}

Error Details:
${attempt.error}

Payload Preview:
${JSON.stringify(logData.payload_summary, null, 2)}
          `,
          status: 'pending'
        });

      if (logError) {
        console.error('[DATA-PRESERVATION] Failed to log to admin_messages:', logError);
      } else {
        console.log('[DATA-PRESERVATION] Failure logged to admin system');
      }
    } catch (error) {
      console.error('[DATA-PRESERVATION] Failed to log submission failure:', error);
    }
  }, [user?.id]);

  const submitToSupabase = useCallback(async (payload: SubmissionPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('[DATA-PRESERVATION] Attempting submission with enhanced backend mapping');
      console.log('[DATA-PRESERVATION] User authenticated:', !!user?.id);
      
      // Detect if we're in development mode (Lovable environment)
      const isDevelopment = window.location.hostname.includes('lovableproject.com') || 
                           window.location.hostname === 'localhost' ||
                           import.meta.env.DEV;
      
      console.log('[DATA-PRESERVATION] Development mode detected:', isDevelopment, 'Host:', window.location.hostname);
      
      let devUserId = null;
      let finalHotelData = { ...payload.hotelData };
      
      // In development mode, create a mock user if not authenticated
      if (isDevelopment && !user) {
        console.log('[DATA-PRESERVATION] Creating development user for hotel registration');
        
        const submissionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { data: devUserData, error: devUserError } = await supabase.functions.invoke('create-dev-user', {
          body: {
            sessionId: submissionId
          }
        });
        
        if (devUserError) {
          console.error('[DATA-PRESERVATION] Failed to create development user:', devUserError);
          throw new Error(`Development user creation failed: ${devUserError.message || 'Unknown error'}`);
        }
        
        if (devUserData?.success) {
          devUserId = devUserData.userId;
          finalHotelData.owner_id = devUserId;
          console.log(`[DATA-PRESERVATION] Development user created successfully: ${devUserId}`);
        } else {
          throw new Error('Development user creation returned no user ID');
        }
      } else if (user?.id) {
        // Ensure we have the authenticated user's ID for ownership
        finalHotelData.owner_id = user.id;
        console.log('[DATA-PRESERVATION] Set owner_id to authenticated user:', user.id);
      }

      // Backend now handles all field mapping and conversion, so we can pass data directly
      console.log('[DATA-PRESERVATION] Sending themes:', payload.hotelThemes);
      console.log('[DATA-PRESERVATION] Sending activities:', payload.hotelActivities);
      
      // Instead of RPC, directly create hotel record
      const { data: hotel, error: hotelError } = await supabase
        .from('hotels')
        .insert(finalHotelData)
        .select()
        .single();

      if (hotelError) throw hotelError;

      // Insert availability packages if provided
      if (payload.availabilityPackages?.length > 0) {
        const packagesWithHotelId = payload.availabilityPackages.map(pkg => ({
          ...pkg,
          hotel_id: hotel.id
        }));
        
        const { error: packagesError } = await supabase
          .from('availability_packages')
          .insert(packagesWithHotelId);
          
        if (packagesError) throw packagesError;
      }

      // Insert hotel images if provided
      if (payload.hotelImages?.length > 0) {
        const imagesWithHotelId = payload.hotelImages.map(img => ({
          ...img,
          hotel_id: hotel.id
        }));
        
        const { error: imagesError } = await supabase
          .from('hotel_images')
          .insert(imagesWithHotelId);
          
        if (imagesError) throw imagesError;
      }

      const response = { success: true, hotel_id: hotel.id };

      // After successful hotel registration, trigger automatic translations
      if (response && typeof response === 'object' && response !== null) {
        const responseObj = response as any;
        if (responseObj.success && responseObj.hotel_id) {
          console.log('[DATA-PRESERVATION] Hotel registration successful, triggering auto-translations for hotel:', responseObj.hotel_id);
          
          try {
            // Import and call auto-translation function directly to avoid React hooks error
            const { supabase } = await import('@/integrations/supabase/client');
            
            // Prepare content for translation
            const contentForTranslation = {
              name: payload.hotelData.name,
              description: payload.hotelData.description,
              ideal_guests: payload.hotelData.ideal_guests,
              atmosphere: payload.hotelData.atmosphere,
              perfect_location: payload.hotelData.perfect_location
            };
            
            // Detect source language first
            const { data: langData, error: langError } = await supabase.functions.invoke('detect-language', {
              body: { content: contentForTranslation }
            });
            
            const sourceLanguage = (langData?.language && ['en', 'es', 'pt', 'ro'].includes(langData.language)) 
              ? langData.language as 'en' | 'es' | 'pt' | 'ro' 
              : 'en';
            
            console.log(`[DATA-PRESERVATION] Source language detected: ${sourceLanguage}`);
            
            // Trigger translations for all other languages
            const allLanguages: ('en' | 'es' | 'pt' | 'ro')[] = ['en', 'es', 'pt', 'ro'];
            const targetLanguages = allLanguages.filter(lang => lang !== sourceLanguage);
            
            // Execute translations sequentially to avoid overwhelming the system
            for (const targetLanguage of targetLanguages) {
              try {
                const { error: translationError } = await supabase.functions.invoke('translate-hotel-content', {
                  body: {
                    hotelId: responseObj.hotel_id,
                    targetLanguage,
                    sourceLanguage,
                    content: contentForTranslation
                  }
                });
                
                if (translationError) {
                  console.warn(`[DATA-PRESERVATION] Translation to ${targetLanguage} failed:`, translationError);
                } else {
                  console.log(`[DATA-PRESERVATION] Translation to ${targetLanguage} completed successfully`);
                }
              } catch (error) {
                console.warn(`[DATA-PRESERVATION] Translation to ${targetLanguage} error:`, error);
              }
            }
            
            console.log('[DATA-PRESERVATION] Auto-translations process completed');
          } catch (translationError) {
            console.warn('[DATA-PRESERVATION] Auto-translation failed, but hotel registration was successful:', translationError);
            // Don't fail the entire process if translation fails
          }
        }
      }

      console.log('[DATA-PRESERVATION] Hotel registration completed successfully');
      

      // Enhanced response validation
      if ((response as any)?.success === false) {
        const serverError = (response as any)?.error;
        let errorMessage = 'Server rejected submission';
        
        if (serverError) {
          if (serverError.message && typeof serverError.message === 'object') {
            // Multi-language error messages
            errorMessage = serverError.message.en || serverError.message.es || serverError.message.pt || serverError.message.ro || 'Server error';
          } else {
            errorMessage = serverError.message || serverError.code || 'Server error';
          }
          
          // Log validation details for debugging
          if (serverError.details) {
            console.error('[DATA-PRESERVATION] Validation Details:', serverError.details);
          }
        }
        
        console.error('[DATA-PRESERVATION] Server Response Error:', serverError);
        throw new Error(`Server Error: ${errorMessage}`);
      }


      console.log('[DATA-PRESERVATION] Submission successful to Supabase - hotel data saved and forwarded to admin panel');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown submission error';
      console.error('[DATA-PRESERVATION] Complete submission failure:', {
        error: errorMessage,
        userId: user?.id,
        hotelName: payload.hotelData.name,
        timestamp: new Date().toISOString()
      });
      return { success: false, error: errorMessage };
    }
  }, [user?.id]);

  const submitWithPreservation = useCallback(async (
    formData: HotelRegistrationFormData,
    hotelData: any,
    availabilityPackages: any[],
    hotelImages: any[],
    hotelThemes: string[],
    hotelActivities: string[]
  ): Promise<{ success: boolean; error?: string }> => {
    setSubmissionState(prev => ({ ...prev, isSubmitting: true }));
    
    const payload: SubmissionPayload = {
      hotelData,
      availabilityPackages,
      hotelImages,
      hotelThemes,
      hotelActivities,
      formData,
      timestamp: Date.now(),
      attemptCount: submissionState.retryCount + 1,
      userId: user?.id
    };

    const result = await submitToSupabase(payload);
    
    if (result.success) {
      // Clear any failed submissions on success
      clearFailedSubmission();
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        submissionComplete: true,
        hasFailedSubmission: false,
        lastFailedPayload: null,
        retryCount: 0
      }));
      
      console.log('[DATA-PRESERVATION] Submission completed successfully');
      return { success: true };
    } else {
      // Save failed submission for retry
      await saveFailedSubmission(payload, result.error || 'Unknown error');
      return { success: false, error: result.error };
    }
  }, [user?.id, submissionState.retryCount, submitToSupabase, saveFailedSubmission]);

  const retryFailedSubmission = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!submissionState.lastFailedPayload) {
      return { success: false, error: 'No failed submission to retry' };
    }

    setSubmissionState(prev => ({ 
      ...prev, 
      isSubmitting: true,
      retryCount: prev.retryCount + 1
    }));

    // Update attempt count for retry
    const retryPayload: SubmissionPayload = {
      ...submissionState.lastFailedPayload,
      attemptCount: submissionState.retryCount + 1,
      timestamp: Date.now()
    };

    const result = await submitToSupabase(retryPayload);
    
    if (result.success) {
      clearFailedSubmission();
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        submissionComplete: true,
        hasFailedSubmission: false,
        lastFailedPayload: null,
        retryCount: 0
      }));
      
      console.log('[DATA-PRESERVATION] Retry submission completed successfully');
      return { success: true };
    } else {
      // Update failed submission with new attempt
      await saveFailedSubmission(retryPayload, result.error || 'Retry failed');
      return { success: false, error: result.error };
    }
  }, [submissionState.lastFailedPayload, submissionState.retryCount, submitToSupabase, saveFailedSubmission]);

  const clearFailedSubmission = useCallback(() => {
    try {
      localStorage.removeItem(getStorageKey());
      setSubmissionState(prev => ({
        ...prev,
        hasFailedSubmission: false,
        lastFailedPayload: null,
        retryCount: 0
      }));
      console.log('[DATA-PRESERVATION] Failed submission data cleared');
    } catch (error) {
      console.error('[DATA-PRESERVATION] Failed to clear submission data:', error);
    }
  }, [getStorageKey]);

  const loadFailedSubmission = useCallback((): SubmissionAttempt | null => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        const attempt: SubmissionAttempt = JSON.parse(saved);
        setSubmissionState(prev => ({
          ...prev,
          hasFailedSubmission: true,
          lastFailedPayload: attempt.payload,
          retryCount: attempt.payload.attemptCount
        }));
        console.log('[DATA-PRESERVATION] Failed submission loaded from storage');
        return attempt;
      }
    } catch (error) {
      console.error('[DATA-PRESERVATION] Failed to load submission data:', error);
    }
    return null;
  }, [getStorageKey]);

  const getFailedSubmissionSummary = useCallback(() => {
    if (!submissionState.lastFailedPayload) return null;
    
    const payload = submissionState.lastFailedPayload;
    return {
      hotelName: payload.formData.hotelName,
      timestamp: new Date(payload.timestamp).toLocaleString(),
      attemptCount: payload.attemptCount,
      imageCount: payload.hotelImages.length,
      payloadSize: `${Math.round(JSON.stringify(payload).length / 1024)} KB`
    };
  }, [submissionState.lastFailedPayload]);

  return {
    submissionState,
    submitWithPreservation,
    retryFailedSubmission,
    clearFailedSubmission,
    loadFailedSubmission,
    getFailedSubmissionSummary
  };
}