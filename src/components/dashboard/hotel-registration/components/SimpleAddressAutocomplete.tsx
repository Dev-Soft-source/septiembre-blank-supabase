import React, { useRef, useEffect, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { supabase } from '@/integrations/supabase/client';

interface SimpleAddressAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onAddressComponents?: (components: any) => void;
  placeholder?: string;
  className?: string;
}

export const SimpleAddressAutocomplete = ({
  value = '',
  onChange,
  onAddressComponents,
  placeholder,
  className
}: SimpleAddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const { isLoaded, error } = useGoogleMaps();

  // Fetch Google Maps API key from secure edge function
  const fetchGoogleMapsApiKey = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-maps-key');
      
      if (error) {
        console.error('Error fetching Google Maps API key:', error);
        return null;
      }
      
      return data?.apiKey || data?.key || null;
    } catch (error) {
      console.error('Failed to fetch Google Maps API key:', error);
      return null;
    }
  };

  const setupAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'address_components', 'geometry']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (place.formatted_address) {
        setInputValue(place.formatted_address);
        onChange?.(place.formatted_address);
      }

      if (place.address_components && onAddressComponents) {
        const components: any = {
          locality: '',
          country: '',
          postal_code: ''
        };

        place.address_components.forEach((component: any) => {
          const types = component.types;
          
          if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            components.locality = component.long_name;
          }
          if (types.includes('country')) {
            components.country = component.long_name;
          }
          if (types.includes('postal_code')) {
            components.postal_code = component.long_name;
          }
        });

        onAddressComponents(components);
      }
    });
  };

  useEffect(() => {
    if (isLoaded) {
      setupAutocomplete();
    }
  }, [isLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  if (error) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || "Enter address (manual entry)"}
        className={className}
        autoComplete="off"
        title="Google Maps unavailable - manual entry only"
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder || "Enter address"}
      className={className}
      autoComplete="off"
    />
  );
};