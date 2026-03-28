import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    google: any;
    initHotelLocationMap: () => void;
  }
}

interface HotelLocationMapProps {
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  hotelName?: string;
  className?: string;
}

export const HotelLocationMap = ({ 
  address, 
  city, 
  country, 
  latitude, 
  longitude, 
  hotelName, 
  className 
}: HotelLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Fetch Google Maps API key from Edge Function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-maps-key');
        
        if (error) {
          console.warn('Failed to fetch API key from Edge Function:', error);
          setError('Google Maps API key not available');
          return;
        }
        
        if (data?.key || data?.apiKey) {
          setApiKey(data.key || data.apiKey);
        } else {
          setError('No API key returned from server');
        }
      } catch (err) {
        console.warn('Error fetching API key:', err);
        setError('Failed to load Google Maps API key');
      }
    };

    fetchApiKey();
  }, []);

  // Load Google Maps script when API key is available
  useEffect(() => {
    if (!apiKey || isLoading) return;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      setIsLoading(true);
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initHotelLocationMap`;
      script.async = true;
      script.defer = true;
      
      window.initHotelLocationMap = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };

      script.onerror = () => {
        setError('Failed to load Google Maps script');
        setIsLoading(false);
      };

      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        document.head.appendChild(script);
      } else {
        setIsLoaded(true);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, [apiKey]);

  // Initialize map when loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const initializeMap = () => {
      // Use provided coordinates if available, otherwise geocode address
      if (latitude && longitude) {
        const location = new window.google.maps.LatLng(latitude, longitude);
        createMap(location);
      } else if (address || city || country) {
        geocodeAndCreateMap();
      }
    };

    const createMap = (location: any) => {
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: 16,
          center: location,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });
      } else {
        mapInstanceRef.current.setCenter(location);
      }

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add hotel marker
      markerRef.current = new window.google.maps.Marker({
        position: location,
        map: mapInstanceRef.current,
        title: hotelName || `${city}, ${country}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#d946ef',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      });

      // Add info window on marker click
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px;"><strong>${hotelName || 'Hotel Location'}</strong><br/>${address || `${city}, ${country}`}</div>`
      });

      markerRef.current.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, markerRef.current);
      });
    };

    const geocodeAndCreateMap = () => {
      const geocoder = new window.google.maps.Geocoder();
      const searchQuery = [address, city, country].filter(Boolean).join(', ');

      geocoder.geocode({ address: searchQuery }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          createMap(results[0].geometry.location);
        } else {
          setError('Could not find location on map');
        }
      });
    };

    initializeMap();
  }, [isLoaded, address, city, country, latitude, longitude, hotelName]);

  // No location data available
  if (!address && !city && !country && !latitude && !longitude) {
    return (
      <div className={`w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-600">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No location data available</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !apiKey) {
    return (
      <div className={`w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-600">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  // Error state with fallback to static map
  if (error) {
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent([address, city, country].filter(Boolean).join(', '))}&zoom=15&size=400x200&markers=color:purple|${encodeURIComponent([address, city, country].filter(Boolean).join(', '))}&key=${apiKey}`;
    
    return (
      <div className={`w-full h-32 bg-gray-200 rounded-xl overflow-hidden ${className}`}>
        {apiKey ? (
          <img 
            src={staticMapUrl} 
            alt={`Map of ${city}, ${country}`}
            className="w-full h-full object-cover"
            onError={() => {
              // Fallback to icon if even static map fails
              const imgElement = document.querySelector(`img[src="${staticMapUrl}"]`) as HTMLImageElement;
              if (imgElement && imgElement.parentElement) {
                imgElement.parentElement.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center">
                    <div class="text-center text-gray-600">
                      <div class="w-8 h-8 mx-auto mb-2 text-gray-400">📍</div>
                      <p class="text-sm font-medium">Map Error</p>
                      <p class="text-sm">${city}, ${country}</p>
                    </div>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Map Unavailable</p>
              <p className="text-sm">{city}, {country}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Google Maps loaded successfully
  if (!isLoaded) {
    return (
      <div className={`w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-600">
          <MapPin className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Initializing map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-32 rounded-xl overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};