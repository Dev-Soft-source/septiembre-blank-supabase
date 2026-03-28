import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { EnhancedTooltip } from "./tooltip-enhanced";
import { HelpCircle } from "lucide-react";

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
  showValidation?: boolean;
  isValid?: boolean;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, label, error, help, showValidation = false, isValid, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    const getValidationState = () => {
      if (!showValidation || !props.value) return '';
      return isValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500';
    };

    return (
      <div className="space-y-1">
        {label && (
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {help && (
              <EnhancedTooltip content={help} variant="help">
                <HelpCircle className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" />
              </EnhancedTooltip>
            )}
          </div>
        )}
        
        <Input
          ref={ref}
          className={cn(
            "transition-all duration-200",
            getValidationState(),
            isFocused && "ring-2 ring-primary/20",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {error && (
          <p className="text-xs text-red-600 mt-1 animate-fade-in">
            {error}
          </p>
        )}
        
        {showValidation && props.value && isValid && (
          <p className="text-xs text-green-600 mt-1 animate-fade-in">
            ✓ Valid
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };