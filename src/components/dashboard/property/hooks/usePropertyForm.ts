
import { useStepManagement } from "./useStepManagement";
import { usePropertyFormData } from "./usePropertyFormData";
import { useValidationState } from "./useValidationState";
import { useSubmissionState } from "./useSubmissionState";
import type { PropertyFormData } from "./usePropertyFormData";

export type { PropertyFormData };

export const usePropertyForm = () => {
  const stepManagement = useStepManagement();
  const formDataManagement = usePropertyFormData();
  const validationState = useValidationState();
  const submissionState = useSubmissionState();

  return {
    ...stepManagement,
    ...formDataManagement,
    ...validationState,
    ...submissionState
  };
};
