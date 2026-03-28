import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, Info } from 'lucide-react';
import { useIdentificationCodes, EntityCodeFormats } from '@/hooks/useIdentificationCodes';
import { cn } from '@/lib/utils';

interface CodeInputProps {
  entityType: keyof EntityCodeFormats;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  excludeId?: string; // For updates, exclude current record from uniqueness check
  showGenerator?: boolean;
  showExamples?: boolean;
  className?: string;
}

export function CodeInput({
  entityType,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  excludeId,
  showGenerator = true,
  showExamples = true,
  className
}: CodeInputProps) {
  const {
    validateCode,
    validateCodeUniqueness,
    generateCode,
    formatCode,
    getCodeExamples,
    getEntityTypeName,
    isValidating,
    isGenerating,
    ENTITY_FORMATS
  } = useIdentificationCodes();

  const [validation, setValidation] = useState<{
    isValid: boolean;
    isUnique?: boolean;
    error?: string;
    suggestion?: string;
  }>({ isValid: false });
  const [hasCheckedUniqueness, setHasCheckedUniqueness] = useState(false);

  const format = ENTITY_FORMATS[entityType];
  const entityName = getEntityTypeName(entityType);
  const examples = getCodeExamples(entityType);

  // Format input on change
  const handleInputChange = (inputValue: string) => {
    const formatted = formatCode(inputValue);
    onChange(formatted);
  };

  // Generate new code
  const handleGenerate = async () => {
    const result = await generateCode(entityType);
    if (result.code) {
      onChange(result.code);
    }
  };

  // Validate format when value changes
  useEffect(() => {
    if (!value) {
      setValidation({ isValid: false });
      setHasCheckedUniqueness(false);
      return;
    }

    const formatValidation = validateCode(value, entityType);
    setValidation(prev => ({ 
      ...prev, 
      isValid: formatValidation.isValid,
      error: formatValidation.error,
      suggestion: formatValidation.suggestion
    }));

    // Reset uniqueness check when format changes
    if (!formatValidation.isValid) {
      setHasCheckedUniqueness(false);
    }
  }, [value, entityType, validateCode]);

  // Check uniqueness when format is valid
  useEffect(() => {
    if (validation.isValid && value && !hasCheckedUniqueness) {
      const checkUniqueness = async () => {
        const uniquenessResult = await validateCodeUniqueness(value, entityType, excludeId);
        setValidation(prev => ({
          ...prev,
          isUnique: uniquenessResult.isUnique,
          error: uniquenessResult.error || prev.error
        }));
        setHasCheckedUniqueness(true);
      };
      
      checkUniqueness();
    }
  }, [validation.isValid, value, entityType, excludeId, hasCheckedUniqueness, validateCodeUniqueness]);

  const getStatusIcon = () => {
    if (isValidating) return <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (!value) return null;
    if (!validation.isValid) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (validation.isValid && validation.isUnique) return <CheckCircle className="h-4 w-4 text-success" />;
    if (validation.isValid && validation.isUnique === false) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    return <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />;
  };

  const getStatusColor = () => {
    if (!value) return '';
    if (!validation.isValid || validation.isUnique === false) return 'border-destructive';
    if (validation.isValid && validation.isUnique) return 'border-success';
    return 'border-warning';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
          <Badge variant="outline" className="text-xs">
            {format.prefix}-{format.hasCommission ? '7 chars' : '6 chars'}
          </Badge>
        </Label>
      )}

      <div className="space-y-3">
        {/* Input with status */}
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder || `${format.prefix}12345${format.hasCommission ? 'A' : ''}`}
            disabled={disabled}
            className={cn('pr-10', getStatusColor())}
            maxLength={format.length}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>

        {/* Generate button */}
        {showGenerator && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate {entityName} Code
              </>
            )}
          </Button>
        )}

        {/* Validation messages */}
        {validation.error && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>{validation.error}</p>
              {validation.suggestion && (
                <p className="text-xs text-muted-foreground mt-1">{validation.suggestion}</p>
              )}
            </div>
          </div>
        )}

        {validation.isValid && validation.isUnique && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            <span>Valid {entityName.toLowerCase()} code</span>
          </div>
        )}

        {/* Format info */}
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-3 w-3" />
            <span className="font-medium">Format Requirements:</span>
          </div>
          <ul className="space-y-1 ml-5">
            <li>• Start with "{format.prefix}" (for {entityName})</li>
            <li>• Followed by 5 digits (0-9)</li>
            {format.hasCommission && <li>• End with a letter (A-Z, except O)</li>}
            <li>• No letter "O" anywhere in the code</li>
            <li>• Total length: {format.length} characters</li>
          </ul>
          
          {showExamples && (
            <div className="mt-3">
              <p className="font-medium mb-1">Examples:</p>
              <div className="flex gap-2 flex-wrap">
                {examples.map((example, index) => (
                  <Badge key={index} variant="secondary" className="text-xs font-mono">
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}