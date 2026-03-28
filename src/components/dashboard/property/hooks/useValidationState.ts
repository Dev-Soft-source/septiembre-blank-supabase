
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PropertyFormData } from "./usePropertyFormData";

export const useValidationState = () => {
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const { toast } = useToast();

  const getIncompleteFields = (step: number, formData: PropertyFormData): string[] => {
    switch (step) {
      case 1:
        // Only check for hotel name
        return !formData.hotelName ? ["Property Name"] : [];
      case 2:
        // No required fields for step 2
        return [];
      case 3:
        // No required fields for step 3
        return [];
      case 4:
        // No required fields for step 4
        return [];
      default:
        return [];
    }
  };

  return {
    errorFields,
    setErrorFields,
    showValidationErrors,
    setShowValidationErrors,
    getIncompleteFields,
    toast
  };
};
