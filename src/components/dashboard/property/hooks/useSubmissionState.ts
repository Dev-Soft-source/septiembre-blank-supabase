
import { useState } from "react";

export const useSubmissionState = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasNewItems, setHasNewItems] = useState(false);

  return {
    isSubmitted,
    setIsSubmitted,
    submitSuccess,
    setSubmitSuccess,
    hasNewItems,
    setHasNewItems
  };
};
