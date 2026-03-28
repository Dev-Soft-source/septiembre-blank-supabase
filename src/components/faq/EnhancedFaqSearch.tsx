import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { sanitizeSearchQuery, searchQuerySchema, validateAndSanitize } from "@/security/validators";
import { useStableCallback } from "@/hooks/useStableCallback";

interface EnhancedFaqSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  onValidationError?: (errors: string[]) => void;
}

export function EnhancedFaqSearch({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Search FAQs...",
  debounceMs = 300,
  onValidationError
}: EnhancedFaqSearchProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Stable callback to prevent unnecessary re-renders
  const handleQueryUpdate = useStableCallback((query: string) => {
    // Sanitize input for security
    const sanitizedQuery = sanitizeSearchQuery(query);
    
    // Validate the sanitized query
    const validation = validateAndSanitize(sanitizedQuery, searchQuerySchema);
    
    if (validation.success) {
      setSearchQuery(validation.data);
      setValidationErrors([]);
      return;
    }
    
    // Handle validation failure - we know it's the error case after the early return
    const errorResult = validation as { success: false; errors: string[] };
    setValidationErrors(errorResult.errors);
    if (onValidationError) {
      onValidationError(errorResult.errors);
    }
    // Still allow the search but with sanitized input
    setSearchQuery(sanitizedQuery);
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleQueryUpdate(inputValue);
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [inputValue, handleQueryUpdate, debounceMs]);
  
  useEffect(() => {
    if (searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);
  
  const handleClearSearch = useStableCallback(() => {
    setInputValue("");
    setSearchQuery("");
    setValidationErrors([]);
  });
  
  const handleInputChange = useStableCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  });
  
  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-[#FFF9B0]" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="pl-12 pr-12 py-6 h-14 bg-[#8017B0]/90 border border-[#3300B0]/30 rounded-xl text-[#FFF9B0] shadow-lg focus:ring-2 focus:ring-[#3300B0]/70 text-lg"
        aria-label="Search FAQs"
        aria-invalid={validationErrors.length > 0}
        aria-describedby={validationErrors.length > 0 ? "search-errors" : undefined}
      />
      
      {inputValue && (
        <button
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-4 flex items-center text-[#FFF9B0] hover:text-[#FFF9B0]/80 transition-colors"
          aria-label="Clear search"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      
      {validationErrors.length > 0 && (
        <div 
          id="search-errors" 
          className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-200 text-sm"
          role="alert"
        >
          <span className="font-medium">Search validation:</span>
          <ul className="mt-1">
            {validationErrors.map((error, index) => (
              <li key={`search-error-${index}`}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}