import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthCriteria {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const strengthCriteria: StrengthCriteria[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase', 
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: 'One number',
    test: (password) => /\d/.test(password)
  },
  {
    id: 'special',
    label: 'One special character',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
];

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const passedCriteria = strengthCriteria.filter(criteria => criteria.test(password));
  const strengthPercentage = (passedCriteria.length / strengthCriteria.length) * 100;
  
  const getStrengthColor = () => {
    if (strengthPercentage <= 20) return 'bg-red-500';
    if (strengthPercentage <= 40) return 'bg-orange-500';
    if (strengthPercentage <= 60) return 'bg-yellow-500';
    if (strengthPercentage <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getStrengthLabel = () => {
    if (strengthPercentage <= 20) return 'Very Weak';
    if (strengthPercentage <= 40) return 'Weak';
    if (strengthPercentage <= 60) return 'Fair';
    if (strengthPercentage <= 80) return 'Good';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-300", getStrengthColor())}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 min-w-[60px]">
          {getStrengthLabel()}
        </span>
      </div>
      
      {/* Criteria checklist */}
      <div className="space-y-1">
        {strengthCriteria.map((criteria) => {
          const passed = criteria.test(password);
          return (
            <div key={criteria.id} className="flex items-center gap-2 text-xs">
              <div className={cn(
                "w-3 h-3 rounded-full flex items-center justify-center text-white text-[8px] font-bold transition-colors duration-200",
                passed ? "bg-green-500" : "bg-gray-300"
              )}>
                {passed && '✓'}
              </div>
              <span className={cn(
                "transition-colors duration-200",
                passed ? "text-green-700" : "text-gray-500"
              )}>
                {criteria.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}