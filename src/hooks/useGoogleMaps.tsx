import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface UseGoogleMapsProps {
  skipLoading?: boolean;
}

let scriptLoadingPromise: Promise<void> | null = null;

export const useGoogleMaps = ({ skipLoading = false }: UseGoogleMapsProps = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoogleMapsApiKey = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("get-maps-key");
      if (error) {
        console.error("Error fetching Google Maps API key:", error);
        return null;
      }
      return data?.apiKey || data?.key || null;
    } catch (err) {
      console.error("Failed to fetch Google Maps API key:", err);
      return null;
    }
  }, []);

  const loadGoogleMapsScript = useCallback(async () => {
    if (skipLoading) {
      return;
    }

    // Already available
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    if (scriptLoadingPromise) {
      return scriptLoadingPromise;
    }

    setIsLoading(true);
    setError(null);

    const apiKey = await fetchGoogleMapsApiKey();
    if (!apiKey) {
      setError("Google Maps API key not available");
      setIsLoading(false);
      return;
    }

    // Use a single global promise
    scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src*="maps.googleapis.com/maps/api/js"]`
      );

      if (existingScript) {
        // If script already exists, just wait for it
        if (window.google?.maps) {
          setIsLoaded(true);
          setIsLoading(false);
          resolve();
        } else {
          existingScript.addEventListener("load", () => {
            setIsLoaded(true);
            setIsLoading(false);
            resolve();
          });
          existingScript.addEventListener("error", () => {
            setError("Failed to load Google Maps API");
            setIsLoading(false);
            reject();
          });
        }
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
        resolve();
      };

      script.onerror = () => {
        setError("Failed to load Google Maps API");
        setIsLoading(false);
        reject();
      };

      document.head.appendChild(script);
    });

    return scriptLoadingPromise;
  }, [skipLoading, fetchGoogleMapsApiKey]);

  const retryLoading = useCallback(() => {
    if (skipLoading) return;
    setError(null);
    setIsLoading(false);
    scriptLoadingPromise = null; // reset
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript, skipLoading]);

  useEffect(() => {
    if (!skipLoading) {
      loadGoogleMapsScript();
    }
  }, [loadGoogleMapsScript, skipLoading]);

  return {
    isLoaded: skipLoading ? false : isLoaded,
    isLoading: skipLoading ? false : isLoading,
    error: skipLoading ? null : error,
    retryLoading,
  };
};
