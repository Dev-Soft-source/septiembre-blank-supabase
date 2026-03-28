
import { useToast } from "@/hooks/use-toast";
import { PropertyFormData } from "./usePropertyFormData";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  stepValidation: Record<number, boolean>;
  getIncompleteFields: (step: number, formData: PropertyFormData) => string[];
  setErrorFields: (fields: string[]) => void;
  setShowValidationErrors: (show: boolean) => void;
  setCurrentStep: (step: number) => void;
  formData: PropertyFormData;
  customValidator?: () => boolean;
}

export const useFormNavigation = ({
  currentStep,
  totalSteps,
  stepValidation,
  getIncompleteFields,
  setErrorFields,
  setShowValidationErrors,
  setCurrentStep,
  formData,
  customValidator
}: FormNavigationProps) => {
  const { toast } = useToast();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Modified to allow free navigation without validation
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setShowValidationErrors(false);
      scrollToTop();
    }
  };

  // Modified to allow free navigation without validation
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowValidationErrors(false);
      scrollToTop();
    }
  };

  // Keep validation for final submission only
  const validateCurrentStep = () => {
    // Use custom validator if provided, otherwise use default validation
    if (customValidator) {
      return customValidator();
    }
    
    const isCurrentStepValid = stepValidation[currentStep];
    if (!isCurrentStepValid) {
      const incompleteFields = getIncompleteFields(currentStep, formData);
      setErrorFields(incompleteFields);
      setShowValidationErrors(true);
      
      // Dispatch navigation attempt event
      window.dispatchEvent(new Event('attemptStepNavigation'));
      
      toast({
        title: "Required Fields Incomplete",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });

      return false;
    }
    return true;
  };

  return {
    validateCurrentStep, // Keep this for final submission validation
    goToNextStep,
    goToPreviousStep
  };
};
