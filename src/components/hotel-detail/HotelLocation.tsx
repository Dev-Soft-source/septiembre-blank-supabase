import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface HotelLocationProps {
  hotelId: string;
  latitude: number;
  longitude: number;
  hotelName: string;
  address: string;
  city: string;
  country: string;
}

export function HotelLocation({
  hotelId,
  latitude,
  longitude,
  hotelName,
  address,
  city,
  country
}: HotelLocationProps) {
  const { t } = useTranslation('hotels');
  const [mapKey, setMapKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  // Function to validate if coordinates match the expected region for the address
  const areCoordinatesValid = (lat: number, lng: number, country: string, city: string) => {
    console.log(`Validating coordinates (${lat}, ${lng}) for ${city}, ${country}`);
    
    // Basic validation for common countries/regions
    if (country.toLowerCase().includes('united states') || country.toLowerCase().includes('usa')) {
      // More specific validation for major US states/cities
      const cityLower = city.toLowerCase();
      
      // New York state coordinates: roughly 40.5-45°N, -79.5 to -71.5°W
      if (cityLower.includes('new york') || cityLower.includes('brooklyn') || cityLower.includes('manhattan') || cityLower.includes('queens') || cityLower.includes('bronx')) {
        if (lat < 40.4 || lat > 45.0 || lng > -71.0 || lng < -80.0) {
          console.warn(`Coordinates (${lat}, ${lng}) are invalid for New York area. Expected: lat 40.4-45.0, lng -80.0 to -71.0`);
          return false;
        }
      }
      // General US bounds validation as fallback
      else if (lat < 24 || lat > 49 || lng > -66 || lng < -125) {
        console.warn(`Coordinates (${lat}, ${lng}) seem invalid for US address: ${city}, ${country}`);
        return false;
      }
    }
    
    console.log(`Coordinates validation passed for ${city}, ${country}`);
    return true;
  };

  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(() => {
    console.log(`Initial coordinates check for hotel ${hotelId}: lat=${latitude}, lng=${longitude}, city=${city}, country=${country}`);
    
    // Only use stored coordinates if they exist, are valid numbers, and are geographically reasonable
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      console.log(`Checking if stored coordinates are valid...`);
      if (areCoordinatesValid(latitude, longitude, country, city)) {
        console.log(`Using stored coordinates: (${latitude}, ${longitude})`);
        return { lat: latitude, lng: longitude };
      } else {
        console.warn(`Stored coordinates (${latitude}, ${longitude}) are invalid for ${city}, ${country}. Will force re-geocoding.`);
        return null;
      }
    }
    
    console.log(`No valid stored coordinates found. Will need to geocode.`);
    return null;
  });
  // Geocode address to coordinates if needed
  const geocodeAddress = async (apiKey: string) => {
    console.log(`Geocoding check: coordinates=${coordinates ? 'present' : 'missing'}`);
    
    if (coordinates) {
      console.log('Already have valid coordinates, skipping geocoding');
      return; // Already have coordinates
    }
    
    const fullAddress = [address, city, country].filter(Boolean).join(', ');
    if (!fullAddress.trim()) {
      console.warn('No address available for geocoding');
      return; // No address to geocode
    }

    try {
      console.log(`Starting geocoding for address: "${fullAddress}"`);
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
      console.log('Geocoding URL:', geocodeUrl.replace(apiKey, 'API_KEY_HIDDEN'));
      
      const response = await fetch(geocodeUrl);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Geocoding API response:', data);
      
      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        console.warn('Geocoding failed:', data.status, data.error_message);
        return;
      }
      
      const location = data.results[0].geometry.location;
      const newCoordinates = { lat: location.lat, lng: location.lng };
      
      console.log(`Geocoded new coordinates: (${newCoordinates.lat}, ${newCoordinates.lng})`);
      
      // Validate the new coordinates before using them
      if (!areCoordinatesValid(newCoordinates.lat, newCoordinates.lng, country, city)) {
        console.error(`Geocoded coordinates are still invalid! This suggests an issue with the address or Google's geocoding.`);
        return;
      }
      
      console.log('Setting new valid coordinates in state');
      setCoordinates(newCoordinates);
      
      // Update hotel record with coordinates to avoid future geocoding
      try {
        console.log(`Updating database with new coordinates for hotel ${hotelId}`);
        const { error: updateError } = await supabase
          .from('hotels')
          .update({
            // Geolocation temporarily disabled - lat/lng columns removed
            address: address || ''
          })
          .eq('id', hotelId);
          
        if (updateError) {
          console.error('Failed to update hotel coordinates in database:', updateError);
        } else {
          console.log('Hotel coordinates successfully updated in database');
        }
      } catch (updateErr) {
        console.error('Exception while updating hotel coordinates:', updateErr);
      }
    } catch (err) {
      console.error('Geocoding exception:', err);
    }
  };

  const fetchMapKey = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch from the edge function that securely provides the API key
      const {
        data,
        error
      } = await supabase.functions.invoke('get-maps-key');
      
      let apiKey: string | null = null;
      
      if (error || !data || (!data.key && !data.apiKey)) {
        console.error('Error fetching map key:', error);
        setError("Could not load map key");
        setIsLoading(false);
        return;
      } else {
        console.log('Successfully retrieved API key');
        apiKey = data.key || data.apiKey;
      }
      
      if (apiKey) {
        setMapKey(apiKey);
        setMapReady(true);
        
        // Geocode address if coordinates are missing
        await geocodeAddress(apiKey);
      } else {
        setError("No map key available");
      }
    } catch (err) {
      console.error('Exception fetching map key:', err);
      setError("Error loading map");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMapKey();
  }, []);

  // Generate map URL based on available data
  const getMapUrl = () => {
    if (!mapKey) return null;
    
    if (coordinates) {
      // Use geocoded or existing coordinates
      return `https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${coordinates.lat},${coordinates.lng}&zoom=15`;
    } else {
      // Fallback to address-based map
      const fullAddress = [address, city, country].filter(Boolean).join(', ');
      if (fullAddress.trim()) {
        return `https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${encodeURIComponent(fullAddress)}&zoom=15`;
      }
    }
    return null;
  };

  // Check if we have any location data to display
  const fullAddress = [address, city, country].filter(Boolean).join(', ');
  const hasMapData = coordinates || fullAddress.trim();
  const mapUrl = mapReady ? getMapUrl() : null;
  if (!hasMapData) {
    return null;
  }
  return <div className="w-full h-full">
        {isLoading && <div className="w-full h-full bg-purple-800/30 flex items-center justify-center rounded-lg">
            <p className="text-center text-white">Loading map...</p>
          </div>}
        
        {!isLoading && error && <div className="w-full h-full bg-purple-800/30 flex flex-col items-center justify-center p-4 rounded-lg">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
            <p className="text-center text-white mb-3">
              {error}
            </p>
            <p className="text-sm text-white/70 mb-3">
              Location: {fullAddress || (coordinates ? `${coordinates.lat}, ${coordinates.lng}` : 'No location data')}
            </p>
            <Button variant="outline" size="sm" className="bg-purple-700/40 hover:bg-purple-700/60 border-purple-500" onClick={fetchMapKey}>
              Retry Loading Map
            </Button>
          </div>}
        
        {!isLoading && !error && mapReady && mapUrl && <iframe 
          src={mapUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade" 
          title={`${hotelName} location`}
          className="rounded-lg"
        ></iframe>}
        
        {!isLoading && !error && (!mapReady || !mapUrl) && <div className="w-full h-full bg-purple-800/30 flex items-center justify-center rounded-lg">
            <p className="text-center text-white">
              Location information unavailable.
              <br />
              Location: {fullAddress || (coordinates ? `${coordinates.lat}, ${coordinates.lng}` : 'No location data')}
            </p>
          </div>}
    </div>;
}