
import { useToast } from "@/hooks/use-toast";
import { PropertyFormData } from "./usePropertyFormData";
import { supabase } from "@/integrations/supabase/client";

interface PropertySubmissionProps {
  formData: PropertyFormData;
  setIsSubmitted: (value: boolean) => void;
  setSubmitSuccess: (value: boolean) => void;
  setErrorFields: (fields: string[]) => void;
  setShowValidationErrors: (show: boolean) => void;
  userId?: string;
  onDoneEditing?: () => void;
}

export const usePropertySubmission = ({
  formData,
  setIsSubmitted,
  setSubmitSuccess,
  setErrorFields,
  setShowValidationErrors,
  userId,
  onDoneEditing
}: PropertySubmissionProps) => {
  const { toast } = useToast();

  const handleSubmitProperty = async (editingHotelId: string | null = null) => {
    // Set submission lock to prevent auto-save conflicts
    localStorage.setItem('submission_in_progress', 'true');
    setIsSubmitted(true);
    setShowValidationErrors(false);
    
    try {
      // Call the hotel registration edge function
      const { data, error } = await supabase.functions.invoke('submit-hotel-registration', {
        body: {
          hotel_data: formData,
          availability_packages: formData.availabilityPackages || [],
          hotel_images: formData.hotelImages || [],
          hotel_themes: formData.themes || formData.affinities || [],
          hotel_activities: formData.activities || [],
          dev_mode: true // Enable development mode
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error?.message?.en || 'Hotel registration failed');
      }

      setSubmitSuccess(true);
      
      toast({
        title: "Property Submitted",
        description: "Your property has been submitted successfully.",
        duration: 3000
      });
      
      if (onDoneEditing) {
        onDoneEditing();
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitSuccess(false);
      setIsSubmitted(false);
      
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your property. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      // Always release submission lock
      localStorage.removeItem('submission_in_progress');
    }
  };

  return { 
    handleSubmitProperty, 
    showFallback: false, 
    handleFallbackRedirect: () => {} 
  };
};
