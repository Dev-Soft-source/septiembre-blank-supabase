import React, { useState, useRef, useEffect } from 'react';

interface SearchSuggestionsProps {
  suggestions: Array<{
    text: string;
    type: 'recent' | 'popular' | 'completion';
  }>;
  onSuggestionSelect: (suggestion: string) => void;
  isVisible: boolean;
  currentQuery: string;
}

export function SearchSuggestions({ 
  suggestions, 
  onSuggestionSelect, 
  isVisible,
  currentQuery 
}: SearchSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions, currentQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            onSuggestionSelect(suggestions[selectedIndex].text);
          }
          break;
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSuggestionSelect]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return '🕒';
      case 'popular':
        return '🔥';
      case 'completion':
        return '💡';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1"
      role="listbox"
      aria-label="Search suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={`${suggestion.type}-${index}`}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 first:rounded-t-md last:rounded-b-md transition-colors ${
            index === selectedIndex ? 'bg-muted' : ''
          }`}
          onClick={() => onSuggestionSelect(suggestion.text)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <span className="flex items-center gap-2">
            <span className="text-xs opacity-60">
              {getTypeIcon(suggestion.type)}
            </span>
            <span className="text-foreground">
              {suggestion.text}
            </span>
            {suggestion.type === 'recent' && (
              <span className="ml-auto text-xs text-muted-foreground">
                Recent
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}