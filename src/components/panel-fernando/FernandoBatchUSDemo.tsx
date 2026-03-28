import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, CheckCircle, AlertCircle, Star, Clock, Utensils, Flag } from "lucide-react";

interface USBatchResult {
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
      category: string;
      stayDurations: number[];
      mealPlan: string;
      pricePerMonth: number;
    }>;
  };
}

export default function FernandoBatchUSDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<USBatchResult | null>(null);

  const handleCreateUSDemo = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('batch-create-us-demo-hotels', {
        body: {}
      });

      if (error) {
        console.error('Error calling batch-create-us-demo-hotels:', error);
        setResult({
          success: false,
          message: 'Failed to create US demo hotels',
          stats: {
            totalCreated: 0,
            errors: [error.message],
            hotelDetails: []
          }
        });
        return;
      }

      console.log('US Demo batch creation response:', data);
      setResult(data);
    } catch (error) {
      console.error('Exception during US demo batch creation:', error);
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
            <Flag className="w-5 h-5" />
            US Demo Hotels Batch Generator
          </CardTitle>
          <CardDescription className="text-white opacity-80 text-sm">
            Generate 60 real-looking demo hotels in the United States with specific combinations of categories, durations, and meal plans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-3">Generation Specifications:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white opacity-80">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-white" />
                  <span className="font-medium">Categories:</span> 3★, 4★, 5★ (20 hotels each)
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="font-medium">Stay Durations:</span> 8, 15, 22, 29 nights
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-white" />
                  <span className="font-medium">Meal Plans:</span> None, Breakfast, Half Board, Full Board, All Inclusive
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="font-medium">Location:</span> United States (real cities)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="font-medium">Hotels:</span> Real names and addresses
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="font-medium">Bookable:</span> Demo mode (not reservable)
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-300/30 rounded">
              <p className="text-sm text-white">
                <strong>Total:</strong> 60 hotels covering all combinations of 3 categories × 4 durations × 5 meal plans
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleCreateUSDemo}
              disabled={isLoading}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating 60 US Demo Hotels...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4 mr-2" />
                  Generate 60 US Demo Hotels
                </>
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
              Generation Results
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
                    <h4 className="font-medium mb-2">Generated US Demo Hotels:</h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {result.stats.hotelDetails.map((hotel) => (
                        <div key={hotel.id} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="font-medium text-lg">{hotel.name}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                <MapPin className="w-3 h-3" />
                                {hotel.city}, {hotel.country}
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                <span className="font-medium">Category:</span> {hotel.category}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">Durations:</span> {hotel.stayDurations?.join(', ') || 'N/A'} nights
                              </div>
                              <div className="flex items-center gap-1">
                                <Utensils className="w-3 h-3" />
                                <span className="font-medium">Meal Plan:</span> {hotel.mealPlan}
                              </div>
                              <div className="text-xs text-gray-500">
                                💰 ${hotel.pricePerMonth}/month | ID: {hotel.id.substring(0, 8)}...
                              </div>
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
                        <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
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
}