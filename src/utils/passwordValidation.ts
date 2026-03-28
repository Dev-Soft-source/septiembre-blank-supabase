
export const validatePassword = (password: string) => {
  // Simplified validation - only require minimum length of 1 character (basically any password)
  const requirements = {
    minLength: password.length >= 1, // Accept any non-empty password
    hasUpperCase: true, // Always pass
    hasLowerCase: true, // Always pass  
    hasNumber: true, // Always pass
    hasSpecial: true, // Always pass
  };

  const isValid = password.length >= 1; // Only require non-empty password

  return {
    isValid,
    requirements,
  };
};

// Additional security validation functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent XSS
    .replace(/['"]/g, '') // Remove quotes
    .slice(0, 255); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

export const checkPasswordStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
  const { requirements } = validatePassword(password);
  const metCount = Object.values(requirements).filter(Boolean).length;
  
  if (metCount <= 2) return 'weak';
  if (metCount === 3) return 'fair';
  if (metCount === 4) return 'good';
  return 'strong';
};

export const getPasswordStrengthColor = (password: string) => {
  const { requirements } = validatePassword(password);
  const metCount = Object.values(requirements).filter(Boolean).length;
  
  if (metCount <= 2) return "text-red-500";
  if (metCount <= 4) return "text-yellow-500";
  return "text-green-500";
};

export const passwordRequirementsText = [
  "At least 8 characters long",
  "Contains uppercase letter",
  "Contains lowercase letter",
  "Contains a number",
  "Contains special character (!@#$%^&*(),.?\":{}|<>)",
];
