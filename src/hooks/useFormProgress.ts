import { useMemo } from 'react';

interface FormField {
  value: any;
  required?: boolean;
}

interface UseFormProgressProps {
  fields: Record<string, FormField>;
}

export function useFormProgress({ fields }: UseFormProgressProps) {
  const progress = useMemo(() => {
    const fieldEntries = Object.entries(fields);
    const totalFields = fieldEntries.length;
    
    if (totalFields === 0) return 0;
    
    const completedFields = fieldEntries.filter(([_, field]) => {
      if (field.required === false) return true; // Optional fields count as complete
      
      const value = field.value;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return !isNaN(value);
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return true;
      return value != null && value !== '';
    }).length;
    
    return Math.round((completedFields / totalFields) * 100);
  }, [fields]);

  const isComplete = progress === 100;
  
  return {
    progress,
    isComplete,
  };
}