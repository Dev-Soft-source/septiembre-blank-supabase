import React, { useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    google: any;
  }
}

interface AddressAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelected?: (place: any) => void;
  onAddressComponents?: (components: any) => void;
  placeholder?: string;
  className?: string;
}

export const AddressAutocomplete = ({
  value = '',
  onChange,
  onPlaceSelected,
  onAddressComponents,
  placeholder,
  className
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        console.log('Google Maps already loaded');
        setIsGoogleMapsLoaded(true);
        return;
      }

      console.log('Loading Google Maps API...');
      
      try {
        // Fetch API key from Supabase Edge Function
        console.log('Calling get-maps-key Edge Function...');
        const { data, error } = await supabase.functions.invoke('get-maps-key');
        
        if (error) {
          console.error('Failed to fetch Google Maps API key:', error);
          return;
        }

        const apiKey = data?.key || data?.apiKey;
        console.log('API key retrieved:', apiKey ? 'Success' : 'Not found');
        
        if (!apiKey) {
          console.warn('Google Maps API key not found - using manual input mode');
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          console.log('Google Maps script already exists in DOM');
          return;
        }

        console.log('Creating Google Maps script...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('Google Maps script loaded successfully');
          setIsGoogleMapsLoaded(true);
        };

        script.onerror = (error) => {
          console.error('Failed to load Google Maps script:', error);
        };

        document.head.appendChild(script);
        console.log('Google Maps script added to document head');
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (isGoogleMapsLoaded && inputRef.current && !autocompleteRef.current) {
      console.log('Initializing Google Places Autocomplete');
      
      try {
        const options = {
          types: ['address'],
          fields: [
            'formatted_address', 
            'address_components', 
            'geometry', 
            'place_id'
          ]
        };

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        console.log('Autocomplete created successfully');

        // Add place selection listener
        autocompleteRef.current.addListener('place_changed', () => {
          console.log('Place changed event fired');
          
          const place = autocompleteRef.current?.getPlace();
          console.log('Selected place:', place);
          
          if (place && place.address_components) {
            const components = {
              street_number: '',
              route: '',
              locality: '',
              administrative_area_level_1: '',
              country: '',
              postal_code: ''
            };

            // Parse address components
            place.address_components.forEach((component: any) => {
              const types = component.types;
              console.log('Address component:', { types, long_name: component.long_name });
              
              if (types.includes('street_number')) {
                components.street_number = component.long_name;
              }
              if (types.includes('route')) {
                components.route = component.long_name;
              }
              if (types.includes('locality')) {
                components.locality = component.long_name;
              }
              if (types.includes('administrative_area_level_1')) {
                components.administrative_area_level_1 = component.long_name;
              }
              if (types.includes('country')) {
                components.country = component.long_name;
              }
              if (types.includes('postal_code')) {
                components.postal_code = component.long_name;
              }
            });

            console.log('Parsed components:', components);

            // Update input value
            if (place.formatted_address) {
              console.log('Setting formatted address:', place.formatted_address);
              setInputValue(place.formatted_address);
              if (onChange) {
                onChange(place.formatted_address);
              }
            }

            // Pass address components to parent
            if (onAddressComponents) {
              console.log('Calling onAddressComponents with:', components);
              onAddressComponents(components);
            }

            if (onPlaceSelected) {
              console.log('Calling onPlaceSelected');
              onPlaceSelected(place);
            }
          } else {
            console.warn('No address components found in place:', place);
          }
        });
        
        console.log('Place changed listener added');
      } catch (error) {
        console.error('Failed to initialize Google Places Autocomplete:', error);
      }
    } else {
      console.log('Autocomplete not ready:', {
        isGoogleMapsLoaded,
        hasInputRef: !!inputRef.current,
        hasAutocompleteRef: !!autocompleteRef.current
      });
    }

    return () => {
      if (autocompleteRef.current) {
        console.log('Cleaning up autocomplete listeners');
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleMapsLoaded, onChange, onPlaceSelected, onAddressComponents]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  // Update input value when prop changes
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

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