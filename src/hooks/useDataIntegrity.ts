import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DataIntegrityResult {
  success: boolean;
  error?: string;
  orphanedRecords?: string[];
}

interface ImageUploadValidation {
  allImagesUploaded: boolean;
  failedUploads: string[];
  retryableUploads: string[];
}

export function useDataIntegrity() {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // ⚠️ CRITICAL SAFEGUARD: 
  // This validation layer must NEVER hardcode field requirements.
  // ALL required field validation MUST be handled by the Zod schema in NewHotelRegistrationForm.tsx
  // Any hardcoded 'required' validations here create phantom validation errors.

  // Validate image upload integrity
  const validateImageUploads = useCallback((
    hotelImages: any[],
    roomImages: any[]
  ): ImageUploadValidation => {
    const allImages = [...hotelImages, ...roomImages];
    const failedUploads: string[] = [];
    const retryableUploads: string[] = [];

    allImages.forEach((image, index) => {
      // SURGICAL FIX: Only fail if image has NO URL at all
      // Accept blob URLs, permanent URLs, and any valid URL format
      // Images with blob URLs are valid for submission (they'll be converted during upload)
      if (!image.url && !image.file) {
        failedUploads.push(`Image ${index + 1}`);
      }
    });

    console.log('[DATA-INTEGRITY] Image validation results:', {
      totalImages: allImages.length,
      failedUploads: failedUploads.length,
      imageDetails: allImages.map((img, i) => ({
        index: i + 1,
        hasUrl: !!img.url,
        hasFile: !!img.file,
        urlType: img.url ? (img.url.startsWith('blob:') ? 'blob' : 'permanent') : 'none'
      }))
    });

    return {
      allImagesUploaded: failedUploads.length === 0,
      failedUploads,
      retryableUploads
    };
  }, []);

  // Clean up orphaned data when hotel is deleted
  const cleanupOrphanedData = useCallback(async (hotelId: string): Promise<DataIntegrityResult> => {
    setIsValidating(true);
    const orphanedRecords: string[] = [];
    
    try {
      // Delete hotel images
      const { error: imagesError } = await supabase
        .from('hotel_images')
        .delete()
        .eq('hotel_id', hotelId);
      
      if (imagesError) throw imagesError;
      orphanedRecords.push('hotel_images');

      // Delete hotel themes
      const { error: themesError } = await supabase
        .from('hotel_themes')
        .delete()
        .eq('hotel_id', hotelId);
      
      if (themesError) throw themesError;
      orphanedRecords.push('hotel_themes');

      // Delete hotel activities
      const { error: activitiesError } = await supabase
        .from('hotel_activities')
        .delete()
        .eq('hotel_id', hotelId);
      
      if (activitiesError) throw activitiesError;
      orphanedRecords.push('hotel_activities');

      // Delete availability packages
      const { error: packagesError } = await supabase
        .from('availability_packages')
        .delete()
        .eq('hotel_id', hotelId);
      
      if (packagesError) throw packagesError;
      orphanedRecords.push('availability_packages');

      // Delete hotel availability
      const { error: availabilityError } = await supabase
        .from('hotel_availability')
        .delete()
        .eq('hotel_id', hotelId);
      
      if (availabilityError) throw availabilityError;
      orphanedRecords.push('hotel_availability');

      // Delete bookings (optional - might want to keep for records)
      const { error: bookingsError } = await supabase
        .from('bookings')
        .delete()
        .eq('hotel_id', hotelId);
      
      if (bookingsError) throw bookingsError;
      orphanedRecords.push('bookings');

      return {
        success: true,
        orphanedRecords
      };
    } catch (error) {
      console.error('Error cleaning up orphaned data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        orphanedRecords
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Check for duplicate hotel submissions
  const checkDuplicateSubmission = useCallback(async (
    hotelName: string,
    contactEmail: string,
    userId: string
  ): Promise<{ isDuplicate: boolean; existingHotelId?: string }> => {
    try {
      const { data: existingHotels } = await supabase
        .from('hotels')
        .select('id, name, contact_email, status')
        .eq('owner_id', userId)
        .or(`name.eq.${hotelName},contact_email.eq.${contactEmail}`);

      if (existingHotels && existingHotels.length > 0) {
        // Check for exact matches or pending submissions
        const duplicate = existingHotels.find(hotel => 
          (hotel.name === hotelName && hotel.contact_email === contactEmail) ||
          hotel.status === 'pending'
        );

        if (duplicate) {
          return {
            isDuplicate: true,
            existingHotelId: duplicate.id
          };
        }
      }

      return { isDuplicate: false };
    } catch (error) {
      console.error('Error checking duplicate submission:', error);
      return { isDuplicate: false };
    }
  }, []);

  // Validate data consistency before submission
  const validateDataConsistency = useCallback((formData: any): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    // SURGICAL FIX: Only validate fields that are actually required in the Zod schema
    // WARNING: Keep this aligned with hotelRegistrationSchema in NewHotelRegistrationForm.tsx
    
    // Only hotel name is required in current schema
    if (!formData.hotelName?.trim()) {
      errors.push('Hotel name is required');
    }

    // REMOVED PHANTOM VALIDATIONS:
    // - country (optional in schema)
    // - contactEmail (optional in schema)
    
    console.log('[DATA-INTEGRITY-FIX] Validating data consistency, only checking required fields:', {
      hotelName: !!formData.hotelName?.trim(),
      phantomValidationsRemoved: ['country', 'contactEmail']
    });

    // Check image consistency
    if (formData.photos) {
      const { allImagesUploaded, failedUploads } = validateImageUploads(
        formData.photos.hotel || [],
        formData.photos.room || []
      );

      if (!allImagesUploaded) {
        errors.push(`Image upload failures: ${failedUploads.join(', ')}`);
      }
    }

    // Check availability packages consistency
    if (formData.availabilityPackages?.length > 0) {
      formData.availabilityPackages.forEach((pkg: any, index: number) => {
        if (!pkg.startDate || !pkg.endDate) {
          errors.push(`Availability package ${index + 1}: Missing dates`);
        }
        if (new Date(pkg.endDate) <= new Date(pkg.startDate)) {
          errors.push(`Availability package ${index + 1}: End date must be after start date`);
        }
        if (!pkg.availableRooms || pkg.availableRooms < 1) {
          errors.push(`Availability package ${index + 1}: Must have at least 1 available room`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [validateImageUploads]);

  return {
    isValidating,
    validateImageUploads,
    cleanupOrphanedData,
    checkDuplicateSubmission,
    validateDataConsistency
  };
}
