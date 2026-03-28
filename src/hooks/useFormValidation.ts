import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: any) => string | null;
}

interface FormField {
  value: any;
  error?: string;
  rules?: ValidationRule;
  touched?: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule>> = {}
) {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields: Record<keyof T, FormField> = {} as any;
    Object.keys(initialValues).forEach(key => {
      initialFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        touched: false,
        rules: validationRules[key as keyof T]
      };
    });
    return initialFields;
  });

  const validateField = useCallback((name: keyof T, value: any): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'This field is required';
    }

    if (value && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Must be no more than ${rules.maxLength} characters`;
      }

      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Please enter a valid format';
      }
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  const updateField = useCallback((name: keyof T, value: any, shouldValidate = true) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true,
        error: shouldValidate ? validateField(name, value) : undefined
      }
    }));
  }, [validateField]);

  const validateAll = useCallback(() => {
    const newFields = { ...fields };
    let hasErrors = false;

    Object.keys(newFields).forEach(key => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, newFields[fieldKey].value);
      newFields[fieldKey] = {
        ...newFields[fieldKey],
        error,
        touched: true
      };
      if (error) hasErrors = true;
    });

    setFields(newFields);
    return !hasErrors;
  }, [fields, validateField]);

  const resetForm = useCallback(() => {
    const resetFields: Record<keyof T, FormField> = {} as any;
    Object.keys(initialValues).forEach(key => {
      resetFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        touched: false,
        error: undefined,
        rules: validationRules[key as keyof T]
      };
    });
    setFields(resetFields);
  }, [initialValues, validationRules]);

  const values = Object.keys(fields).reduce((acc, key) => {
    acc[key as keyof T] = fields[key as keyof T].value;
    return acc;
  }, {} as T);

  const errors = Object.keys(fields).reduce((acc, key) => {
    const fieldError = fields[key as keyof T].error;
    if (fieldError) {
      acc[key as keyof T] = fieldError;
    }
    return acc;
  }, {} as Partial<Record<keyof T, string>>);

  const isValid = Object.values(fields).every(field => !field.error);
  
  return {
    fields,
    values,
    errors,
    isValid,
    updateField,
    validateAll,
    resetForm,
    validateField
  };
}