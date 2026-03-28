
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface ApiError {
  message?: string;
}

export const handleApiError = (
  error: PostgrestError | ApiError | unknown,
  defaultMessage: string = "An error occurred",
  toastFn?: typeof toast
) => {
  // Extract error message
  let errorMessage = defaultMessage;

  if (error && typeof error === 'object') {
    if ('message' in error && error.message) {
      errorMessage = error.message as string;
    } else if ('error' in error && error.error) {
      errorMessage = error.error as string;
    }
  }

  // Log the error for debugging
  console.error("API Error:", errorMessage, error);

  // Display toast notification if toast function is provided
  if (toastFn) {
    toastFn.error("Error", {
      description: errorMessage
    });
  }

  return errorMessage;
};

// Add the missing handleSupabaseError function that useRelatedDataSubmission is trying to use
export const handleSupabaseError = (
  error: PostgrestError | unknown,
  defaultMessage: string = "An error occurred with the database operation"
) => {
  return handleApiError(error, defaultMessage);
};
