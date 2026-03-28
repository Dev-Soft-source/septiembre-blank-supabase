
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, CheckCircle, AlertCircle, MapPin, Building, Palette } from "lucide-react";

interface BatchResult {
  success: boolean;
  message: string;
  stats: {
    totalCreated: number;
    errors: string[];
    hotelDetails: Array<{
      id: string;
      name: string;
      city: string;
      country: string;
      address?: string;
      postal_code?: string;
      property_type?: string;
      style?: string;
      latitude?: number;
      longitude?: number;
    }>;
  };
}

export const BatchHotelCreation = () => {
  const [count, setCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);

  const handleCreateHotels = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('batch-hotel-creation', {
        body: { count }
      });

      if (error) {
        console.error('Error calling batch-hotel-creation:', error);
        setResult({
          success: false,
          message: 'Failed to create hotels',
          stats: {
            totalCreated: 0,
            errors: [error.message],
            hotelDetails: []
          }
        });
        return;
      }

      console.log('Batch creation response:', data);
      setResult(data);
    } catch (error) {
      console.error('Exception during batch creation:', error);
      setResult({
        success: false,
        message: 'An unexpected error occurred',
        stats: {
          totalCreated: 0,
          errors: ['Network error'],
          hotelDetails: []
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-purple-700 border-purple-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-semibold">
            <Plus className="w-5 h-5" />
            Batch Hotel Creation
          </CardTitle>
          <CardDescription className="text-white opacity-80 text-sm">
            Create multiple hotels with complete mandatory fields including addresses, coordinates, property types, and styles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">Mandatory Fields Included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white opacity-80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                Complete Address (Street, City, Country, Postal Code)
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                GPS Coordinates (Latitude, Longitude)
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-white" />
                Property Type (Hotel/Resort/Boutique)
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-white" />
                Property Style (Classic/Modern/Luxury/etc.)
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                Full Month Availability
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                Half Board Meal Plan
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="hotel-count" className="block text-sm font-medium mb-2 text-white">
                Number of hotels to create
              </label>
              <Input
                id="hotel-count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleCreateHotels}
              disabled={isLoading}
              className="mt-6 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Hotels with Complete Data...
                </>
              ) : (
                `Create ${count} Hotels with Full Address Data`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              Creation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertDescription>
                {result.message}
              </AlertDescription>
            </Alert>

            {result.stats && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Hotels Created</p>
                    <p className="text-2xl font-bold text-green-800">{result.stats.totalCreated}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Errors</p>
                    <p className="text-2xl font-bold text-red-800">{result.stats.errors.length}</p>
                  </div>
                </div>

                {result.stats.hotelDetails.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Created Hotels with Complete Address Data:</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {result.stats.hotelDetails.map((hotel) => (
                        <div key={hotel.id} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="font-medium text-lg">{hotel.name}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                <MapPin className="w-3 h-3" />
                                {hotel.city}, {hotel.country}
                              </div>
                              {hotel.address && (
                                <p className="text-sm text-gray-600">📍 {hotel.address}</p>
                              )}
                              {hotel.postal_code && (
                                <p className="text-sm text-gray-600">📮 {hotel.postal_code}</p>
                              )}
                            </div>
                            <div className="space-y-1 text-sm">
                              {hotel.property_type && (
                                <div className="flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  <span className="font-medium">Type:</span> {hotel.property_type}
                                </div>
                              )}
                              {hotel.style && (
                                <div className="flex items-center gap-1">
                                  <Palette className="w-3 h-3" />
                                  <span className="font-medium">Style:</span> {hotel.style}
                                </div>
                              )}
                              {hotel.latitude && hotel.longitude && (
                                <div className="text-xs text-gray-500">
                                  📍 {hotel.latitude.toFixed(4)}, {hotel.longitude.toFixed(4)}
                                </div>
                              )}
                              <p className="text-xs text-gray-500">ID: {hotel.id}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.stats.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Errors:</h4>
                    <div className="space-y-1">
                      {result.stats.errors.map((error, index) => (
                        <p key={`error-${index}`} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
