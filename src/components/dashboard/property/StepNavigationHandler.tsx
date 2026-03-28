import React from 'react';

// Step to Accordion Value Mapping
export const STEP_TO_ACCORDION_MAP: Record<number, string> = {
  1: 'basic-info',
  2: 'classification', 
  3: 'property-type',
  4: 'property-style',
  5: 'hotel-description',
  6: 'room-description',
  7: 'complete-phrases',
  8: 'hotel-features',
  9: 'room-features',
  10: 'client-affinities',
  11: 'activities',
  12: 'meal-plan',
  13: 'stay-lengths',
  14: 'check-in-day',
  15: 'availability-packages',
  16: 'package-manager',
  17: 'pricing-matrix'
};

// Accordion Value to Step Number Mapping (reverse lookup)
export const ACCORDION_TO_STEP_MAP: Record<string, number> = Object.fromEntries(
  Object.entries(STEP_TO_ACCORDION_MAP).map(([step, accordion]) => [accordion, parseInt(step)])
);

interface StepNavigationHandlerProps {
  onStepClick: (stepNumber: number) => void;
  currentStep?: number;
}

export const StepNavigationHandler: React.FC<StepNavigationHandlerProps> = ({ 
  onStepClick, 
  currentStep 
}) => {
  
  const handleStepNavigation = (stepNumber: number) => {
    console.log(`[STEP-NAVIGATION] User clicked step ${stepNumber}`);
    
    const accordionValue = STEP_TO_ACCORDION_MAP[stepNumber];
    if (!accordionValue) {
      console.warn(`[STEP-NAVIGATION] No accordion mapping found for step ${stepNumber}`);
      return;
    }
    
    console.log(`[STEP-NAVIGATION] Mapping step ${stepNumber} to accordion value: ${accordionValue}`);
    
    // Call the provided callback
    onStepClick(stepNumber);
    
    // Scroll to the accordion section
    setTimeout(() => {
      const targetElement = document.querySelector(`[value="${accordionValue}"]`) || 
                           document.querySelector(`[data-value="${accordionValue}"]`);
      
      if (targetElement) {
        console.log(`[STEP-NAVIGATION] Successfully found and scrolling to: ${accordionValue}`);
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.error(`[STEP-NAVIGATION] Could not find accordion element for: ${accordionValue}`);
      }
    }, 200);
  };

  // This component doesn't render anything, it's just for logic
  return null;
};

// Utility function to navigate to specific step
export const navigateToStep = (stepNumber: number): void => {
  console.log(`[STEP-NAVIGATION] Direct navigation to step ${stepNumber}`);
  
  const accordionValue = STEP_TO_ACCORDION_MAP[stepNumber];
  if (!accordionValue) {
    console.warn(`[STEP-NAVIGATION] No accordion mapping found for step ${stepNumber}`);
    return;
  }
  
  // Find and trigger the accordion
  const accordionTrigger = document.querySelector(`[data-value="${accordionValue}"] button`) ||
                          document.querySelector(`[value="${accordionValue}"] button`);
  
  if (accordionTrigger) {
    console.log(`[STEP-NAVIGATION] Clicking accordion trigger for: ${accordionValue}`);
    (accordionTrigger as HTMLButtonElement).click();
    
    // Scroll after a brief delay
    setTimeout(() => {
      const targetElement = document.querySelector(`[value="${accordionValue}"]`) || 
                           document.querySelector(`[data-value="${accordionValue}"]`);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  } else {
    console.error(`[STEP-NAVIGATION] Could not find accordion trigger for: ${accordionValue}`);
  }
};