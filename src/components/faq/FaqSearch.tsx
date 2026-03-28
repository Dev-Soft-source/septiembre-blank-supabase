
import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FaqSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function FaqSearch({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Search FAQs...",
  debounceMs = 300
}: FaqSearchProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery, debounceMs]);
  
  useEffect(() => {
    if (searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);
  
  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
  };
  
  return (
    <>
      <style>
        {`
          .faq-search-input::placeholder {
            color: #ffffff !important;
            opacity: 1 !important;
          }
          .faq-search-input::-webkit-input-placeholder {
            color: #ffffff !important;
            opacity: 1 !important;
          }
          .faq-search-input::-moz-placeholder {
            color: #ffffff !important;
            opacity: 1 !important;
          }
          .faq-search-input:-ms-input-placeholder {
            color: #ffffff !important;
            opacity: 1 !important;
          }
        `}
      </style>
      <div className="relative w-full max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-[#FFF9B0]" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-12 pr-12 py-6 h-14 bg-[#8017B0]/90 border border-[#3300B0]/30 rounded-xl text-white shadow-lg focus:ring-2 focus:ring-[#3300B0]/70 text-lg faq-search-input"
        style={{ 
          color: '#ffffff',
        }}
        aria-label="Search FAQs"
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
     </div>
    </>
  );
}
