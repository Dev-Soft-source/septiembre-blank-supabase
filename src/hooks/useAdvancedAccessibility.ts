import { useEffect, useRef, useCallback, useState } from 'react';
import { useStableCallback } from './useStableCallback';

interface LiveRegionConfig {
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: string;
}

/**
 * Advanced accessibility hook for live regions and announcements
 */
export function useLiveRegion(config: LiveRegionConfig = {}) {
  const { politeness = 'polite', atomic = false, relevant = 'additions text' } = config;
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useStableCallback((message: string, urgency: 'polite' | 'assertive' = politeness === 'off' ? 'polite' : politeness) => {
    if (!liveRegionRef.current) return;

    // Clear previous content
    liveRegionRef.current.textContent = '';
    
    // Update politeness if different
    liveRegionRef.current.setAttribute('aria-live', urgency);
    
    // Announce after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
      }
    }, 100);
  });

  const clear = useStableCallback(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
    }
  });

  return {
    liveRegionRef,
    announce,
    clear,
    liveRegionProps: {
      'aria-live': politeness,
      'aria-atomic': atomic,
      'aria-relevant': relevant,
      className: 'sr-only'
    }
  };
}

interface SkipLinkConfig {
  targetId: string;
  label?: string;
  className?: string;
}

/**
 * Advanced skip link management
 */
export function useSkipLinks(links: SkipLinkConfig[]) {
  const [isVisible, setIsVisible] = useState(false);
  const skipLinksRef = useRef<HTMLDivElement>(null);

  const showSkipLinks = useStableCallback(() => setIsVisible(true));
  const hideSkipLinks = useStableCallback(() => setIsVisible(false));

  const skipTo = useStableCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    hideSkipLinks();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        showSkipLinks();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSkipLinks]);

  return {
    skipLinksRef,
    isVisible,
    showSkipLinks,
    hideSkipLinks,
    skipTo,
    links
  };
}

interface ComboboxConfig<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  onSelect: (option: T | null) => void;
  placeholder?: string;
  noOptionsMessage?: string;
}

/**
 * Advanced combobox (autocomplete) with full keyboard navigation
 */
export function useCombobox<T>(config: ComboboxConfig<T>) {
  const {
    options,
    getOptionLabel,
    getOptionValue,
    onSelect,
    placeholder = 'Search...',
    noOptionsMessage = 'No options found'
  } = config;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const filteredOptions = options.filter(option =>
    getOptionLabel(option).toLowerCase().includes(query.toLowerCase())
  );

  const selectOption = useStableCallback((option: T | null) => {
    onSelect(option);
    setQuery(option ? getOptionLabel(option) : '');
    setIsOpen(false);
    setHighlightedIndex(-1);
  });

  const handleInputKeyDown = useStableCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      
      case 'Tab':
        setIsOpen(false);
        break;
    }
  });

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest'
      });
    }
  }, [highlightedIndex]);

  return {
    // Input props
    inputProps: {
      ref: inputRef,
      value: query,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
        setHighlightedIndex(-1);
      },
      onKeyDown: handleInputKeyDown,
      onFocus: () => setIsOpen(true),
      onBlur: () => setTimeout(() => setIsOpen(false), 200),
      placeholder,
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox',
      'aria-activedescendant': highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined,
      role: 'combobox',
      autoComplete: 'off'
    },
    
    // Listbox props
    listboxProps: {
      ref: listboxRef,
      role: 'listbox',
      'aria-label': 'Options'
    },
    
    // State
    isOpen,
    filteredOptions,
    highlightedIndex,
    noOptionsMessage,
    
    // Helpers
    getOptionProps: (option: T, index: number) => ({
      ref: (el: HTMLLIElement | null) => {
        optionRefs.current[index] = el;
      },
      id: `option-${index}`,
      role: 'option',
      'aria-selected': highlightedIndex === index,
      onClick: () => selectOption(option),
      onMouseEnter: () => setHighlightedIndex(index),
      className: highlightedIndex === index ? 'highlighted' : ''
    }),
    
    selectOption,
    setIsOpen
  };
}