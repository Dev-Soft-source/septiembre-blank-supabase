import { useAuth } from '@/context/AuthContext';

export const useProfileCompletion = () => {
  const { profile } = useAuth();

  const checkProfileCompletion = () => {
    if (!profile) return { isComplete: false, missingFields: [] };

    const missingFields = [];
    
    if (!profile.first_name) missingFields.push('firstName');
    if (!profile.last_name) missingFields.push('lastName');
    
    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  };

  const { isComplete, missingFields } = checkProfileCompletion();

  return {
    isProfileComplete: isComplete,
    missingFields,
    requiresCompletion: !isComplete
  };
};